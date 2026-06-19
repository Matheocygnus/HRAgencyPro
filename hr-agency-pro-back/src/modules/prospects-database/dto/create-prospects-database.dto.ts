import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProspectsDatabaseDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rolePosition?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  otherRoleOfInterest?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  vocarooRecord?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  resume?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  programTools?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  englishLevel?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  clientId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  companyId?: number;
}
