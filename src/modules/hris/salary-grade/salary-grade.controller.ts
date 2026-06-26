import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SalaryGradeService } from './salary-grade.service';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import {
  ApiGetResponse,
  ApiPatchResponse,
  ApiPostResponse,
} from 'src/utils/helpers/swagger-response.helper';
import {
  CreateSalaryGradeDto,
  UpdateSalaryGradeDto,
} from './dto/salary-grade.dto';
import { Can } from 'src/utils/decorators/can.decorator';
import {
  ACTION_CREATE,
  ACTION_READ,
  ACTION_UPDATE,
  SALARY_GRADE,
} from 'src/utils/constants/ability.constant';

@ApiTags('Human Resources - Salary Grade')
@Controller({ path: 'hris', version: '2' })
export class SalaryGradeController {
  constructor(private readonly salaryGradeService: SalaryGradeService) {}

  @Get('salary-grades')
  @ApiOperation({ summary: 'List of all Salary Grades' })
  @ApiGetResponse('List of Salary Grades')
  @Can({ action: ACTION_READ, subject: SALARY_GRADE })
  getSalaryGrades(@SessionUser() user: RequestUser) {
    return this.salaryGradeService.getSalaryGrades(user);
  }

  @Get('salary-grades/:salaryGradeId')
  @ApiOperation({ summary: 'Get a Salary Grade' })
  @ApiGetResponse('Get a Salary Grade')
  @Can({ action: ACTION_READ, subject: SALARY_GRADE })
  getSalaryGrade(
    @SessionUser() user: RequestUser,
    @Param('salaryGradeId', new ParseUUIDPipe()) salaryGradeId: string,
  ) {
    return this.salaryGradeService.getSalaryGrade(salaryGradeId, user);
  }

  @Post('salary-grades')
  @ApiBody({
    type: CreateSalaryGradeDto,
    description: 'Payload to create Salary Grade',
  })
  @ApiOperation({ summary: 'Create a Salary Grade' })
  @ApiPostResponse('Salary Grade successfully created')
  @Can({ action: ACTION_CREATE, subject: SALARY_GRADE })
  createSalaryGrade(
    @Body() dto: CreateSalaryGradeDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.salaryGradeService.createSalaryGrade(user, dto);
  }

  @Put('salary-grades/:salaryGradeId')
  @ApiBody({
    type: UpdateSalaryGradeDto,
    description: 'Payload to update Salary Grade',
  })
  @ApiOperation({ summary: 'Update a current Salary Grade' })
  @ApiPatchResponse('Salary Grade updated successfully')
  @Can({ action: ACTION_UPDATE, subject: SALARY_GRADE })
  updateSalaryGrade(
    @Param('salaryGradeId', new ParseUUIDPipe()) salaryGradeId: string,
    @SessionUser() user: RequestUser,
    @Body() dto: UpdateSalaryGradeDto,
  ) {
    return this.salaryGradeService.updateSalaryGrade(salaryGradeId, user, dto);
  }
}
