import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateInvoiceDto {
  @ApiProperty()
  @IsString()
  invoiceNumber: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  contractId?: number;

  @ApiProperty()
  @IsNumber()
  heroId: number;

  @ApiProperty()
  @IsNumber()
  clientId: number;

  @ApiProperty()
  @IsNumber()
  companyId: number;

  @ApiProperty()
  @IsNumber()
  @Min(0.01, { message: 'Amount must be greater than 0' })
  amount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty()
  @IsDateString()
  dueDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  paidDate?: string;
}
