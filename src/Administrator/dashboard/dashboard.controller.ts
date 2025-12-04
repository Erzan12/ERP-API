import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Can } from 'src/Components/decorators/can.decorator';
import { DashboardService } from './dashboard.service';
import { SessionUser } from 'src/Components/decorators/session-user.decorator';
import { RequestUser } from 'src/Components/types/request-user.interface';
import { ACTION_READ, DASHBOARD } from 'src/Components/constants/ability.constant';
import { ApiGetResponse } from 'src/Components/helpers/swagger-response.helper';

@ApiBearerAuth('access-token') //matches the name used in .addBearerAuth()
@ApiTags('Mastertables')
@Controller('mastertables')
export class DashboardController {
    constructor (private dashboardService: DashboardService) {}

    //load dashboard
    @Get('dashboard')
    @ApiOperation({ summary: 'Summary of Users'})
    @ApiGetResponse('Adminstrator Dashboard')
    @Can({ action: ACTION_READ, subject: DASHBOARD})
    async getAdminDashboard(
        @SessionUser() user: RequestUser
    ) {
        return this.dashboardService.getAdminDashboardStats(user);
    }

}
