import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { EmploymentStatusService } from './employment_status.service';
import { Can } from '../../../components/decorators/can.decorator';
import { SessionUser } from '../../../components/decorators/session-user.decorator';
import { CreateEmployeeStatusDto } from './dto/create-emp-stat.dto';
import { RequestUser } from '../../../components/types/request-user.interface';
import { UpdateEmpStatusDto } from './dto/update-emp-stat.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiGetResponse,
  ApiPatchResponse,
  ApiPostResponse,
} from 'src/components/helpers/swagger-response.helper';
import {
  ACTION_READ,
  ACTION_UPDATE,
  MASTERTABLES,
} from 'src/components/constants/ability.constant';

@ApiBearerAuth('access-token')
@ApiTags('Mastertables')
@Controller('mastertables')
export class EmploymentStatusController {
  constructor(private employmentStatusService: EmploymentStatusService) {}

  //get all employment_status
  @Get('employment_status/')
  @ApiOperation({ summary: 'Get all employment status' })
  @ApiGetResponse('Here are the list of available employment status')
  @Can({ action: ACTION_READ, subject: MASTERTABLES })
  getEmployeeStats(@SessionUser() user: RequestUser) {
    return this.employmentStatusService.getEmpStat(user);
  }

  //get only one employment_status
  @Get('employment_status/:employmentStatusId')
  @ApiOperation({ summary: 'Get an employment status.' })
  @ApiGetResponse('Here is the employment status.')
  @Can({ action: ACTION_READ, subject: MASTERTABLES })
  getEmployeeStat(
    @Param('employmentStatusId', ParseIntPipe) employmentStatusId: number,
    @SessionUser() user: RequestUser,
  ) {
    return this.employmentStatusService.getEmpStatus(employmentStatusId, user);
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
    return this.employmentStatusService.createEmpStat(createEmpStat, user);
  }

  @Patch('employment_status/update/:employmentStatusId')
  @ApiOperation({ summary: 'Updating employee status details.' })
  @ApiPatchResponse('Employee status details updated successfully.')
  @Can({ action: ACTION_UPDATE, subject: MASTERTABLES })
  updateEmployeeStatus(
    @Param('employmentStatusId', ParseIntPipe) employmentStatusId: number,
    @Body() updateEmpStatusDto: UpdateEmpStatusDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.employmentStatusService.updateEmpStat(
      employmentStatusId,
      updateEmpStatusDto,
      user,
    );
  }
}
