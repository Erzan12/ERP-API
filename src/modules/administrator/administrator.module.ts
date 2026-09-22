import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/jobs/mail/mail.service';
import { SubModuleService } from './sub-module/sub-module.service';
import { RoleController } from './role/role.controller';
import { RoleService } from './role/role.service';
import { ModuleService } from './module/module.service';
import { ModuleController } from './module/module.controller';
import { SubModuleController } from './sub-module/sub-moduleV2.controller';
import { SecurityClearanceService } from './security-clearance/security-clearance.service';
import { SecurityClearanceController } from './security-clearance/security-clearance.controller';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { EmploymentStatusService } from '../mastertable/employment_status/employment_status.service';
import { JwtStrategy } from 'src/middleware/jwt/jwt.strategy';
import { AuditController } from './audit/audit.controller';
import { AuditService } from './audit/audit.service';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';
import { HealthController } from './health/health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { DbQueryController } from './db-query/db-query.controller';
import { DbQueryService } from './db-query/db-query.service';
import { SlackModule } from 'src/jobs/slack/slack.module';
import { HttpModule } from '@nestjs/axios';
import { SlackService } from 'src/jobs/slack/slack.service';

@Module({
  imports: [AuthModule, TerminusModule, SlackModule, HttpModule],
  controllers: [
    SubModuleController,
    ModuleController,
    RoleController,
    SecurityClearanceController,
    DashboardController,
    AuditController,
    HealthController,
    DbQueryController,
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
  exports: [AdministratorModule],
})
export class AdministratorModule {}
