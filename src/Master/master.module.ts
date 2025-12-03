import { Module } from '@nestjs/common';
import { MasterController } from '../Master/master.controller';
import { PositionService } from '../Master/position/position.service';
import { PrismaService } from 'prisma/prisma.service';
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

@Module({
    imports: [],
    providers: [PrismaService,PositionService, DepartmentService, CompanyService, DivisionService, EmploymentStatusService, CreateDivisionDto, CreateDepartmentDto, CreatePositionDto, CreateCompanyDto ],
    controllers: [MasterController, PositionController, DepartmentController, CompanyController, DivisionController, EmploymentStatusController],
    exports: [],
})
export class MasterModule {}

