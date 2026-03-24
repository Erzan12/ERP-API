import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { ApiGetResponse } from 'src/utils/helpers/swagger-response.helper';
import { Can } from 'src/utils/decorators/can.decorator';
import {
  ACTION_READ,
  EMPLOYEE_MASTERLIST,
} from 'src/utils/constants/ability.constant';

@ApiTags('Human Resources - Dashboard')
@Controller({ path: 'hris', version: '2' })
export class DashboardControllerV2 {
  constructor(private dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Summary of the employees' })
  @ApiGetResponse('Dashboard')
  @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
  getHrDashboard() {
    return this.dashboardService.getHRDashboard();
  }
}
