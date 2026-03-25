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
import { EmploymentStatusService } from './employment_status.service';
import { Can } from '../../../utils/decorators/can.decorator';
import { SessionUser } from '../../../utils/decorators/session-user.decorator';
import {
  CreateEmployeeStatusDto,
  UpdateEmployeeStatusDto,
} from './dto/employee-status.dto';
import { RequestUser } from '../../../utils/types/request-user.interface';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiGetResponse,
  ApiPatchResponse,
  ApiPostResponse,
} from 'src/utils/helpers/swagger-response.helper';
import {
  ACTION_READ,
  ACTION_UPDATE,
  MASTERTABLES,
} from 'src/utils/constants/ability.constant';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';

@ApiTags('Mastertable - Employment Status')
@Controller({ path: 'mastertable', version: '2' })
export class EmploymentStatusControllerV2 {
  constructor(private employmentStatusService: EmploymentStatusService) {}

  //get all employment_status
  @Get('employment_status')
  @ApiOperation({ summary: 'Get all employment status' })
  @ApiGetResponse('Here are the list of available employment status')
  @Can({ action: ACTION_READ, subject: MASTERTABLES })
  getEmployeeStats(
    @SessionUser() user: RequestUser,
    @Query() dto: PaginationDto,
    // @Query('page') page = 1,
    // @Query('perPage') perPage = 10,
    // @Query('search') search?: string,
    // @Query('sortBy') sortBy: string = 'created_at',
    // @Query('order') order: 'asc' | 'desc' = 'asc',
  ) {
    return this.employmentStatusService.getEmployeeStats(user, dto);
  }

  //get only one employment_status
  @Get('employment_status/:employeeStatusId')
  @ApiOperation({ summary: 'Get an employment status.' })
  @ApiGetResponse('Here is the employment status.')
  @Can({ action: ACTION_READ, subject: MASTERTABLES })
  getEmployeeStat(
    @Param('employeeStatusId', new ParseUUIDPipe()) employeeStatusId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.employmentStatusService.getEmployeeStat(employeeStatusId, user);
  }

  //created new employee status
  @Post('employment_status/')
  @ApiBody({
    type: CreateEmployeeStatusDto,
    description: 'Payload to create employee status.',
  })
  @ApiOperation({ summary: 'Create new employee status.' })
  @ApiPostResponse('Employee status created successfully.')
  @Can({ action: ACTION_READ, subject: MASTERTABLES })
  createEmployeeStatus(
    @Body() createEmpStat: CreateEmployeeStatusDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.employmentStatusService.createEmployeeStatus(
      createEmpStat,
      user,
    );
  }

  @Put('employment_status/:employeeStatusId')
  @ApiOperation({ summary: 'Updating employee status details.' })
  @ApiPatchResponse('Employee status details updated successfully.')
  @Can({ action: ACTION_UPDATE, subject: MASTERTABLES })
  updateEmployeeStatus(
    @Param('employeeStatusId', new ParseUUIDPipe()) employeeStatusId: string,
    @Body() updateEmployeeStatusDto: UpdateEmployeeStatusDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.employmentStatusService.updateEmployeeStatus(
      employeeStatusId,
      updateEmployeeStatusDto,
      user,
    );
  }
}
