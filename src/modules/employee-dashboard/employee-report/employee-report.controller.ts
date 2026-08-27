import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmployeeReportService } from './employee-report.service';
import { CreateEmployeeReportDto } from './dto/create-employee-report.dto';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';

@ApiTags('Human Resources - Employee Report')
@Controller({ path: 'hris', version: '2' })
export class EmployeeReportController {
    constructor (private readonly employeeReportService: EmployeeReportService) {}

    @Post('employee-report')
    @ApiOperation({
        summary: 'File an employee report',
    })
    async createEmployeeReport(
        @Body() dto: CreateEmployeeReportDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.employeeReportService.createEmployeeReport(dto, user);
    }
}
