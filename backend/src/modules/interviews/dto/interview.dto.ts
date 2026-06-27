import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { InterviewStatus, InterviewType } from '../../../database/entities/enums';

export class ScheduleInterviewDto {
  @ApiProperty()
  @IsUUID()
  applicationId: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  interviewerIds: string[];

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(15)
  @Max(480)
  duration?: number;

  @ApiProperty({ enum: InterviewType })
  @IsEnum(InterviewType)
  type: InterviewType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  meetingLink?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;
}

export class UpdateInterviewStatusDto {
  @ApiProperty({ enum: InterviewStatus })
  @IsEnum(InterviewStatus)
  status: InterviewStatus;
}

export class InterviewFeedbackDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty()
  @IsString()
  notes: string;
}
