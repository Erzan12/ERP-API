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

@Controller('hr')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('employees')
  @Can({
        action: ACTION_CREATE,
        subject: SM_HR.EMPLOYEE_MASTERLIST,
        module: [MODULE_HR]
  })
  async createEmployee(
    @Body() createDto: CreateEmployeeWithDetailsDto,
    @SessionUser() user: RequestUser,
  ) {
    const { person, employee } = createDto;
    return this.employeeService.createEmployee( person, employee,  user);
  }
}