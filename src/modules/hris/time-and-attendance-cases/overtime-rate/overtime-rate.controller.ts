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
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OvertimeRateService } from './overtime-rate.service';
import {
  ApiGetResponse,
  ApiPatchResponse,
  ApiPostResponse,
} from 'src/utils/helpers/swagger-response.helper';
import {
  ACTION_CREATE,
  ACTION_READ,
  ACTION_UPDATE,
  OVERTIME_RATE,
} from 'src/utils/constants/ability.constant';
import { Can } from 'src/utils/decorators/can.decorator';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import {
  CreateOvertimeRateDto,
  UpdateOvertimeRateDto,
} from './dto/overtime-rate.dto';
import { OvertimeRequestsPaginationDto } from 'src/utils/dtos/overtime-request-pagination.dto';

@ApiTags('Human Resources - Time and Attendance Cases (Overtime Rate)')
@Controller({ path: 'hris', version: '2' })
export class OvertimeRateController {
  constructor(private readonly overtimeService: OvertimeRateService) {}

  @Get('/time-and-attendance-cases/overtime-rates')
  @ApiOperation({ summary: 'List of Overtime Rates' })
  @ApiGetResponse('List of Overtime Rates')
  @Can({ action: ACTION_UPDATE, subject: OVERTIME_RATE })
  getOvertimeRates(
    @SessionUser() user: RequestUser,
    @Query() dto: OvertimeRequestsPaginationDto,
  ) {
    return this.overtimeService.getOvertimeRates(user, dto);
  }

  @Get('/time-and-attendance-cases/overtime-rates/:overtimeRateId')
  @ApiOperation({ summary: 'Get a single id Overtime Rate' })
  @ApiGetResponse('Get a single Overtime Rate')
  @Can({ action: ACTION_READ, subject: OVERTIME_RATE })
  getOvertimeRate(
    @SessionUser() user: RequestUser,
    @Param('overtimeRateId', new ParseUUIDPipe()) overtimeRateId: string,
  ) {
    return this.overtimeService.getOvertimeRate(user, overtimeRateId);
  }

  @Post('/time-and-attendance-cases/overtime-rates')
  @ApiBody({
    type: CreateOvertimeRateDto,
    description: 'Payload to create overtime rate',
  })
  @ApiOperation({ summary: 'Create a overtime rate' })
  @ApiPostResponse('Overtime rate created successfully')
  @Can({ action: ACTION_CREATE, subject: OVERTIME_RATE })
  createOvertimeRate(
    @SessionUser() user: RequestUser,
    @Body() dto: CreateOvertimeRateDto,
  ) {
    return this.overtimeService.createOvertimeRate(user, dto);
  }

  @Put('/time-and-attendance-cases/overtime-rates/:overtimeRateId')
  @ApiBody({
    type: UpdateOvertimeRateDto,
    description: 'Payload to update overtime rate',
  })
  @ApiOperation({ summary: 'Update a overtime rate' })
  @ApiPatchResponse('Overtime rate updated successfully')
  @Can({ action: ACTION_UPDATE, subject: OVERTIME_RATE })
  updateOvertimeRate(
    @SessionUser() user: RequestUser,
    @Body() dto: UpdateOvertimeRateDto,
    @Param('overtimeRateId', new ParseUUIDPipe()) overtimeRateId: string,
  ) {
    return this.overtimeService.updateOvertimeRate(user, dto, overtimeRateId);
  }
}
