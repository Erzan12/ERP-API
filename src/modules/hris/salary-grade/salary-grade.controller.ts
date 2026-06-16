import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SalaryGradeService } from './salary-grade.service';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { ApiGetResponse, ApiPostResponse } from 'src/utils/helpers/swagger-response.helper';
import { CreateSalaryGradeDto } from './dto/salary-grade.dto';

@ApiTags('Human Resources - Salary Grade')
@Controller({path:'hris', version: '2'})
export class SalaryGradeController {

    constructor (private readonly salaryGradeService: SalaryGradeService) {}

    @Get('salary-grades')
    @ApiOperation({ summary: 'List of all Salary Grades' })
    @ApiGetResponse('List of Salary Grades')
    getSalaryGrades(
        @SessionUser() user: RequestUser
    ) {
        return this.salaryGradeService.getSalaryGrades(user);
    }

    @Post('salary-grades')
    @ApiBody({
        type: CreateSalaryGradeDto,
        description: 'Payload to create Salary Grade'
    })
    @ApiOperation({ summary: 'Create a Salary Grade' })
    @ApiPostResponse('Salary Grade successfully created')
    createSalaryGrade(
        @Body() dto: CreateSalaryGradeDto,
        @SessionUser() user: RequestUser
    ) {
        return this.salaryGradeService.createSalaryGrade(user, dto);
    }
}
