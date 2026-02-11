import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { ApiGetResponse } from 'src/utils/helpers/swagger-response.helper';
import { Can } from 'src/utils/decorators/can.decorator';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import {
  ACTION_READ,
  EMPLOYEE_MASTERLIST,
} from 'src/utils/constants/ability.constant';

@ApiBearerAuth('access-token') // matches the name used in .addBearerAuth()
@ApiTags('Human Resources')
@Controller('hr')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Summary of the employees' })
  @ApiGetResponse('Dashboard')
  @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
  getHrDashboard(@SessionUser() user: RequestUser) {
    return this.dashboardService.getHRDashboard(user);
  }
}
