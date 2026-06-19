import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { Company } from './entities/company.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  // ---- Clients ----

  findAllClients(): Promise<Client[]> {
    return this.clientRepository.find();
  }

  async findOneClient(id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) throw new NotFoundException(`Client #${id} not found`);
    return client;
  }

  createClient(dto: CreateClientDto): Promise<Client> {
    const client = this.clientRepository.create(dto);
    return this.clientRepository.save(client);
  }

  async updateClient(id: number, dto: UpdateClientDto): Promise<Client> {
    const client = await this.findOneClient(id);
    Object.assign(client, dto);
    return this.clientRepository.save(client);
  }

  async removeClient(id: number): Promise<void> {
    const client = await this.findOneClient(id);
    const count = await this.companyRepository.count({
      where: { clientId: id },
    });
    if (count > 0) {
      throw new ConflictException(
        `Cannot delete client #${id}: ${count} company(ies) still associated`,
      );
    }
    await this.clientRepository.remove(client);
  }

  // ---- Companies ----

  findAllCompanies(): Promise<Company[]> {
    return this.companyRepository.find();
  }

  async findOneCompany(id: number): Promise<Company> {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) throw new NotFoundException(`Company #${id} not found`);
    return company;
  }

  createCompany(dto: CreateCompanyDto): Promise<Company> {
    const company = this.companyRepository.create(dto);
    return this.companyRepository.save(company);
  }

  async updateCompany(id: number, dto: UpdateCompanyDto): Promise<Company> {
    const company = await this.findOneCompany(id);
    Object.assign(company, dto);
    return this.companyRepository.save(company);
  }

  async removeCompany(id: number): Promise<void> {
    const company = await this.findOneCompany(id);
    await this.companyRepository.remove(company);
  }
}
