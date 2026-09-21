import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WrittenExplainationService } from './written-explanation.service';
import { SubmitExplainationDto } from './dto/submit-explanation.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';

@ApiTags('Human Resources - Employee Relations(Written Explationation)')
@Controller({ path: 'hris', version: '2' })
export class WrittenExplainationController {
  constructor(
    private readonly writtenExplanationService: WrittenExplainationService,
  ) {}

  @Get('employee-relations/written-explanation/:explanationId')
  @ApiOperation({
    summary: 'Get a Written Explanation',
  })
  getWrittenExplanation(
    @Param('explanationId', new ParseUUIDPipe()) explanationId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.writtenExplanationService.getWrittenExplanation(
      explanationId,
      user,
    );
  }

  @Post('employee-relations/written-explanation/parties')
  @ApiOperation({
    summary: "Record a respondent's written explanation.",
  })
  submitExplanation(
    @Body() dto: SubmitExplainationDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.writtenExplanationService.submitWrittenExplanation(dto, user);
  }
}
