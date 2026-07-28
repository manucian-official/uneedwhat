import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { OrgMemberRole } from '../../../database/entities/enums';

export class AddMemberDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiPropertyOptional({ enum: OrgMemberRole })
  @IsOptional()
  @IsEnum(OrgMemberRole)
  role?: OrgMemberRole;
}
