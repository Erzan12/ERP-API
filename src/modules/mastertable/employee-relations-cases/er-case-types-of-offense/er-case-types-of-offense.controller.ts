import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ErCaseTypesOfOffenseService } from './er-case-types-of-offense.service';
import { CreateErCaseTypesOfOffenseDto, UpdateErCaseTypesOfOffenseDto } from './dto/types-of-offense.dto';
import { ApiGetResponse, ApiPatchResponse, ApiPostResponse } from 'src/utils/helpers/swagger-response.helper';
import { Can } from 'src/utils/decorators/can.decorator';
import { ACTION_CREATE, ACTION_READ, ACTION_UPDATE, MASTERTABLES } from 'src/utils/constants/ability.constant';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';

@ApiTags('Mastertable - Employee Relation Case(Type of Offense)')
@Controller({ path: 'mastertable', version: '2' })
export class ErCaseTypesOfOffenseController {
    constructor (private readonly erCaseTypesOfOffenseService: ErCaseTypesOfOffenseService) {}

    @Get('er-case-type-of-offenses/:erCaseTypeOfOffenseId')
    @ApiOperation({ summary: 'Get a ER Case Type of Offense' })
    @ApiGetResponse(' Here is the ER Case Violation')
    @Can({ action: ACTION_READ, subject: MASTERTABLES })
    getErTypeOfOffense(
        @Param('erCaseTypeOfOffenseId', new ParseUUIDPipe()) erCaseTypeOfOffenseId: string,
        @SessionUser() user: RequestUser,
    ) {
        return this.erCaseTypesOfOffenseService.getTypeOfOffense(erCaseTypeOfOffenseId, user);
    }

    @Get('er-case-type-of-offenses')
    @ApiOperation({ summary: 'Get all ER Case Type of Offenses' })
    @ApiGetResponse('List of ER Case Violations')
    @Can({ action: ACTION_READ, subject: MASTERTABLES })
    getErTypeOfOffenses(
        @SessionUser() user: RequestUser,
    ) {
        return this.erCaseTypesOfOffenseService.getTypeOfOffenses(user);
    }

    @Post('er-case-type-of-offenses')
    @ApiBody({
        type: CreateErCaseTypesOfOffenseDto,
        description: 'Payload to create ER Case Type of Offense'
    })
    @ApiOperation({ summary: 'Create a new ER Case Type of Offense' })
    @ApiPostResponse('ER Case Type of Offense created successfully')
    @Can({ action: ACTION_CREATE, subject: MASTERTABLES })
    createErCaseTypeOfOffense(
        @Body() dto: CreateErCaseTypesOfOffenseDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.erCaseTypesOfOffenseService.createTypeOfOffense(dto, user);
    }

    @Put('er-case-type-of-offenses/:erCaseTypeOfOffenseId')
    @ApiBody({
        type: UpdateErCaseTypesOfOffenseDto,
        description: 'Payload to update ER Case Type of Offense',
    })
    @ApiOperation({ summary: 'Update a current ER Case Type of Offense' })
    @ApiPatchResponse('ER Case Type of Offense updated successfully')
    @Can({ action: ACTION_UPDATE, subject: MASTERTABLES })
    updateErCaseTypeOfOffense(
        @Param('erCaseTypeOfOffenseId', new ParseUUIDPipe()) erCaseTypeOfOffenseId: string,
        @Body() dto: UpdateErCaseTypesOfOffenseDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.erCaseTypesOfOffenseService.updateTypeOfOffense(
            erCaseTypeOfOffenseId,
            dto,
            user,
        );
    }
}
