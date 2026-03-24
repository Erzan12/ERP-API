import { Module } from '@nestjs/common';
import { PositionService } from './position/position.service';
import { CreatePositionDto } from './position/dto/position.dto';
import { DepartmentService } from './department/department.service';
import { CreateDepartmentDto } from './department/dto/department.dto';
import { CompanyService } from './company/company.service';
import { CreateCompanyDto } from './company/dto/company.dto';
import { DivisionService } from './division/division.service';
import { CreateDivisionDto } from './division/dto/division.dto';
import { PositionControllerV2 } from './position/positionV2.controller';
import { DepartmentControllerV2 } from './department/departmentV2.controller';
import { CompanyControllerV2 } from './company/companyV2.controller';
import { DivisionControllerV2 } from './division/divisionV2.controller';
import { EmploymentStatusService } from './employment_status/employment_status.service';
import { EmploymentStatusControllerV2 } from './employment_status/employment_statusV2.controller';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { UserLocationService } from './user_location/user_location.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserLocationControllerV2 } from './user_location/user_locationV2.controller';

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
    PositionControllerV2,
    DepartmentControllerV2,
    CompanyControllerV2,
    DivisionControllerV2,
    EmploymentStatusControllerV2,
    UserLocationControllerV2,
  ],
  exports: [],
})
export class MasterV2Module {}
