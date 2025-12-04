import { Controller, Post, Body, Get, ValidationPipe, UsePipes, Patch, ParseIntPipe, Param } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeWithDetailsDto } from './dto/create-employee-with-details.dto';
import { Can } from '../../Components/decorators/can.decorator';
import { SessionUser } from '../../Components/decorators/session-user.decorator';
import { RequestUser } from '../../Components/types/request-user.interface';
import { ApiBearerAuth, ApiTags, ApiBody, ApiOperation } from '@nestjs/swagger';
import { ApiGetResponse, ApiPatchResponse, ApiPostResponse } from 'src/Components/helpers/swagger-response.helper';
import { ACTION_CREATE, ACTION_READ, ACTION_UPDATE, EMPLOYEE_MASTERLIST } from 'src/Components/constants/ability.constant';
import { UpdateEmployeeWithDetailsDto } from './dto/update-employee-with-details.dto';
import { GetEmployeeDto } from './dto/get-employee.dto';

@ApiBearerAuth('access-token')
@ApiTags('Human Resources')
@Controller('hr')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  //get a single employee profile or view
  @Get('employees_masterlist/:employeeId')
  @ApiOperation({ summary: 'View employee profile'})
  @ApiGetResponse('Employees information')
  @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
  async getEmployee(
    @Body() employeeId: number,
    @SessionUser() user: RequestUser
  ) {
    return this.employeeService.getEmployee(employeeId, user)
  }

  //can edit employee profile
  @Patch('employees_masterlist/:employeeId')
  @ApiBody({ type: UpdateEmployeeWithDetailsDto, description: 'Payload to update a current employee'})
  @ApiOperation({ summary: 'Update a current Employee' })
  @ApiPatchResponse('Employee information updated successfully')
  @Can({ action: ACTION_UPDATE, subject: EMPLOYEE_MASTERLIST })
  async updateEmployee(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Body() updateEmployeeWithDetailsDto: UpdateEmployeeWithDetailsDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.employeeService.updateEmployee( employeeId, updateEmployeeWithDetailsDto, user)
  }


  @Post('employees_masterlist')
  @ApiBody({ type: CreateEmployeeWithDetailsDto, description: 'Payload to create a new employee' })
  @ApiOperation({ summary: 'Create a new Employee'})
  @ApiPostResponse('Employee created successfully')
  @Can({ action: ACTION_CREATE, subject: EMPLOYEE_MASTERLIST })
  async createEmployee(
    @Body() createDto: CreateEmployeeWithDetailsDto, 
    @SessionUser() user: RequestUser,
  ) {
    return this.employeeService.createEmployee( createDto, user);
  }
}