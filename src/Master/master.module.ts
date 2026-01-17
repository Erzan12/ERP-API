import { Module } from '@nestjs/common';
import { MasterController } from '../Master/master.controller';
import { PositionService } from '../Master/position/position.service';
import { CreatePositionDto } from './position/dto/create-position.dto';
import { DepartmentService } from './department/department.service';
import { CreateDepartmentDto } from './department/dto/create-dept.dto';
import { CompanyService } from '../Master/company/company.service';
import { CreateCompanyDto } from './company/dto/create-company.dto';
import { DivisionService } from '../Master/division/division.service';
import { CreateDivisionDto } from './division/dto/create-division.dto';
import { PositionController } from './position/position.controller';
import { DepartmentController } from './department/department.controller';
import { CompanyController } from './company/company.controller';
import { DivisionController } from './division/division.controller';
import { EmploymentStatusService } from './employment_status/employment_status.service';
import { EmploymentStatusController } from './employment_status/employment_status.controller';
import { PrismaService } from 'src/Prisma/prisma.service';
import { UserLocationController } from './user_location/user_location.controller';
import { UserLocationService } from './user_location/user_location.service';

@Module({
    imports: [],
    providers: [PrismaService,PositionService, DepartmentService, CompanyService, DivisionService, EmploymentStatusService, CreateDivisionDto, CreateDepartmentDto, CreatePositionDto, CreateCompanyDto, UserLocationService ],
    controllers: [MasterController, PositionController, DepartmentController, CompanyController, DivisionController, EmploymentStatusController, UserLocationController],
    exports: [],
})
export class MasterModule {}

