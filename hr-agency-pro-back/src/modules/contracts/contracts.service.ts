import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from './entities/contract.entity';
import { Hero } from '../heroes/entities/hero.entity';
import { Prospect } from '../prospects/entities/prospect.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import * as path from 'path';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,
    @InjectRepository(Hero)
    private readonly heroRepository: Repository<Hero>,
    @InjectRepository(Prospect)
    private readonly prospectRepository: Repository<Prospect>,
  ) {}

  findAll(filters?: { heroId?: number; clientId?: number }): Promise<Contract[]> {
    const where: Partial<Contract> = {};
    if (filters?.heroId) where.heroId = filters.heroId;
    if (filters?.clientId) where.clientId = filters.clientId;
    return this.contractRepository.find({
      where: Object.keys(where).length ? where : undefined,
      relations: { company: true, hero: { prospect: true } },
    });
  }

  async findOne(id: number): Promise<Contract> {
    const contract = await this.contractRepository.findOne({
      where: { id },
      relations: { company: true, hero: { prospect: true } },
    });
    if (!contract) throw new NotFoundException(`Contract #${id} not found`);
    return contract;
  }

  create(dto: CreateContractDto): Promise<Contract> {
    const contract = this.contractRepository.create(dto);
    return this.contractRepository.save(contract);
  }

  async update(id: number, dto: UpdateContractDto): Promise<Contract> {
    const contract = await this.findOne(id);
    const wasTerminated = contract.status === 'terminated';
    Object.assign(contract, dto);
    const saved = await this.contractRepository.save(contract);

    if (dto.status === 'terminated' && !wasTerminated) {
      const hero = await this.heroRepository.findOne({ where: { id: contract.heroId } });
      if (hero) {
        await this.prospectRepository.update(hero.prospectId, { status: 'sourcing' });
      }
    }

    return saved;
  }

  async remove(id: number): Promise<void> {
    const contract = await this.findOne(id);
    await this.contractRepository.remove(contract);
  }

  async updateDocument(id: number, filename: string): Promise<Contract> {
    const contract = await this.findOne(id);
    contract.document = path.join('contracts', filename);
    return this.contractRepository.save(contract);
  }
}
