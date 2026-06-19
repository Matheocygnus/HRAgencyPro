import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interview } from '../interviews/entities/interview.entity';
import { Prospect } from '../prospects/entities/prospect.entity';
import { Client } from '../companies/entities/client.entity';
import { Invoice } from '../invoices/entities/invoice.entity';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Interview, Prospect, Client, Invoice])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
