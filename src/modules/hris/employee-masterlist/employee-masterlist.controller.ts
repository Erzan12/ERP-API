import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  ParseUUIDPipe,
  Query,
  Delete,
} from '@nestjs/common';

import { ApiTags, ApiBody, ApiOperation } from '@nestjs/swagger';
import {
  ApiGetResponse,
  ApiPatchResponse,
  ApiPostResponse,
} from 'src/utils/helpers/swagger-response.helper';

import {
  ACTION_CREATE,
  ACTION_READ,
  ACTION_UPDATE,
  EMPLOYEE_MASTERLIST,
} from 'src/utils/constants/ability.constant';

import {
  CreateEmployeeWithDetailsDto,
  UpdateEmployeeWithDetailsDto,
} from './dto/employee-person.dto';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';

import { Can } from 'src/utils/decorators/can.decorator';

import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';

import { EmployeeMasterlistService } from './employee-masterlist.service';
import { ManualSmsNotificationPreferenceDto, SmsNotificationPreferenceDto } from './dto/sms.dto';
import { OtpVerificationDto } from './dto/otp.dto';

// @ApiCookieAuth('access-token')
@ApiTags('Human Resources - Employees (Employee Masterlist)')
@Controller({ path: 'hris', version: '2' })
export class EmployeeMasterlistController {
  constructor(
    private readonly employeeMasterlistService: EmployeeMasterlistService,
  ) {}

  @Get('employees')
  @ApiOperation({ summary: 'List of all employees' })
  @ApiGetResponse('List of employees')
  @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
  getEmployees(
    @SessionUser() user: RequestUser,
    @Query() dto: PaginationDto,
    // @Query('page') page = 1,
    // @Query('perPage') perPage = 10,
    // @Query('search') search?: string,
    // @Query('sortBy') sortBy: string = 'created_at',
    // @Query('order') order: 'asc' | 'desc' = 'asc',
  ) {
    return this.employeeMasterlistService.getEmployees(user, dto);
  }

  //get a single employee profile or view
  @Get('employees/:employeeId')
  @ApiOperation({ summary: 'View employee profile' })
  @ApiGetResponse('Employees information')
  @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
  getEmployee(
    @Param('employeeId', new ParseUUIDPipe()) employeeId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.employeeMasterlistService.getEmployee(employeeId, user);
  }

  @Post('employees')
  @ApiBody({
    type: CreateEmployeeWithDetailsDto,
    description: 'Payload to create a new employee',
  })
  @ApiOperation({ summary: 'Create a new Employee' })
  @ApiPostResponse('Employee created successfully')
  @Can({ action: ACTION_CREATE, subject: EMPLOYEE_MASTERLIST })
  createEmployee(
    @Body() createDto: CreateEmployeeWithDetailsDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.employeeMasterlistService.createEmployee(createDto, user);
  }

  @Post('employees/sms-notification-registration')
  @ApiBody({
    type: SmsNotificationPreferenceDto,
    description: 'Payload to register employee to sms notifications'
  })
  @ApiOperation({ summary: 'Employee SMS Registration' })
  smsNotificationRegistration(
    @Body() dto: ManualSmsNotificationPreferenceDto,
  ) {
    return this.employeeMasterlistService.employeeManualSmsNotificationRegistration(dto)
  }

  @Post('employees/sms-notification-registration/verify-otp')
  @ApiOperation({ summary: 'Verify otp of employee' })
  verifyEmployeeSmsOtp(
    @Body() dto: OtpVerificationDto,
  ) {
    return this.employeeMasterlistService.employeeSmsVerify(dto);
  }

  //can edit employee profile
  @Put('employees/:employeeId')
  @ApiBody({
    type: UpdateEmployeeWithDetailsDto,
    description: 'Payload to update a current employee',
  })
  @ApiOperation({ summary: 'Update a current Employee' })
  @ApiPatchResponse('Employee information updated successfully')
  @Can({ action: ACTION_UPDATE, subject: EMPLOYEE_MASTERLIST })
  updateEmployee(
    @Param('employeeId', new ParseUUIDPipe()) employeeId: string,
    @Body() updateEmployeeWithDetailsDto: UpdateEmployeeWithDetailsDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.employeeMasterlistService.updateEmployee(
      employeeId,
      updateEmployeeWithDetailsDto,
      user,
    );
  }

  @Delete('employees/:employeeId')
  @ApiOperation({ summary: 'Delete a employee' })
  @Can({ action: ACTION_UPDATE, subject: EMPLOYEE_MASTERLIST })
  deleteEmployee(
    @SessionUser() user: RequestUser,
    @Param('employeeId', new ParseUUIDPipe()) employeeId: string,
  ) {
    return this.employeeMasterlistService.deleteEmployee(user, employeeId);
  }
}

@ApiTags('Human Resources - Employees (Employment History)')
@Controller({ path: 'hris', version: '2' })
export class EmploymentHistoryController {}
