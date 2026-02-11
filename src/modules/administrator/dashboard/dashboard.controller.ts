import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Can } from 'src/utils/decorators/can.decorator';
import { DashboardService } from './dashboard.service';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import {
  ACTION_READ,
  DASHBOARD,
} from 'src/utils/constants/ability.constant';
import { ApiGetResponse } from 'src/utils/helpers/swagger-response.helper';

@ApiBearerAuth('access-token') //matches the name used in .addBearerAuth()
@ApiTags('Administrator - Dashboard')
@Controller('administrator')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  //load dashboard
  @Get()
  @ApiOperation({ summary: 'Summary of Users' })
  @ApiGetResponse('Adminstrator Dashboard')
  @Can({ action: ACTION_READ, subject: DASHBOARD })
  getAdminDashboard(@SessionUser() user: RequestUser) {
    return this.dashboardService.getAdminDashboardStats(user);
  }
}
