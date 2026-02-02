import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/jobs/mail/mail.service';
import { SubModuleService } from './sub_module/sub_module.service';
import { RoleController } from './role/role.controller';
import { RoleService } from './role/role.service';
import { ModuleService } from './module/module.service';
import { ModuleController } from './module/module.controller';
import { SubModuleController } from './sub_module/sub_module.controller';
import { SecurityClearanceService } from './security_clearance/security-clearance.service';
import { SecurityClearanceController } from './security_clearance/security-clearance.controller';
import { UserService } from 'src/modules/manager/user/user.service';
import { DashboardService } from './dashboard/dashboard.service';
import { DashboardController } from './dashboard/dashboard.controller';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { EmploymentStatusController } from '../master/employment_status/employment_status.controller';
import { EmploymentStatusService } from '../master/employment_status/employment_status.service';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { AuditController } from './audit/audit.controller';
import { AuditService } from './audit/audit.service';

@Module({
  imports: [AuthModule],
  controllers: [
    SubModuleController,
    ModuleController,
    RoleController,
    EmploymentStatusController,
    EmploymentStatusController,
    SecurityClearanceController,
    DashboardController,
    AuditController,
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
  exports: [AdministratorModule],
})
export class AdministratorModule {}
