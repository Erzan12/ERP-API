import { Controller, Param, ParseUUIDPipe, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CaseCloseService } from './case-close.service';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';

@ApiTags('Human Resources - Employee Relations(Case Close)')
@Controller({ path: 'hris', version: '2' })
export class CaseCloseController {
    constructor (private readonly caseCloseService: CaseCloseService) {}

    @Put('employee-relations/discplinary-case/:disciplinaryCaseId/case-close')
    @ApiOperation({
        summary: 'Close disciplinary case',
        description: 
            'Closes the disciplinary case and exits the case_cloased stage for all respondents.',
    })
    closeCase(
        @Param('disciplinaryCaseId', new ParseUUIDPipe()) disciplinaryCaseId: string,
        @SessionUser() user: RequestUser,
    ) {
        return this.caseCloseService.closeCase(disciplinaryCaseId, user);
    }
}
