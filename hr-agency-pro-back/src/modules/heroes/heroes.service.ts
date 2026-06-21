import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hero } from './entities/hero.entity';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';

@Injectable()
export class HeroesService {
  constructor(
    @InjectRepository(Hero)
    private readonly heroRepository: Repository<Hero>,
  ) {}

  findAll(clientId?: number): Promise<Hero[]> {
    return this.heroRepository.find({
      relations: { prospect: true },
      ...(clientId ? { where: { clientId } } : {}),
    });
  }

  async findOne(id: number): Promise<Hero> {
    const hero = await this.heroRepository.findOne({ where: { id }, relations: { prospect: true } });
    if (!hero) throw new NotFoundException(`Hero #${id} not found`);
    return hero;
  }

  create(dto: CreateHeroDto): Promise<Hero> {
    const hero = this.heroRepository.create(dto);
    return this.heroRepository.save(hero);
  }

  async update(id: number, dto: UpdateHeroDto): Promise<Hero> {
    const hero = await this.findOne(id);
    Object.assign(hero, dto);
    return this.heroRepository.save(hero);
  }

  async remove(id: number): Promise<void> {
    const hero = await this.findOne(id);
    await this.heroRepository.remove(hero);
  }
}
