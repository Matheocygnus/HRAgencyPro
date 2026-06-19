import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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

  findAll(): Promise<Invoice[]> {
    return this.invoiceRepository.find();
  }

  async findOne(id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({ where: { id } });
    if (!invoice) throw new NotFoundException(`Invoice #${id} not found`);
    return invoice;
  }

  create(dto: CreateInvoiceDto): Promise<Invoice> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dto.dueDate);
    if (due < today) {
      throw new BadRequestException('Due date cannot be in the past');
    }
    const invoice = this.invoiceRepository.create(dto);
    return this.invoiceRepository.save(invoice);
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
