import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  findAll(filters?: { clientId?: number }): Promise<Invoice[]> {
    return this.invoiceRepository.find({
      where: filters?.clientId ? { clientId: filters.clientId } : undefined,
      relations: { hero: { prospect: true } },
    });
  }

  async findOne(id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({ where: { id } });
    if (!invoice) throw new NotFoundException(`Invoice #${id} not found`);
    return invoice;
  }

  async create(dto: CreateInvoiceDto): Promise<Invoice> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [y, m, d] = dto.dueDate.split('T')[0].split('-').map(Number);
    const due = new Date(y, m - 1, d);
    if (due < today) {
      throw new BadRequestException('Due date cannot be in the past');
    }
    const invoice = this.invoiceRepository.create(dto);
    try {
      return await this.invoiceRepository.save(invoice);
    } catch (err: any) {
      if (err.code === '23505') {
        throw new ConflictException('Invoice number already exists');
      }
      if (err.code === '23503') {
        throw new BadRequestException('Invalid reference: hero, client, company, or contract not found');
      }
      throw err;
    }
  }

  async update(id: number, dto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.findOne(id);
    Object.assign(invoice, dto);
    return this.invoiceRepository.save(invoice);
  }

  async remove(id: number): Promise<void> {
    const invoice = await this.findOne(id);
    if (invoice.status === 'paid') {
      throw new ForbiddenException('Paid invoices cannot be deleted for accounting audit purposes');
    }
    await this.invoiceRepository.remove(invoice);
  }
}
