import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/jobs/mail/mail.service';
import { SubModuleService } from './sub_module/sub_module.service';
import { RoleControllerV2 } from './role/roleV2.controller';
import { RoleService } from './role/role.service';
import { ModuleService } from './module/module.service';
import { ModuleControllerV2 } from './module/moduleV2.controller';
import { SubModuleControllerV2 } from './sub_module/sub_moduleV2.controller';
import { SecurityClearanceService } from './security_clearance/security-clearance.service';
import { SecurityClearanceControllerV2 } from './security_clearance/security-clearanceV2.controller';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { EmploymentStatusService } from '../master/employment_status/employment_status.service';
import { JwtStrategy } from 'src/middleware/jwt/jwt.strategy';
import { AuditControllerV2 } from './audit/auditV2.controller';
import { AuditService } from './audit/audit.service';
import { DashboardControllerv2 } from './dashboard/dashboardV2.controller';
import { DashboardService } from './dashboard/dashboard.service';
import { HealthController } from './health/health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { DbQueryControllerV2 } from './db-query/db-query.controller';
import { DbQueryService } from './db-query/db-query.service';
import { SlackModule } from 'src/jobs/slack/slack.module';
import { HttpModule } from '@nestjs/axios';
import { SlackService } from 'src/jobs/slack/slack.service';

@Module({
  imports: [AuthModule, TerminusModule, SlackModule, HttpModule],
  controllers: [
    SubModuleControllerV2,
    ModuleControllerV2,
    RoleControllerV2,
    SecurityClearanceControllerV2,
    DashboardControllerv2,
    AuditControllerV2,
    HealthController,
    DbQueryControllerV2,
  ],
  providers: [
    JwtStrategy,
    JwtService,
    PrismaService,
    MailService,
    SubModuleService,
    ModuleService,
    RoleService,
    EmploymentStatusService,
    SecurityClearanceService,
    DashboardService,
    AuditService,
    DbQueryService,
    SlackService,
  ],
  exports: [AdministratorV2Module],
})
export class AdministratorV2Module {}
