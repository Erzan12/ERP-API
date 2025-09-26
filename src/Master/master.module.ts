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

@Module({
    imports: [],
    providers: [PrismaService,PositionService, DepartmentService, CompanyService, DivisionService, CreateDivisionDto, CreateDepartmentDto, CreatePositionDto, CreateCompanyDto ],
    controllers: [MasterController],
    exports: [],
})
export class MasterModule {}

