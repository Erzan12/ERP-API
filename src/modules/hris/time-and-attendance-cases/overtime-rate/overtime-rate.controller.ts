import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OvertimeRateService } from './overtime-rate.service';
import { ApiGetResponse } from 'src/utils/helpers/swagger-response.helper';
import { ACTION_READ, EMPLOYEE_MASTERLIST } from 'src/utils/constants/ability.constant';
import { subject } from '@casl/ability';
import { Can } from 'src/utils/decorators/can.decorator';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';

@ApiTags("Overtime Cases - Overtime Rates")
@Controller({path: 'hris', version: '2'})
export class OvertimeRateController {
    constructor(private readonly overtimeService: OvertimeRateService) {}

    @Get("/time-and-attendance/overtime-rate")
    @ApiOperation({ summary: 'List of Overtime Rates' })
    @ApiGetResponse('List of Overtime Rates')
    @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
    getOvertimeRates(
        @SessionUser() user: RequestUser
    ) {
        return this.overtimeService.getOvertimeRates(user);
    }
}
