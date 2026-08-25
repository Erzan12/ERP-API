import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NoticeOfDecisionService } from './notice-of-decision.service';
import { SubmitDecisionDto } from './dto/submit-decision.dto';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';

@ApiTags('Human Resources - Employee Relations(Notice of Decision)')
@Controller({ path:'hris', version: '2' })
export class NoticeOfDecisionController {
    constructor (private readonly noticeOfDecisionService: NoticeOfDecisionService) {}

    @Post('employee-relations/notice-of-decision/parties')
    @ApiOperation({
        summary: "Record and serve a the Notice of Decision for a respondent.",
    })
    submitDecision(
        @Body() dto: SubmitDecisionDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.noticeOfDecisionService.submitNoticeOfDecision(dto, user);
    }

}
