import { Controller, Get } from '@nestjs/common';
import { Public } from '../../common/decorators/roles.decorator';

@Controller('health')
export class HealthController {
  @Public()
  @Get()
  check() {
    return {
      status: 'ok',
      service: 'uneedwhat-api',
      timestamp: new Date().toISOString(),
    };
  }
}
