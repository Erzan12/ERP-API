import {
  ACTION_CREATE,
  MODULE_ADMIN,
  MODULE_HR,
} from '../../Components/decorators/ability';
import { Controller, Post, Body, Get, ValidationPipe, UsePipes } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeWithDetailsDto } from './dto/create-employee-with-details.dto';
import { Can } from '../../Components/decorators/can.decorator';
import { SM_HR } from '../../Components/constants/core-constants';
import { SessionUser } from '../../Components/decorators/session-user.decorator';
import { RequestUser } from '../../Components/types/request-user.interface';
import { ApiBearerAuth, ApiTags, ApiBody, ApiOperation } from '@nestjs/swagger';
import { ApiPostResponse } from 'src/Components/helpers/swagger-response.helper';

@ApiBearerAuth('access-token')
@ApiTags('Employee')
@Controller('hr')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('employees')
  @ApiBody ({ type: CreateEmployeeWithDetailsDto, description: 'Payload to create a new employee' })
  @ApiOperation({ summary: 'Create a new Employee'})
  @ApiPostResponse('Employee created successfully')
  @Can({
        action: ACTION_CREATE,
        subject: SM_HR.EMPLOYEE_MASTERLIST,
        // module: [MODULE_HR]
  })
  async createEmployee(
    @Body() createDto: CreateEmployeeWithDetailsDto, 
    @SessionUser() user: RequestUser,
  ) {
    return this.employeeService.createEmployee( createDto, user);
  }
}