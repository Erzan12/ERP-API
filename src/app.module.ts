import { Module} from '@nestjs/common';
import { AuthModule } from './Auth/auth.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { MailService } from './Mail/mail.service';
import { ConfigModule } from '@nestjs/config';
import { EmployeeService } from './HR/employee_masterlist/employee.service';
import { EmployeeController } from './HR/employee_masterlist/employee.controller';
import { AdministratorController } from 'src/Administrator/administrator.controller';
import { AdministratorModule } from 'src/Administrator/administrator.module';
import { APP_GUARD } from '@nestjs/core';
import { CustomJwtAuthGuard } from './Components/middleware/jwt.auth.guard';
import { MasterController } from './Master/master.controller';
import { PositionService } from './Master/position/position.service';
import { MasterModule } from './Master/master.module';
import { DepartmentService } from './Master/department/department.service';
import { CreatePositionDto } from './Master/position/dto/create-position.dto';
import { CreateDepartmentDto } from './Master/department/dto/create-dept.dto';
import { CreateDivisionDto } from './Master/division/dto/create-division.dto';
import { CaslModule } from './Components/casl/casl.module';
import { CaslAbilityService } from './Components/casl/casl.service';
import { HrModule } from './HR/hr.module';
import { ManagerModule } from './Manager/manager.module';
import { JwtStrategy } from './Components/middleware/jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './Auth/auth.controller';
import { HomeController, ProfileController } from './Global/global.controller';
import { DivisionService } from './Master/division/division.service';
import { CreateCompanyDto } from './Master/company/dto/create-company.dto';
import { CompanyService } from './Master/company/company.service';
import { PermissionsGuard } from './Components/guards/permission.guard';
import { SecurityClearanceGuard } from './Components/security_clearance/security-clearance.guard';
import { EmploymentStatusService } from './Master/employment_status/employment_status.service';
import { EmploymentStatusController } from './Master/employment_status/employment_status.controller';
import { UserService } from './Manager/user/user.service';
import { UserController } from './Manager/user/user.controller';

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
    PrismaModule
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
    MailService, 
    // PersonService, 
    EmployeeService, UserService, PositionService, DepartmentService, CaslAbilityService, DivisionService, CompanyService, EmploymentStatusService, CreateDepartmentDto, CreatePositionDto, CreateDivisionDto, CreateCompanyDto
  ],
  controllers: [ EmployeeController, AdministratorController, MasterController, HomeController, ProfileController, AuthController, UserController],
})
export class AppModule {}
