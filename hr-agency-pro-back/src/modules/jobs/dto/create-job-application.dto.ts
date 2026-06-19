import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateJobApplicationDto {
  @ApiProperty()
  @IsNumber()
  jobOpeningId: number;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  whatsapp?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  callNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pronoun?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  otherPositions?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  heardAbout?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  salaryAgreement?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  voiceRecordingUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  englishLevel?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seniority?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  portfolio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tools?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  otherTools?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  references?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  coverLetter?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
