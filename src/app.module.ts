import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './config/prisma/prisma.module';
import { CaslModule } from './middleware/casl/casl.module';
import { LandingModule } from './landing/landing.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { AdministratorModule } from './modules/administrator/administrator.module';
import { HrModule } from './modules/hris/hr.module';
import { ManagerModule } from './modules/manager/manager.module';
import { MastertableModule } from './modules/mastertable/mastertable.module';
import { UserManagementV2Module } from './modules/manager/user-management/user-management.module';
import { EmployeeDashboardModule } from './modules/employee-dashboard/employee-dashboard.module';

import { PermissionsGuard } from './middleware/guards/permission.guard';
import { CustomJwtAuthGuard } from './middleware/jwt/jwt.auth.guard';
import { SecurityClearanceGuard } from './middleware/security_clearance/security-clearance.guard';
import { APP_GUARD } from '@nestjs/core';

import { AuthController } from './auth/auth.controller';
// import { UserController } from './modules/manager/user/controllers/userv2.controller';
// import { UserLocationController } from './modules/master/user_location/controller/user_locationV2.controller';

import { UserManagementService } from './modules/manager/user-management/user-management.service';
import { AuditService } from './modules/administrator/audit/audit.service';
import { PositionService } from './modules/mastertable/position/position.service';
import { EmployeeService } from './modules/hris/employee/employee-masterlist/employee.service';
import { CaslAbilityService } from './middleware/casl/casl.service';
import { DepartmentService } from './modules/mastertable/department/department.service';
import { EmploymentStatusService } from './modules/mastertable/employment-status/employment-status.service';
import { CompanyService } from './modules/mastertable/company/company.service';
import { PrismaService } from './config/prisma/prisma.service';
import { DivisionService } from './modules/mastertable/division/division.service';
import { MailService } from './jobs/mail/mail.service';
import { UserLocationService } from './modules/mastertable/user-location/user-location.service';

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
    AdministratorModule,
    MastertableModule,
    CaslModule,
    HrModule,
    ManagerModule,
    UserManagementV2Module,
    EmployeeDashboardModule,
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
