import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { ApiGetResponse } from 'src/Components/helpers/swagger-response.helper';
import { Can } from 'src/Components/decorators/can.decorator';
import { SessionUser } from 'src/Components/decorators/session-user.decorator';
import { RequestUser } from 'src/Components/types/request-user.interface';
import { ACTION_READ, EMPLOYEE_MASTERLIST } from 'src/Components/constants/ability.constant';

@ApiBearerAuth('access-token') // matches the name used in .addBearerAuth()
@ApiTags('Human Resources')
@Controller('hr')
export class DashboardController {
    constructor (private dashboardService: DashboardService) {}

    @Get()
    @ApiOperation({ summary: 'Summary of the employees'})
    @ApiGetResponse('Dashboard')
    @Can ({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
    async getHrDashboard(
        @SessionUser() user: RequestUser,
    ) {
       return this.dashboardService.getHRDashboard(user)
    }
}
