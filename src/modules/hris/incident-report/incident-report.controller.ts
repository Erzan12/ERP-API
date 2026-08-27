import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IncidentReportService } from './incident-report.service';
import { CreateIncidentReportDto } from './dto/create-incident-report.dto';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';

@ApiTags('Human Resources - Incident Report')
@Controller({ path: 'hris', version: '2' })
export class IncidentReportController {
    constructor (private readonly incidentReportService: IncidentReportService) {}

    @Post('incident-report')
    @ApiOperation({
        summary: 'File an incident report'
    })
    async createIncidentReport(
        @Body() dto: CreateIncidentReportDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.incidentReportService.createIncidentReport(dto, user);
    }
}
