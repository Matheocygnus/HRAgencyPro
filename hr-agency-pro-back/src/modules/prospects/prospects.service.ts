import { BadRequestException, ConflictException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Prospect } from './entities/prospect.entity';
import { Hero } from '../heroes/entities/hero.entity';
import { Contract } from '../contracts/entities/contract.entity';
import { Invoice } from '../invoices/entities/invoice.entity';
import { CreateProspectDto } from './dto/create-prospect.dto';
import { UpdateProspectDto } from './dto/update-prospect.dto';
import { PromoteProspectDto } from './dto/promote-prospect.dto';
import { EmailService } from '../../integrations/email/email.service';
import * as path from 'path';

const VALID_STATUSES = ['sourcing', 'contacted', 'interview', 'client_review', 'budget', 'contract', 'hired', 'rejected'];

// Maps lowercase CSV header variants to entity field names
const HEADER_MAP: Record<string, keyof CreateProspectDto> = {
  firstname: 'firstName', first_name: 'firstName',
  lastname: 'lastName', last_name: 'lastName',
  email: 'email',
  phone: 'phone',
  position: 'position',
  skills: 'skills',
  status: 'status',
  notes: 'notes',
};

function parseCsvRow(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

@Injectable()
export class ProspectsService {
  private readonly logger = new Logger(ProspectsService.name);

  constructor(
    @InjectRepository(Prospect)
    private readonly prospectRepository: Repository<Prospect>,
    private readonly dataSource: DataSource,
    private readonly emailService: EmailService,
  ) {}

  findAll(): Promise<Prospect[]> {
    return this.prospectRepository.find();
  }

  async findOne(id: number): Promise<Prospect> {
    const prospect = await this.prospectRepository.findOne({ where: { id } });
    if (!prospect) throw new NotFoundException(`Prospect #${id} not found`);
    return prospect;
  }

  create(dto: CreateProspectDto): Promise<Prospect> {
    const prospect = this.prospectRepository.create({
      ...dto,
      position: dto.position ?? '',
    });
    return this.prospectRepository.save(prospect);
  }

  async importCsv(buffer: Buffer): Promise<{ imported: number; skipped: number; errors: string[] }> {
    const lines = buffer
      .toString('utf-8')
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .split('\n')
      .filter(l => l.trim());

    if (lines.length < 2) {
      throw new BadRequestException('CSV must have a header row and at least one data row');
    }

    const headers = parseCsvRow(lines[0]).map(h => h.toLowerCase().replace(/\s/g, '_'));
    const errors: string[] = [];
    const toInsert: Partial<Prospect>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvRow(lines[i]);
      if (values.length !== headers.length) {
        errors.push(`Row ${i + 1}: expected ${headers.length} columns, got ${values.length}`);
        continue;
      }

      const row: Partial<CreateProspectDto> = {};
      headers.forEach((h, idx) => {
        const field = HEADER_MAP[h];
        if (field) (row as any)[field] = values[idx] || undefined;
      });

      if (!row.firstName) { errors.push(`Row ${i + 1}: missing firstName`); continue; }
      if (!row.lastName) { errors.push(`Row ${i + 1}: missing lastName`); continue; }
      if (!row.email) { errors.push(`Row ${i + 1}: missing email`); continue; }
      if (row.status && !VALID_STATUSES.includes(row.status)) {
        row.status = 'sourcing';
      }

      toInsert.push(this.prospectRepository.create({ position: '', ...row } as CreateProspectDto));
    }

    if (toInsert.length > 0) {
      await this.prospectRepository.save(toInsert);
    }

    return { imported: toInsert.length, skipped: errors.length, errors };
  }

  async update(id: number, dto: UpdateProspectDto): Promise<Prospect> {
    const prospect = await this.findOne(id);
    Object.assign(prospect, dto);
    return this.prospectRepository.save(prospect);
  }

  async remove(id: number): Promise<void> {
    const prospect = await this.findOne(id);
    await this.prospectRepository.remove(prospect);
  }

  async appendNote(id: number, note: string): Promise<Prospect> {
    const prospect = await this.findOne(id);
    const history = Array.isArray(prospect.notesHistory)
      ? prospect.notesHistory
      : [];
    history.push({ note, createdAt: new Date().toISOString() });
    prospect.notesHistory = history;
    return this.prospectRepository.save(prospect);
  }

  async updateResume(id: number, filename: string): Promise<Prospect> {
    const prospect = await this.findOne(id);
    prospect.resume = path.join('prospects', filename);
    return this.prospectRepository.save(prospect);
  }

  async sendResume(id: number): Promise<{ sent: boolean }> {
    const prospect = await this.findOne(id);
    if (prospect.status === 'hired' || prospect.status === 'rejected') {
      throw new BadRequestException(`Cannot send resume for a prospect with status "${prospect.status}"`);
    }

    const resumeUrl = prospect.resume
      ? `${process.env.APP_URL ?? 'http://localhost:3000'}/uploads/${prospect.resume}`
      : undefined;

    await this.emailService.sendResumeToClient({
      prospectId: prospect.id,
      firstName: prospect.firstName,
      lastName: prospect.lastName,
      email: prospect.email,
      phone: prospect.phone ?? undefined,
      position: prospect.position ?? undefined,
      skills: prospect.skills ?? undefined,
      resumeUrl,
      notes: prospect.notes ?? undefined,
    });

    await this.prospectRepository.update(id, { status: 'client_review' });
    prospect.status = 'client_review';

    return { sent: true };
  }

  findPendingApprovalForClient(clientId: number): Promise<Prospect[]> {
    return this.prospectRepository.find({
      where: { clientId, status: 'client_review' },
    });
  }

  async clientApprove(id: number, clientId: number): Promise<Prospect> {
    const prospect = await this.findOne(id);
    if (prospect.clientId !== clientId) throw new ForbiddenException('Not your prospect');
    if (prospect.status !== 'client_review') {
      throw new BadRequestException(`Prospect is not awaiting client review (status: ${prospect.status})`);
    }
    await this.prospectRepository.update(id, { status: 'budget', isClientApproved: true });
    prospect.status = 'budget';
    prospect.isClientApproved = true;
    return prospect;
  }

  async clientReject(id: number, clientId: number, reason: string): Promise<Prospect> {
    const prospect = await this.findOne(id);
    if (prospect.clientId !== clientId) throw new ForbiddenException('Not your prospect');
    if (prospect.status !== 'client_review') {
      throw new BadRequestException(`Prospect is not awaiting client review (status: ${prospect.status})`);
    }
    return this.rejectProspect(id, reason || 'Rejected by client');
  }

  async rejectProspect(id: number, reason: string): Promise<Prospect> {
    const prospect = await this.findOne(id);
    if (prospect.status === 'hired') {
      throw new ConflictException('Cannot reject a prospect who is already a Hero');
    }
    if (prospect.status === 'rejected') {
      throw new ConflictException('Prospect is already rejected');
    }

    const history = Array.isArray(prospect.notesHistory) ? prospect.notesHistory : [];
    history.push({ note: `Process stopped: ${reason}`, createdAt: new Date().toISOString() });

    await this.prospectRepository.update(id, {
      status: 'rejected',
      notesHistory: history,
      rejectionReason: reason || null,
    });
    prospect.status = 'rejected';
    prospect.notesHistory = history;
    prospect.rejectionReason = reason || null;

    return prospect;
  }

  async promoteToHero(
    id: number,
    dto: PromoteProspectDto,
  ): Promise<{ prospect: Prospect; hero: Hero; contract: Contract; invoice: Invoice }> {
    const prospect = await this.prospectRepository.findOne({ where: { id } });
    if (!prospect) throw new NotFoundException(`Prospect #${id} not found`);
    if (prospect.status === 'hired') throw new ConflictException('Prospect is already a Hero');
    if (!prospect.clientId || !prospect.companyId) {
      throw new BadRequestException('Prospect must have a client and company assigned before promotion');
    }

    try {
    return await this.dataSource.transaction(async (manager) => {
      await manager.update(Prospect, id, { status: 'hired' });
      prospect.status = 'hired';

      const startDate = dto.startDate ? new Date(dto.startDate) : new Date();

      const hero = manager.create(Hero, {
        prospectId: id,
        clientId: prospect.clientId!,
        companyId: prospect.companyId!,
        startDate,
      });
      const savedHero = await manager.save(Hero, hero);

      const compensation = dto.compensation ?? 0;
      const companyPayment = dto.companyPayment ?? compensation;
      const contract = manager.create(Contract, {
        heroId: savedHero.id,
        clientId: prospect.clientId!,
        companyId: prospect.companyId!,
        title: `Contract — ${prospect.firstName} ${prospect.lastName}`,
        startDate,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        compensation,
        companyPayment,
        profit: companyPayment - compensation,
        status: 'draft',
      });
      const savedContract = await manager.save(Contract, contract);

      await manager.update(Hero, savedHero.id, { contractId: savedContract.id });
      savedHero.contractId = savedContract.id;

      const dueDate = new Date(startDate);
      dueDate.setDate(dueDate.getDate() + 30);

      const invoice = manager.create(Invoice, {
        invoiceNumber: 'PENDING',
        contractId: savedContract.id,
        heroId: savedHero.id,
        clientId: prospect.clientId!,
        companyId: prospect.companyId!,
        amount: companyPayment,
        status: 'pending',
        dueDate,
      });
      const savedInvoice = await manager.save(Invoice, invoice);

      const invoiceNumber = `INV-${new Date().getFullYear()}-${String(savedInvoice.id).padStart(4, '0')}`;
      await manager.update(Invoice, savedInvoice.id, { invoiceNumber });
      savedInvoice.invoiceNumber = invoiceNumber;

      return { prospect, hero: savedHero, contract: savedContract, invoice: savedInvoice };
    });
    } catch (err: any) {
      const msg: string = err?.message ?? '';
      if (msg.includes('fk_heroes_company_id') || msg.includes('company_id')) {
        throw new BadRequestException('Invalid company: the selected company does not exist');
      }
      if (msg.includes('fk_heroes_client_id') || msg.includes('client_id')) {
        throw new BadRequestException('Invalid client: the selected client does not exist');
      }
      if (msg.includes('invoice_number') || msg.includes('invoices_invoice_number')) {
        throw new BadRequestException('An invoice for this hero already exists');
      }
      if (msg.includes('prospect_id') || msg.includes('fk_heroes_prospect_id')) {
        throw new ConflictException('This prospect has already been promoted to Hero');
      }
      this.logger.error('promoteToHero transaction failed', err);
      throw new BadRequestException(`Promotion failed: ${msg}`);
    }
  }
}
