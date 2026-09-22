import { Module } from '@nestjs/common';
import { PositionService } from './position/position.service';
import { CreatePositionDto } from './position/dto/position.dto';
import { DepartmentService } from './department/department.service';
import { CreateDepartmentDto } from './department/dto/department.dto';
import { CompanyService } from './company/company.service';
import { CreateCompanyDto } from './company/dto/company.dto';
import { DivisionService } from './division/division.service';
import { CreateDivisionDto } from './division/dto/division.dto';
import { PositionController } from './position/position.controller';
import { DivisionController } from './division/division.controller';
import { EmploymentStatusService } from './employment-status/employment-status.service';
import { EmploymentStatusController } from './employment-status/employment-status.controller';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { UserLocationService } from './user-location/user-location.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserLocationController } from './user-location/user-location.controller';
import { DepartmentController } from './department/department.controller';
import { CompanyController } from './company/company.controller';

@Module({
  imports: [AuthModule],
  providers: [
    PrismaService,
    PositionService,
    DepartmentService,
    CompanyService,
    DivisionService,
    EmploymentStatusService,
    CreateDivisionDto,
    CreateDepartmentDto,
    CreatePositionDto,
    CreateCompanyDto,
    UserLocationService,
  ],
  controllers: [
    PositionController,
    DepartmentController,
    CompanyController,
    DivisionController,
    EmploymentStatusController,
    UserLocationController,
  ],
  exports: [],
})
export class MastertableModule {}
