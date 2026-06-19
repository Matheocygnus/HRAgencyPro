import { PartialType } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateJobApplicationDto } from './create-job-application.dto';

export class UpdateJobApplicationDto extends PartialType(CreateJobApplicationDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['new', 'screened', 'cv_sent', 'interview_scheduled', 'offer_agreed', 'hired', 'rejected'])
  status?: string;
}
