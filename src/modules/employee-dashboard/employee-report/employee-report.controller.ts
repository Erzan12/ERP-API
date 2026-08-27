import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmployeeReportService } from './employee-report.service';
import {
  CreateEmployeeReportDto,
  UpdateEmployeeReportDto,
} from './dto/employee-report.dto';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { ApiGetResponse } from 'src/utils/helpers/swagger-response.helper';
import { EmployeeReportPaginationDto } from 'src/utils/dtos/er-related-pagination.dto';

@ApiTags('Employee Dashboard - Employee Report')
@Controller({ path: 'employee-dashboard', version: '2' })
export class EmployeeReportController {
  constructor(private readonly employeeReportService: EmployeeReportService) {}

  @Get('employee-reports/:employeeReportId')
  @ApiOperation({ summary: 'Get Employee Reports' })
  @ApiGetResponse('Here is the list of Employee Reports')
  getEmployeeReport(
    @Param('employeeReportId', new ParseUUIDPipe()) employeeReportId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.employeeReportService.getEmployeeReport(employeeReportId, user);
  }

  @Get('employee-reports')
  @ApiOperation({ summary: 'Get Employee Reports' })
  @ApiGetResponse('Here is the list of Employee Reports')
  getEmployeeReports(
    @Query() dto: EmployeeReportPaginationDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.employeeReportService.getEmployeeReports(dto, user);
  }

  @Post('employee-reports')
  @ApiOperation({
    summary: 'File an employee report',
  })
  async createEmployeeReport(
    @Body() dto: CreateEmployeeReportDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.employeeReportService.createEmployeeReport(dto, user);
  }

  @Put('employee-reports/:employeeReportId')
  @ApiOperation({ summary: 'Update an existing Employee Report' })
  updateEmployeeReport(
    @Param('employeeReportId', new ParseUUIDPipe()) employeeReportId: string,
    @Body() dto: UpdateEmployeeReportDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.employeeReportService.updateEmployeeReport(
      employeeReportId,
      dto,
      user,
    );
  }
}
