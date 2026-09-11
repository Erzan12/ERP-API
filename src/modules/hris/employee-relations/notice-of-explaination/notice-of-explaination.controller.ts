import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NoticeOfExplainationService } from './notice-of-explaination.service';
import {
  CreateNteDto,
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

  @Get('employee-relations/nte/:nteId')
  @ApiOperation({
    summary: 'Get single NTE',
  })
  getNteList(
    @Param('nteId', new ParseUUIDPipe()) nteId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.noticeOfExplainationService.getNte(nteId, user);
  }

  @Post('employee-relations/nte/parties')
  @ApiOperation({
    summary: 'Create an NTE',
  })
  createNte(@Body() dto: CreateNteDto, @SessionUser() user: RequestUser) {
    return this.noticeOfExplainationService.createNte(dto, user);
  }

  @Put('employee-relations/nte/parties/:nteId/submit-nte')
  @ApiOperation({
    summary: 'Submit NTE',
  })
  submitNte(
    @Param('nteId', new ParseUUIDPipe()) nteId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.noticeOfExplainationService.submitNte(nteId, user);
  }

  @Put('employee-relations/nte/parties/:partyId/issue-nte')
  @ApiOperation({
    summary: 'Issue an NTE to a respondent and assign reviewers',
  })
  issueNte(
    @Param('partyId', new ParseUUIDPipe()) partyId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.noticeOfExplainationService.issueNte(partyId, user);
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
