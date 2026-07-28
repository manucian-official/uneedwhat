import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SubscribeDto {
  @ApiProperty({ example: 'team' })
  @IsString()
  planSlug: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  orgName?: string;
}
