import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IncidentReportService } from './incident-report.service';
import {
  CreateIncidentReportDto,
  UpdateIncidentReportDto,
} from './dto/incident-report.dto';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { ApiGetResponse } from 'src/utils/helpers/swagger-response.helper';
import { IncidentReportPaginationDto } from 'src/utils/dtos/er-related-pagination.dto';

@ApiTags('Human Resources - Incident Report')
@Controller({ path: 'hris', version: '2' })
export class IncidentReportController {
  constructor(private readonly incidentReportService: IncidentReportService) {}

  @Get('incident-reports')
  @ApiOperation({ summary: 'Get Incident Reports' })
  @ApiGetResponse('Here is the list of Incident Reports')
  getIncidentReports(
    @Query() dto: IncidentReportPaginationDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.incidentReportService.getIncidentReports(dto, user);
  }

  @Get('employee-reports/status-count')
  @ApiOperation({ summary: 'List of all Incident Report status' })
  @ApiGetResponse('List of all Incident Report status')
  getStatusCountActive(
    @SessionUser() user: RequestUser,
  ) {
    return this.incidentReportService.statusCount(user);
  }

  @Get('incident-reports/:incidentReportId')
  @ApiOperation({ summary: 'Get Incident Reports' })
  @ApiGetResponse('Here is the list of Incident Reports')
  getIncidentReport(
    @Param('incidentReportId', new ParseUUIDPipe()) incidentReportId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.incidentReportService.getIncidentReport(incidentReportId, user);
  }

  @Post('incident-reports')
  @ApiOperation({
    summary: 'File an incident report',
  })
  async createIncidentReport(
    @Body() dto: CreateIncidentReportDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.incidentReportService.createIncidentReport(dto, user);
  }

  @Put('incident-reports/:incidentReportId')
  @ApiOperation({ summary: 'Update an existing Incident Report' })
  updateIncidentReport(
    @Param('incidentReportId', new ParseUUIDPipe()) incidentReportId: string,
    @Body() dto: UpdateIncidentReportDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.incidentReportService.updateIncidentReport(
      incidentReportId,
      dto,
      user,
    );
  }

  @Put('incident-reports/:incidentReportId/submit')
  @ApiOperation({ summary: 'Submit Incident Report' })
  submitIncidentReport(
    @Param('incidentReportId', new ParseUUIDPipe()) incidentReportId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.incidentReportService.submitIncidentReport(
      incidentReportId,
      user,
    );
  }

  @Put('incident-reports/:incidentReportId/cancel')
  @ApiOperation({ summary: 'Cancel Incident Report' })
  cancelIncidentReport(
    @Param('incidentReportId', new ParseUUIDPipe()) incidentReportId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.incidentReportService.cancelIncidentReport(
      incidentReportId,
      user,
    );
  }
}
