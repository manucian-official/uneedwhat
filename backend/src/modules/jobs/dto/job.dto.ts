import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateJobDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  requirements: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  responsibilities: string[];

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsString()
  jobType: string;

  @ApiProperty()
  @IsString()
  workplaceType: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  salaryMin?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  salaryMax?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  salaryCurrency?: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @ApiProperty()
  @IsString()
  experienceLevel: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deadline?: Date;
}

export class UpdateJobDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  requirements?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  responsibilities?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  jobType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  workplaceType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  salaryMin?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  salaryMax?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  skills?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  experienceLevel?: string;
}

export class JobFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  jobType?: string;

  @IsOptional()
  @IsString()
  workplaceType?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  salaryMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset?: number;
}
