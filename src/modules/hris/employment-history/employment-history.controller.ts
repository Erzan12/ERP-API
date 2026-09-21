import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { EmploymentHistoryService } from './employment-history.service';
import { ApiTags } from '@nestjs/swagger';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { CreateEmploymentHistoryDto } from './dto/employment-history.dto';

@ApiTags('Human Resource - Employees (Employment History)')
@Controller('employment-history')
export class EmploymentHistoryController {
  constructor(private employmentHistoryService: EmploymentHistoryService) {}

  @Get('employees/employment-history/:employeeId/')
  getEmploymentHistories(
    @SessionUser() user: RequestUser,
    @Param('employeeId', new ParseUUIDPipe()) employeeId: string,
  ) {
    return this.employmentHistoryService.getEmploymentHistories(
      user,
      employeeId,
    );
  }

  @Post('employees/employment-history/:employeeId/add-employment-history')
  createEmploymentHistory(
    @SessionUser() user: RequestUser,
    @Param('employeeId') employeeId: string,
    @Body() dto: CreateEmploymentHistoryDto,
  ) {
    return this.employmentHistoryService.createEmploymentHistory(
      user,
      employeeId,
      dto,
    );
  }
}
