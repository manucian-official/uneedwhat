import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { BillingCycle, PaymentMethod } from '../../../database/entities/enums';

export class SubscribeDto {
  @ApiProperty({ example: 'team' })
  @IsString()
  planSlug: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  orgName?: string;
}

export class CheckoutSubscriptionDto {
  @ApiProperty({ example: 'pro' })
  @IsString()
  planSlug: string;

  @ApiProperty({ enum: BillingCycle, example: BillingCycle.MONTHLY })
  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.MOMO })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  orgName?: string;
}

export class ConfirmPaymentDto {
  @ApiProperty()
  @IsUUID()
  transactionId: string;
}

export class CancelPaymentDto {
  @ApiProperty()
  @IsUUID()
  transactionId: string;

  @ApiPropertyOptional({ example: 'Changed plan decision' })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class PaymentWebhookDto {
  @ApiProperty({ example: 'UW-ABC123' })
  @IsString()
  externalRef: string;

  @ApiProperty({ example: 'paid' })
  @IsString()
  status: string;

  @ApiPropertyOptional({ example: 'gateway-signature-token' })
  @IsOptional()
  @IsString()
  signature?: string;
}
