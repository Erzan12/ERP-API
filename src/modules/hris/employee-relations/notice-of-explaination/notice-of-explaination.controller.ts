import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NoticeOfExplainationService } from './notice-of-explaination.service';
import {
  IssueNteDto,
  ReviewNteApprovalDto,
} from './dto/notice-of-explaination.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';

@ApiTags('Human Resources - Employee Relations(Notice of Explanation)')
@Controller({ path: 'hris', version: '2' })
export class NoticeOfExplainationController {
  constructor(
    private readonly noticeOfExplainationService: NoticeOfExplainationService,
  ) {}

  @Post('employee-relations/nte/:disciplinaryCaseId/parties/:partyId')
  @ApiOperation({
    summary: 'Issue an NTE to a respondent and assign reviewers',
  })
  IssueNte(
    @Param('disciplinaryCaseId', new ParseUUIDPipe())
    disciplinaryCaseId: string,
    @Param('partyId', new ParseUUIDPipe()) partyId: string,
    @Body() dto: IssueNteDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.noticeOfExplainationService.issueNte(
      disciplinaryCaseId,
      partyId,
      dto,
      user,
    );
  }

  @Put('employee-relations/nte/:nteId/approvals/:approvalId')
  @ApiOperation({ summary: 'Reviewer approves or request revision on an NTE.' })
  reviewNteApproval(
    @Param('nteId', new ParseUUIDPipe()) nteId: string,
    @Param('approvalId', new ParseUUIDPipe()) approvalId: string,
    @Body() dto: ReviewNteApprovalDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.noticeOfExplainationService.reviewNteApproval(
      nteId,
      approvalId,
      dto,
      user,
    );
  }
}
