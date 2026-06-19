import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateJobRequestDto {
  @ApiProperty()
  @IsInt()
  clientId: number;

  @ApiProperty()
  @IsInt()
  companyId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  clientName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  openPositions?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  requirements: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  niceToHaveSkills?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tools?: string;

  @ApiProperty()
  @IsString()
  jobType: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  workingHours?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reportsTo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seniority?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  requiresProficiencyTest?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  interviewQuestions?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  testingRequirements?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
