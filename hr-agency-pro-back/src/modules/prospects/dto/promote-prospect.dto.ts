import { IsDateString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PromoteProspectDto {
  @ApiPropertyOptional({ description: 'Hero start date (ISO 8601 date string)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Contract end date (ISO 8601 date string)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Monthly compensation agreed (USD)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  compensation?: number;

  @ApiPropertyOptional({ description: 'Monthly billing amount charged to client (USD)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  companyPayment?: number;
}
