import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OvertimeRateService } from './overtime-rate.service';
import { ApiGetResponse, ApiPatchResponse, ApiPostResponse } from 'src/utils/helpers/swagger-response.helper';
import { ACTION_CREATE, ACTION_READ, ACTION_UPDATE, EMPLOYEE_MASTERLIST } from 'src/utils/constants/ability.constant';
import { subject } from '@casl/ability';
import { Can } from 'src/utils/decorators/can.decorator';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { CreateOvertimeRateDto, UpdateOvertimeRateDto } from './dto/overtime-rate.dto';

@ApiTags("Overtime Cases - Overtime Rates")
@Controller({path: 'hris', version: '2'})
export class OvertimeRateController {
    constructor(private readonly overtimeService: OvertimeRateService) {}

    @Get("/time-and-attendance/overtime-rates")
    @ApiOperation({ summary: 'List of Overtime Rates' })
    @ApiGetResponse('List of Overtime Rates')
    @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
    getOvertimeRates(
        @SessionUser() user: RequestUser
    ) {
        return this.overtimeService.getOvertimeRates(user);
    }

    @Get("/time-and-attendance/overtime-rates/:overtimeRateId")
    @ApiOperation({ summary: 'Get a single id Overtime Rate' })
    @ApiGetResponse('Get a single Overtime Rate')
    @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
    getOvertimeRate(
        @SessionUser() user: RequestUser,
        @Param('overtimeRateId', new ParseUUIDPipe()) overtimeRateId: string
    ) {
        return this.overtimeService.getOvertimeRate(user, overtimeRateId);
    }

    @Post("/time-and-attendance/overtime-rates")
    @ApiBody({ type: CreateOvertimeRateDto, description: 'Payload to create overtime rate' })
    @ApiOperation({ summary: 'Create a overtime rate' })
    @ApiPostResponse('Overtime rate created successfully')
    @Can({ action: ACTION_CREATE, subject: EMPLOYEE_MASTERLIST })
    createOvertimeRate(
        @SessionUser() user: RequestUser,
        @Body() dto: CreateOvertimeRateDto
    ) {
        return this.overtimeService.createOvertimeRate(user, dto);
    }

    @Put("/time-and-attendance/overtime-rates/:overtimeRateId")
    @ApiBody({ type: UpdateOvertimeRateDto, description: 'Payload to update overtime rate' })
    @ApiOperation({ summary: 'Update a overtime rate' })
    @ApiPatchResponse('Overtime rate updated successfully')
    @Can({ action: ACTION_UPDATE, subject: EMPLOYEE_MASTERLIST })
    updateOvertimeRate(
        @SessionUser() user: RequestUser,
        @Body() dto: UpdateOvertimeRateDto,
        @Param('overtimeRateId', new ParseUUIDPipe()) overtimeRateId: string
    ) {
        return this.overtimeService.updateOvertimeRate(
            user,
            dto,
            overtimeRateId
        )
    }
}
