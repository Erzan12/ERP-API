import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Can } from 'src/utils/decorators/can.decorator';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { ACTION_READ, DASHBOARD } from 'src/utils/constants/ability.constant';
import { ApiGetResponse } from 'src/utils/helpers/swagger-response.helper';
import { DashboardService } from './dashboard.service';

@ApiTags('Administrator - Dashboard')
@Controller({ path: 'administrator', version: '2' })
export class DashboardControllerv2 {
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
