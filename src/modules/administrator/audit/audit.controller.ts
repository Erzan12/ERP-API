import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AuditService } from './audit.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequestUser } from 'src/components/types/request-user.interface';
import { Can } from 'src/components/decorators/can.decorator';
import { SecurityClearance } from 'src/middleware/security_clearance/security-clearance.decorator';
import { SessionUser } from 'src/components/decorators/session-user.decorator';
import { ACTION_READ, AUDIT_TRAIL, SEC_LVL_8 } from 'src/components/constants/ability.constant';

@ApiBearerAuth('access-token')
@ApiTags('Administrator')
@Controller('audit')
export class AuditController {
    constructor(private auditService: AuditService) {}

    @Get()
    @ApiOperation({ summary: 'Get audit logs with filters' })
    @SecurityClearance(SEC_LVL_8)
    @Can({ action: ACTION_READ, subject: AUDIT_TRAIL })
    async getAuditLogs(
        @Query('user_id') userId?: number,
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

    @Get('resource/:resource/:id')
    @ApiOperation({ summary: 'Get audit history fo ra specific resource' })
    @SecurityClearance(SEC_LVL_8)
    @Can({ action: ACTION_READ, subject: AUDIT_TRAIL})
    async getResourceHistory(
        @Param('resource') resource: string,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.auditService.getResourceHistory(resource, id);
    }

    @Get('user/:id/activity')
    @ApiOperation({ summary: 'Get user activity report' })
    @SecurityClearance(SEC_LVL_8)
    @Can({ action: ACTION_READ, subject: AUDIT_TRAIL })
    async getUserActivity(
        @Param('id', ParseIntPipe) userId: number,
        @Query('days') days?: number,
    ) {
        return this.auditService.getUserActivity(userId, days);
    }

    @Get('my-activity')
    @ApiOperation({ summary: 'Get own activity report' })
    async getMyActivity(
        @SessionUser() user: RequestUser,
        @Query('days') days?: number,
    ) {
        return this.auditService.getUserActivity(user.id, days);
    }
}