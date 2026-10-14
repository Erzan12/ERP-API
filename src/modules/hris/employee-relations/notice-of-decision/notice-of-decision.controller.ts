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
import { NoticeOfDecisionService } from './notice-of-decision.service';
import { CreateDecisionDto, UpdateDecisionDto } from './dto/decision.dto';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';

@ApiTags('Human Resources - Employee Relations(Notice of Decision)')
@Controller({ path: 'hris', version: '2' })
export class NoticeOfDecisionController {
  constructor(
    private readonly noticeOfDecisionService: NoticeOfDecisionService,
  ) {}

  @Get('employee-relations/notice-of-decision/:decisionId')
  @ApiOperation({
    summary: 'Get a Notice of Decision',
  })
  getDecision(
    @Param('decisionId', ParseUUIDPipe) decisionId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.noticeOfDecisionService.getNoticeOfDecision(decisionId, user);
  }

  @Post('employee-relations/notice-of-decision')
  @ApiOperation({
    summary: 'Create a Notice of Decision',
  })
  createDecision(
    @Body() dto: CreateDecisionDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.noticeOfDecisionService.createNoticeOfDecision(dto, user);
  }

  @Put('employee-relations/notice-of-decision/:decisionId')
  @ApiOperation({
    summary: 'Update an existing Notice of Decision.',
  })
  updateDecision(
    @Param('decisionId', ParseUUIDPipe) decisionId: string,
    @Body() dto: UpdateDecisionDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.noticeOfDecisionService.updateNoticeOfDecision(
      decisionId,
      dto,
      user,
    );
  }

  @Put('employee-relations/notice-of-decision/:decisionId/party')
  @ApiOperation({
    summary: 'Record and serve a the Notice of Decision for a respondent.',
  })
  submitDecision(
    @Param('decisionId', ParseUUIDPipe) decisionId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.noticeOfDecisionService.submitNoticeOfDecision(
      decisionId,
      user,
    );
  }
}
