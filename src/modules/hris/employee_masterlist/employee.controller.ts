import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeWithDetailsDto } from './dto/create-employee-with-details.dto';
import { RequestUser } from 'src/components/types/request-user.interface';
import { ApiBearerAuth, ApiTags, ApiBody, ApiOperation } from '@nestjs/swagger';
import {
  ApiGetResponse,
  ApiPatchResponse,
  ApiPostResponse,
} from 'src/components/helpers/swagger-response.helper';
import {
  ACTION_CREATE,
  ACTION_READ,
  ACTION_UPDATE,
  EMPLOYEE_MASTERLIST,
} from 'src/components/constants/ability.constant';
import { UpdateEmployeeWithDetailsDto } from './dto/update-employee-with-details.dto';
import { GetEmployeeDto } from './dto/get-employee.dto';
import { Can } from 'src/components/decorators/can.decorator';
import { SessionUser } from 'src/components/decorators/session-user.decorator';

@ApiBearerAuth('access-token')
@ApiTags('Human Resources')
@Controller('hr')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get('employees')
  @ApiOperation({ summary: 'List of all employees' })
  @ApiGetResponse('List of employees')
  @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
  getEmployees(
    @SessionUser() user: RequestUser
  ) {
    return this.employeeService.getEmployees(user)
  }

  //get a single employee profile or view
  @Get('employees/:id')
  @ApiOperation({ summary: 'View employee profile' })
  @ApiGetResponse('Employees information')
  @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
  getEmployee(
    @Param('id', ParseIntPipe) id: number,
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
    @Param('id', ParseIntPipe) id: number,
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
