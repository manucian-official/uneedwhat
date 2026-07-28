import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { PlanFeatures } from '../../../database/entities/subscription-plan.entity';

export class UpdatePlanDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  priceMonthly?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  priceYearly?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  features?: Partial<PlanFeatures>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
