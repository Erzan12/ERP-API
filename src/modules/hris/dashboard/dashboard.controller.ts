import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { ApiGetResponse } from 'src/utils/helpers/swagger-response.helper';
import { Can } from 'src/utils/decorators/can.decorator';
import {
  ACTION_READ,
  SYSTEM_MANAGEMENT,
} from 'src/utils/constants/ability.constant';

@ApiTags('Human Resources - Dashboard')
@Controller({ path: 'hris', version: '2' })
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Summary of the employees' })
  @ApiGetResponse('Dashboard')
  @Can({ action: ACTION_READ, subject: SYSTEM_MANAGEMENT })
  getHrDashboard() {
    return this.dashboardService.getHRDashboard();
  }
}
