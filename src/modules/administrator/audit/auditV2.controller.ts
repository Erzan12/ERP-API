import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { AuditService } from './audit.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { Can } from 'src/utils/decorators/can.decorator';
import { SecurityClearance } from 'src/middleware/security_clearance/security-clearance.decorator';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import {
  ACTION_READ,
  AUDIT_TRAIL,
  SEC_LVL_8,
} from 'src/utils/constants/ability.constant';

@ApiTags('Administrator - Audit')
@Controller({ path: 'administrator', version: '2' })
export class AuditControllerV2 {
  constructor(private auditService: AuditService) {}

  @Get('audit')
  @ApiOperation({ summary: 'Get audit logs with filters' })
  @SecurityClearance(SEC_LVL_8)
  @Can({ action: ACTION_READ, subject: AUDIT_TRAIL })
  getAuditLogs(
    @Query('user_id') userId?: string,
    @Query('resource') resource?: string,
    @Query('action') action?: string,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
    @Query('success') success?: boolean,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.auditService.findLogs({
      user_id: userId,
      resource,
      action,
      start_date: startDate ? new Date(startDate) : undefined,
      end_date: endDate ? new Date(endDate) : undefined,
      success,
      limit,
      offset,
    });
  }

  @Get('audit/resource/:resource/:id')
  @ApiOperation({ summary: 'Get audit history fo ra specific resource' })
  @SecurityClearance(SEC_LVL_8)
  @Can({ action: ACTION_READ, subject: AUDIT_TRAIL })
  getResourceHistory(
    @Param('resource') resource: string,
    @Param('id', ParseIntPipe) id: string,
  ) {
    return this.auditService.getResourceHistory(resource, id);
  }

  @Get('audit/user/:id/activity')
  @ApiOperation({ summary: 'Get user activity report' })
  @SecurityClearance(SEC_LVL_8)
  @Can({ action: ACTION_READ, subject: AUDIT_TRAIL })
  getUserActivity(
    @Param('id', new ParseUUIDPipe()) userId: string,
    @Query('days') days?: number,
  ) {
    return this.auditService.getUserActivity(userId, days);
  }

  @Get('audit/my-activity')
  @ApiOperation({ summary: 'Get own activity report' })
  getMyActivity(
    @SessionUser() user: RequestUser,
    @Query('days') days?: number,
  ) {
    return this.auditService.getUserActivity(user.id, days);
  }
}
