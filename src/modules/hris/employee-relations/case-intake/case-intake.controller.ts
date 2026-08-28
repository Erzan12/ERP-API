import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CaseIntakeService } from './case-intake.service';
import { ApiGetResponse } from 'src/utils/helpers/swagger-response.helper';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { CaseIntakePaginationDto } from 'src/utils/dtos/er-related-pagination.dto';
import { ConvertIntakeToCaseDto } from '../disciplinary-case/dto/convert-intake-to-case.dto';

@ApiTags('Human Resources - Employee Relations(Case Intake)')
@Controller({ path: 'hris', version: '2' })
export class CaseIntakeController {
  constructor(private readonly caseIntakeService: CaseIntakeService) {}

  @Get('employee-relations/case-intake/incident-reports')
  @ApiOperation({ summary: 'Get Incident Reports' })
  @ApiGetResponse('Here is the list of Incident Reports')
  getIncidentReports(
    @Query() dto: CaseIntakePaginationDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.caseIntakeService.getIncidentReports(dto, user);
  }

  @Get('employee-relations/case-intake/employee-reports')
  @ApiOperation({ summary: 'Get Employee Reports' })
  @ApiGetResponse('Here is the list of Employee Reports')
  getEmployeeReports(
    @Query() dto: CaseIntakePaginationDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.caseIntakeService.getEmployeeReports(dto, user);
  }

  @Post('employee-relations/case-intake/:caseIntakeId/convert')
  @ApiOperation({ summary: 'Convert an IR or ER to Disciplinary Case' })
  convertIntake(
    @Param('caseIntakeId', new ParseUUIDPipe()) caseIntakeId: string,
    @Body() dto: ConvertIntakeToCaseDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.caseIntakeService.convertIntake(caseIntakeId, dto, user);
  }
}
