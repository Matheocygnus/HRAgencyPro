import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProspectsDatabase } from './entities/prospects-database.entity';
import { CreateProspectsDatabaseDto } from './dto/create-prospects-database.dto';
import { UpdateProspectsDatabaseDto } from './dto/update-prospects-database.dto';

@Injectable()
export class ProspectsDatabaseService {
  constructor(
    @InjectRepository(ProspectsDatabase)
    private readonly repository: Repository<ProspectsDatabase>,
  ) {}

  findAll(): Promise<ProspectsDatabase[]> {
    return this.repository.find();
  }

  async findOne(id: number): Promise<ProspectsDatabase> {
    const record = await this.repository.findOne({ where: { id } });
    if (!record)
      throw new NotFoundException(`ProspectsDatabase record #${id} not found`);
    return record;
  }

  create(dto: CreateProspectsDatabaseDto): Promise<ProspectsDatabase> {
    const record = this.repository.create(dto);
    return this.repository.save(record);
  }

  async update(
    id: number,
    dto: UpdateProspectsDatabaseDto,
  ): Promise<ProspectsDatabase> {
    const record = await this.findOne(id);
    Object.assign(record, dto);
    return this.repository.save(record);
  }

  async remove(id: number): Promise<void> {
    const record = await this.findOne(id);
    await this.repository.remove(record);
  }
}
