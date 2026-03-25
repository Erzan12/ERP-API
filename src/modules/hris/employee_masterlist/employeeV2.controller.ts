import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  ParseUUIDPipe,
  Query,
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

import { EmployeeService } from './employee.service';

// @ApiCookieAuth('access-token')
@ApiTags('Human Resources - Employees')
@Controller({ path: 'hris', version: '2' })
export class EmployeeControllerV2 {
  constructor(private readonly employeeService: EmployeeService) {}

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
    return this.employeeService.getEmployees(user, dto);
  }

  //get a single employee profile or view
  @Get('employees/:id')
  @ApiOperation({ summary: 'View employee profile' })
  @ApiGetResponse('Employees information')
  @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
  getEmployee(
    @Param('id', new ParseUUIDPipe()) id: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.employeeService.getEmployee(id, user);
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
    return this.employeeService.createEmployee(createDto, user);
  }

  //can edit employee profile
  @Put('employees/:id')
  @ApiBody({
    type: UpdateEmployeeWithDetailsDto,
    description: 'Payload to update a current employee',
  })
  @ApiOperation({ summary: 'Update a current Employee' })
  @ApiPatchResponse('Employee information updated successfully')
  @Can({ action: ACTION_UPDATE, subject: EMPLOYEE_MASTERLIST })
  updateEmployee(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateEmployeeWithDetailsDto: UpdateEmployeeWithDetailsDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.employeeService.updateEmployee(
      id,
      updateEmployeeWithDetailsDto,
      user,
    );
  }
}
