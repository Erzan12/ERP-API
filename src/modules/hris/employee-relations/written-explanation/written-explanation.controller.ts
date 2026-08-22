import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WrittenExplainationService } from './written-explanation.service';
import { SubmitExplainationDto } from './submit-explanation.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';

@ApiTags('Human Resources - Employee Relations(Written Explationation)')
@Controller({ path: 'hris', version: '2' })
export class WrittenExplainationController {
  constructor(
    private readonly writtenExplanationService: WrittenExplainationService,
  ) {}

  @Post(
    'employee-relations/written-explanation/:disciplinaryCaseId/parties/:partyId',
  )
  @ApiOperation({
    summary: "Record a respondent's written explanation.",
  })
  submitExplanation(
    @Param('disciplinaryCaseId', new ParseUUIDPipe())
    disciplinaryCaseId: string,
    @Param('partyId', new ParseUUIDPipe()) partyId: string,
    @Body() dto: SubmitExplainationDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.writtenExplanationService.submitExplanation(
      disciplinaryCaseId,
      partyId,
      dto,
      user,
    );
  }
}
