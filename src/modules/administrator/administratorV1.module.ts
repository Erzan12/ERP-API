import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/jobs/mail/mail.service';
import { SubModuleService } from './sub_module/sub_module.service';
import { RoleControllerV1 } from './role/controllers/roleV1.controller';
import { RoleService } from './role/role.service';
import { ModuleService } from './module/module.service';
import { SubModuleControllerV1 } from './sub_module/controllers/sub_moduleV1.controller';
import { SecurityClearanceService } from './security_clearance/security-clearance.service';
import { UserService } from 'src/modules/manager/user/user.service';
import { DashboardService } from './dashboard/dashboard.service';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { EmploymentStatusService } from '../master/employment_status/employment_status.service';
import { JwtStrategy } from 'src/middleware/jwt/jwt.strategy';
import { AuditControllerV1 } from './audit/controllers/auditV1.controller';
import { AuditService } from './audit/audit.service';
import { DashboardControllerv1 } from './dashboard/controllers/dashboardV1.controller';
import { ModuleControllerV1 } from './module/controllers/moduleV1.controller';
import { SecurityClearanceControllerV1 } from './security_clearance/controllers/security-clearanceV1.controller';
import { EmploymentStatusControllerV1 } from '../master/employment_status/controllers/employment_statusV1.controller';

@Module({
  imports: [AuthModule],
  controllers: [
    SubModuleControllerV1,
    EmploymentStatusControllerV1,
    ModuleControllerV1,
    RoleControllerV1,
    SecurityClearanceControllerV1,
    DashboardControllerv1,
    AuditControllerV1,
  ],
  providers: [
    JwtStrategy,
    JwtService,
    PrismaService,
    UserService,
    MailService,
    SubModuleService,
    ModuleService,
    RoleService,
    EmploymentStatusService,
    SecurityClearanceService,
    DashboardService,
    AuditService,
  ],
  exports: [AdministratorV1Module],
})
export class AdministratorV1Module {}
