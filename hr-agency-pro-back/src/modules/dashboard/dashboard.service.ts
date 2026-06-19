import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, Not, In } from 'typeorm';
import { Interview } from '../interviews/entities/interview.entity';
import { Prospect } from '../prospects/entities/prospect.entity';
import { Client } from '../companies/entities/client.entity';
import { Invoice } from '../invoices/entities/invoice.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Interview)
    private readonly interviewRepo: Repository<Interview>,
    @InjectRepository(Prospect)
    private readonly prospectRepo: Repository<Prospect>,
    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,
    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,
  ) {}

  async getStats() {
    const now = new Date();

    const [upcomingInterviews, matchedProspects, activeClients, pendingInvoices] =
      await Promise.all([
        this.interviewRepo.count({
          where: { status: 'scheduled', scheduledDate: MoreThan(now) },
        }),
        this.prospectRepo.count({
          where: { status: Not(In(['hired', 'rejected'])) },
        }),
        this.clientRepo.count({ where: { status: 'active' } }),
        this.invoiceRepo.count({ where: { status: 'pending' } }),
      ]);

    return { upcomingInterviews, matchedProspects, activeClients, pendingInvoices };
  }
}
