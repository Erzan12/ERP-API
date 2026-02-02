import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MailService } from './jobs/mail/mail.service';
import { ConfigModule } from '@nestjs/config';
import { AdministratorModule } from 'src/modules/administrator/administrator.module';
import { APP_GUARD } from '@nestjs/core';
import { CustomJwtAuthGuard } from './auth/jwt/jwt.auth.guard';
import { AuthController } from './auth/auth.controller';
import { HomeController, ProfileController } from './global/global.controller';
import { SecurityClearanceGuard } from './auth/security_clearance/security-clearance.guard';
import { UserService } from './modules/manager/user/user.service';
import { UserController } from './modules/manager/user/user.controller';
import { PrismaModule } from './config/prisma/prisma.module';
import { PrismaService } from './config/prisma/prisma.service';
import { DivisionService } from './modules/master/division/division.service';
import { HrModule } from './modules/hris/hr.module';
import { ManagerModule } from './modules/manager/manager.module';
import { UserLocationService } from './modules/master/user_location/user_location.service';
import { UserLocationController } from './modules/master/user_location/user_location.controller';
import { EmploymentStatusController } from './modules/master/employment_status/employment_status.controller';
import { EmploymentStatusService } from './modules/master/employment_status/employment_status.service';
import { CompanyService } from './modules/master/company/company.service';
import { CreateCompanyDto } from './modules/master/company/dto/create-company.dto';
import { CreateDivisionDto } from './modules/master/division/dto/create-division.dto';
import { CreateDepartmentDto } from './modules/master/department/dto/create-dept.dto';
import { CreatePositionDto } from './modules/master/position/dto/create-position.dto';
import { DepartmentService } from './modules/master/department/department.service';
import { MasterModule } from './modules/master/master.module';
import { PositionService } from './modules/master/position/position.service';
import { MasterController } from './modules/master/master.controller';
import { EmployeeController } from './modules/hris/employee_masterlist/employee.controller';
import { EmployeeService } from './modules/hris/employee_masterlist/employee.service';
import { PermissionsGuard } from './auth/guards/permission.guard';
import { JwtStrategy } from './auth/jwt/jwt.strategy';
import { CaslAbilityService } from './auth/casl/casl.service';
import { CaslModule } from './auth/casl/casl.module';
import { AuditService } from './modules/administrator/audit/audit.service';

@Module({
  imports: [
    // Adding config here so dotenv will be global no more import per service with @nestjs/config
    ConfigModule.forRoot({
      isGlobal: true, // makes config available app-wide
      envFilePath: '.env', // optional: default is .env
    }),
    AuthModule,
    JwtModule,
    // ManagerModule,
    // PersonModule,
    AdministratorModule,
    MasterModule,
    CaslModule,
    HrModule,
    ManagerModule,
    PrismaModule,
  ],
  providers: [
    // ManagerService,
    UserService,
    PrismaService,
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
    AuditService,
    MailService,
    // PersonService,
    EmployeeService,
    UserService,
    PositionService,
    DepartmentService,
    CaslAbilityService,
    DivisionService,
    CompanyService,
    EmploymentStatusService,
    UserLocationService,
    CreateDepartmentDto,
    CreatePositionDto,
    CreateDivisionDto,
    CreateCompanyDto,
  ],
  controllers: [
    EmployeeController,
    MasterController,
    HomeController,
    ProfileController,
    AuthController,
    UserController,
    UserLocationController,
  ],
})
export class AppModule {}
