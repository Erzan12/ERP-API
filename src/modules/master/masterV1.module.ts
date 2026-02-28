import { Module } from '@nestjs/common';
import { PositionService } from './position/position.service';
import { CreatePositionDto } from './position/dto/position.dto';
import { DepartmentService } from './department/department.service';
import { CreateDepartmentDto } from './department/dto/department.dto';
import { CompanyService } from './company/company.service';
import { CreateCompanyDto } from './company/dto/company.dto';
import { DivisionService } from './division/division.service';
import { CreateDivisionDto } from './division/dto/division.dto';
import { PositionControllerV1 } from './position/controllers/positionV1.controller';
import { DepartmentControllerV1 } from './department/controllers/departmentV1.controller';
import { DivisionControllerV1 } from './division/controllers/divisionV1.controller';
import { EmploymentStatusService } from './employment_status/employment_status.service';
import { EmploymentStatusControllerV1 } from './employment_status/controllers/employment_statusV1.controller';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { UserLocationService } from './user_location/user_location.service';
import { AuthModule } from 'src/auth/auth.module';
import { CompanyControllerV1 } from './company/controllers/companyV1.controller';
import { UserControllerV1 } from '../manager/user_account/controllers/user_accountV1.controller';
import { UserLocationControllerV1 } from './user_location/controllers/user_locationV1.controller';

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
    PositionControllerV1,
    DepartmentControllerV1,
    CompanyControllerV1,
    DivisionControllerV1,
    EmploymentStatusControllerV1,
  ],
  exports: [],
})
export class MasterV1Module {}
