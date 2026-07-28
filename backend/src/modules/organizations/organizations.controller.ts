import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { OrgMemberRole } from '../../database/entities/enums';
import { AddMemberDto } from './dto/organization.dto';
import { OrganizationsService } from './organizations.service';

@ApiTags('organizations')
@ApiBearerAuth()
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly orgsService: OrganizationsService) {}

  @Get('me')
  getMyOrg(@CurrentUser() user: { id: string }) {
    return this.orgsService.getUserOrganization(user.id);
  }

  @Post('me/members')
  addMember(
    @CurrentUser() user: { id: string },
    @Body() dto: AddMemberDto,
  ) {
    return this.orgsService.getUserOrganization(user.id).then(async (org) => {
      if (!org) {
        const created = await this.orgsService.getOrCreateForUser(user.id);
        return this.orgsService.addMember(
          created.id,
          dto.userId,
          dto.role || OrgMemberRole.MEMBER,
        );
      }
      return this.orgsService.addMember(
        org.id,
        dto.userId,
        dto.role || OrgMemberRole.MEMBER,
      );
    });
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.orgsService.findOne(id);
  }
}
