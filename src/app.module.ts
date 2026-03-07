import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './config/prisma/prisma.module';
import { CaslModule } from './middleware/casl/casl.module';
import { LandingModule } from './landing/landing.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { AdministratorV1Module } from 'src/modules/administrator/administratorV1.module';
import { AdministratorV2Module } from './modules/administrator/administratorV2.module';
import { HrV1Module } from './modules/hris/hrV1.module';
import { HrV2Module } from './modules/hris/hrV2.module';
import { ManagerV1Module } from './modules/manager/managerV1.module';
import { ManagerV2Module } from './modules/manager/managerV2.module';
import { MasterV1Module } from './modules/master/masterV1.module';
import { MasterV2Module } from './modules/master/masterV2.module';
import { UserManagementV1Module } from './modules/manager/user_management/modules/user_managementV1.module';
import { UserManagementV2Module } from './modules/manager/user_management/modules/user_managementV2.module';

import { PermissionsGuard } from './middleware/guards/permission.guard';
import { CustomJwtAuthGuard } from './middleware/jwt/jwt.auth.guard';
import { SecurityClearanceGuard } from './middleware/security_clearance/security-clearance.guard';
import { APP_GUARD } from '@nestjs/core';

import { AuthController } from './auth/auth.controller';
// import { UserController } from './modules/manager/user/controllers/userv2.controller';
// import { UserLocationController } from './modules/master/user_location/controller/user_locationV2.controller';

import { UserManagementService } from './modules/manager/user_management/user_management.service';
import { AuditService } from './modules/administrator/audit/audit.service';
import { PositionService } from './modules/master/position/position.service';
import { EmployeeService } from './modules/hris/employee_masterlist/employee.service';
import { CaslAbilityService } from './middleware/casl/casl.service';
import { DepartmentService } from './modules/master/department/department.service';
import { EmploymentStatusService } from './modules/master/employment_status/employment_status.service';
import { CompanyService } from './modules/master/company/company.service';
import { PrismaService } from './config/prisma/prisma.service';
import { DivisionService } from './modules/master/division/division.service';
import { MailService } from './jobs/mail/mail.service';
import { UserLocationService } from './modules/master/user_location/user_location.service';

import { AuditControllerV2 } from './modules/administrator/audit/controllers/auditV2.controller';
// import { HealthCheckController } from './health-check/health-check.controller';
// import { HealthCheckService } from './health-check/health-check.service';
// import { HealthCheckModule } from './health-check/health-check.module';
// import { HealthModule } from './modules/administrator/health/health.module';

@Module({
  imports: [
    // Adding config here so dotenv will be global no more import per service with @nestjs/config
    ConfigModule.forRoot({
      isGlobal: true, // makes config available app-wide
      envFilePath: '.env', // optional: default is .env
    }),
    LandingModule,
    AuthModule,
    JwtModule,
    AdministratorV1Module,
    AdministratorV2Module,
    MasterV1Module,
    MasterV2Module,
    CaslModule,
    HrV1Module,
    HrV2Module,
    ManagerV1Module,
    ManagerV2Module,
    UserManagementV1Module,
    UserManagementV2Module,
    PrismaModule,
    // HealthCheckModule,
    // HealthModule,
  ],
  providers: [
    {
      //global custom auth guard
      provide: APP_GUARD,
      useClass: CustomJwtAuthGuard,
    },
    {
      //global roles permission guard
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      //global security clearance level guard
      provide: APP_GUARD,
      useClass: SecurityClearanceGuard,
    },
    UserManagementService,
    PrismaService,
    AuditService,
    MailService,
    EmployeeService,
    PositionService,
    DepartmentService,
    CaslAbilityService,
    DivisionService,
    CompanyService,
    EmploymentStatusService,
    UserLocationService,
    // HealthCheckService,
  ],
  controllers: [
    // EmployeeControllerV1,
    AuthController,
    // HealthCheckController,
    // UserController,
    // UserLocationController,
  ],
})
export class AppModule {}
