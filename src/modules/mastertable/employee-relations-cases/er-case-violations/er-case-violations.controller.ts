import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ErCaseViolationsService } from './er-case-violations.service';
import { ApiGetResponse, ApiPatchResponse, ApiPostResponse } from 'src/utils/helpers/swagger-response.helper';
import { Can } from 'src/utils/decorators/can.decorator';
import { ACTION_CREATE, ACTION_READ, ACTION_UPDATE, MASTERTABLES } from 'src/utils/constants/ability.constant';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { CreateErCaseViolationDto, UpdateErCaseViolationDto } from './dto/er-case-violations.dto';
import { ErCaseViolationPaginationDto } from 'src/utils/dtos/er-case-pagination.dto';

@ApiTags('Mastertable - Employee Relation Case(Violation)')
@Controller({ path: 'er-case-violations', version: '2'})
export class ErCaseViolationsController {
    constructor (private readonly erCaseViolationService: ErCaseViolationsService) {}

    @Get('er-case-violations/:erCaseViolationId')
    @ApiOperation({ summary: 'Get a ER Case Violation' })
    @ApiGetResponse('Here is the ER Case Violation')
    @Can({ action: ACTION_READ, subject: MASTERTABLES })
    getViolation(
        @Param('erCaseViolationId', new ParseUUIDPipe()) erCaseViolationId: string,
        @SessionUser() user: RequestUser,
    ) {
        return this.erCaseViolationService.getViolation(erCaseViolationId, user);
    }

    @Get('er-case-violations')
    @ApiOperation({ summary: 'Get all ER Case Violations' })
    @ApiGetResponse('List of ER Case Violations')
    @Can({ action: ACTION_READ, subject: MASTERTABLES })
    getViolations(
        @SessionUser() user: RequestUser,
        @Query() dto: ErCaseViolationPaginationDto,
    ) {
        return this.erCaseViolationService.getViolations(user, dto);
    }

    @Post('er-case-violations')
    @ApiBody({
        type: CreateErCaseViolationDto,
        description: 'Payload to create ER Case Violations',
    })
    @ApiOperation({ summary: 'Create a new ER Case Violation' })
    @ApiPostResponse('ER Case Violation created successfully')
    @Can({ action: ACTION_CREATE, subject: MASTERTABLES })
    createErCaseViolation(
        @Body() dto: CreateErCaseViolationDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.erCaseViolationService.createViolation(dto, user);
    }

    @Put('er-case-articles/:erCaseViolationId')
    @ApiBody({
        type: UpdateErCaseViolationDto,
        description: 'Payload to update ER Case Violation',
    })
    @ApiOperation({ summary: 'Update a current ER Case Violation' })
    @ApiPatchResponse('ER Case Violation updated successfully')
    @Can({ action: ACTION_UPDATE, subject: MASTERTABLES })
    updateErCaseViolation(
        @Param('erCaseViolationId', new ParseUUIDPipe()) erCaseViolationId: string,
        @Body() dto: UpdateErCaseViolationDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.erCaseViolationService.updateViolation(
            erCaseViolationId,
            dto,
            user,
        );
    }
}
