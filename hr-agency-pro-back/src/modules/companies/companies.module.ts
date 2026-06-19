import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Company } from './entities/company.entity';
import { CompaniesService } from './companies.service';
import { ClientsController, CompaniesController } from './companies.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Company])],
  controllers: [ClientsController, CompaniesController],
  providers: [CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
