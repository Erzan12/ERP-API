import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SalaryGradeService } from './salary-grade.service';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { ApiGetResponse } from 'src/utils/helpers/swagger-response.helper';

@ApiTags('Human Resources - Salary Grade')
@Controller({path:'hris', version: '2'})
export class SalaryGradeController {

    constructor (private readonly salaryGradeService: SalaryGradeService) {}

    @Get('salary-grades')
    @ApiOperation({ summary: 'List of all Salary Grades'})
    @ApiGetResponse('List of Salary Grades')
    getSalaryGrades(
        @SessionUser() user: RequestUser
    ) {
        return this.salaryGradeService.getSalaryGrades(user);
    }
}
