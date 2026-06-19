import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview } from './entities/interview.entity';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { TwilioService } from '../../integrations/twilio/twilio.service';

@Injectable()
export class InterviewsService {
  constructor(
    @InjectRepository(Interview)
    private readonly interviewRepository: Repository<Interview>,
    private readonly twilioService: TwilioService,
  ) {}

  findAll(): Promise<Interview[]> {
    return this.interviewRepository.find();
  }

  async findOne(id: number): Promise<Interview> {
    const interview = await this.interviewRepository.findOne({ where: { id } });
    if (!interview) throw new NotFoundException(`Interview #${id} not found`);
    return interview;
  }

  create(dto: CreateInterviewDto): Promise<Interview> {
    const interview = this.interviewRepository.create(dto);
    return this.interviewRepository.save(interview);
  }

  async update(id: number, dto: UpdateInterviewDto): Promise<Interview> {
    const interview = await this.findOne(id);
    Object.assign(interview, dto);
    return this.interviewRepository.save(interview);
  }

  async remove(id: number): Promise<void> {
    const interview = await this.findOne(id);
    await this.interviewRepository.remove(interview);
  }

  async generateVideoToken(
    interviewId: number,
    identity: string,
  ): Promise<{ token: string }> {
    await this.findOne(interviewId);
    return this.twilioService.generateVideoToken(
      `interview-${interviewId}`,
      identity,
    );
  }
}
