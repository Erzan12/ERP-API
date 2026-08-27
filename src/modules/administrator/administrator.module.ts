import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/jobs/mail/mail.service';
import { SubModuleService } from './sub_module/sub_module.service';
import {
  RoleController,
  RolePermissionController,
} from './role/role.controller';
import { RolePermissionService, RoleService } from './role/role.service';
import { ModuleService } from './module/module.service';
import { ModuleController } from './module/module.controller';
import { SubModuleController } from './sub_module/sub_module.controller';
import { SecurityClearanceService } from './security_clearance/security-clearance.service';
import { SecurityClearanceController } from './security_clearance/security-clearance.controller';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { EmploymentStatusService } from '../mastertable/employment-status/employment-status.service';
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
import { FileUploadController } from './file-upload/file-upload.controller';
import { SubModuleActionController } from './sub-module-action/sub-module-action.controller';
import { SubModuleActionService } from './sub-module-action/sub-module-action.service';

@Module({
  imports: [AuthModule, TerminusModule, SlackModule, HttpModule],
  controllers: [
    SubModuleController,
    ModuleController,
    RoleController,
    RolePermissionController,
    SecurityClearanceController,
    DashboardController,
    AuditController,
    HealthController,
    DbQueryController,
    FileUploadController,
    SubModuleActionController,
    RolePermissionController,
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
    SubModuleActionService,
    RolePermissionService,
  ],
  exports: [AdministratorModule],
})
export class AdministratorModule {}
