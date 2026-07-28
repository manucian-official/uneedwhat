import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '../../database/entities/organization.entity';
import { OrganizationMember } from '../../database/entities/organization-member.entity';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization, OrganizationMember]),
    forwardRef(() => SubscriptionsModule),
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
