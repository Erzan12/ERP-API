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
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DisciplinaryCaseService } from './disciplinary-case.service';
import { CreateCaseDto, UpdateCaseDto } from './dto/case.dto';
import {
  ApiGetResponse,
  ApiPatchResponse,
  ApiPostResponse,
} from 'src/utils/helpers/swagger-response.helper';
import {
  ACTION_CREATE,
  ACTION_READ,
  ACTION_UPDATE,
  MASTERTABLES,
} from 'src/utils/constants/ability.constant';
import { Can } from 'src/utils/decorators/can.decorator';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { AdvanceStageResponseDto } from './dto/advance-stage-response.dto';
import { ErCasePaginationDto } from 'src/utils/dtos/er-related-pagination.dto';
import { UpdateCasePartyDto } from './dto/update-party-details.dto';

@ApiTags('Human Resources - Employee Relations(Disciplinary Case)')
@Controller({ path: 'hris', version: '2' })
export class DisciplinaryCaseController {
  constructor(
    private readonly disciplinaryCaseService: DisciplinaryCaseService,
  ) {}

  @Get('employee-relations/disciplinary-cases/:disciplinaryCaseId')
  @ApiOperation({ summary: 'Get a Disciplinary Case' })
  @ApiGetResponse('Here is the of Disciplinary Case')
  @Can({ action: ACTION_READ, subject: MASTERTABLES })
  getDisciplinaryCase(
    @SessionUser() user: RequestUser,
    @Param('disciplinaryCaseId', new ParseUUIDPipe())
    disciplinaryCaseId: string,
  ) {
    return this.disciplinaryCaseService.getDisciplinaryCase(
      disciplinaryCaseId,
      user,
    );
  }

  @Get('employee-relations/disciplinary-cases/:disciplinaryCaseId/status')
  @ApiOperation({ summary: 'Get a Disciplinary Case Status' })
  @ApiGetResponse('Here is the Disciplinary Case Status')
  @Can({ action: ACTION_READ, subject: MASTERTABLES })
  getDisciplinaryCaseStatus(
    @Param('disciplinaryCaseId', new ParseUUIDPipe())
    disciplinaryCaseId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.disciplinaryCaseService.getCaseDetail(disciplinaryCaseId, user);
  }

  @Get('employee-relations/disciplinary-cases')
  @ApiOperation({ summary: 'Get all Disciplinary Cases' })
  @ApiGetResponse('List of Disciplinay Cases')
  @Can({ action: ACTION_READ, subject: MASTERTABLES })
  getDisciplinaryCases(
    @SessionUser() user: RequestUser,
    @Query() dto: ErCasePaginationDto,
  ) {
    return this.disciplinaryCaseService.getDisciplinaryCases(dto, user);
  }

  @Post('employee-relations/disciplinary-cases')
  @ApiBody({
    type: CreateCaseDto,
    description: 'Payload to create Disciplinary Case Report',
  })
  @ApiOperation({ summary: 'Create a new Disciplinary Case Report' })
  @ApiPostResponse('Disciplinary Case Report created successfully')
  @Can({ action: ACTION_CREATE, subject: MASTERTABLES })
  createDisciplinaryCase(
    @Body() dto: CreateCaseDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.disciplinaryCaseService.createCase(dto, user);
  }

  @Put('employee-relations/disciplinary-cases/:disciplinaryCaseId')
  @ApiOperation({
    summary: 'Update an existing Disciplinary Case details',
  })
  @ApiPatchResponse('Disciplinary Case updated successfully')
  updateDisciplinaryCase(
    @Param('disciplinaryCaseId', new ParseUUIDPipe())
    disciplinaryCaseId: string,
    @Body() dto: UpdateCaseDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.disciplinaryCaseService.updateCase(
      disciplinaryCaseId,
      dto,
      user,
    );
  }

  @Put('employee-relations/disciplinary-cases/case-parties/:partyId/details')
  @ApiOperation({
    summary: 'Update an existing Party Details',
  })
  @ApiPatchResponse('Party Details updated successfully')
  updateCasePartyDetails(
    @Param('partyId', new ParseUUIDPipe()) partyId: string,
    @SessionUser() user: RequestUser,
    @Body() dto: UpdateCasePartyDto,
  ) {
    return this.disciplinaryCaseService.updateCasePartyDetails(
      partyId,
      user,
      dto,
    );
  }

  @Put('employee-relations/disciplinary-cases/:caseId/advance-stage')
  @ApiOperation({
    summary:
      'Advance every eligible respondent to their next stage; ineligible ones are left behind.',
  })
  @ApiOkResponse({ type: AdvanceStageResponseDto })
  advanceStage(
    @Param('caseId', new ParseUUIDPipe()) caseId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.disciplinaryCaseService.advanceAllEligible(caseId, user);
  }

  @Put('employee-relations/disciplinary-cases/party/:partyId/no-response')
  @ApiOperation({ summary: 'Party is no show will be mark as no response' })
  @ApiPatchResponse('Party or Employee involved mark as no show')
  @Can({ action: ACTION_UPDATE, subject: MASTERTABLES })
  updateMarkNoResponse(
    @Param('partyId', new ParseUUIDPipe()) partyId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.disciplinaryCaseService.markNoResponse(partyId, user);
  }
}
