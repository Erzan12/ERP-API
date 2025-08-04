import { Module } from '@nestjs/common';
import { MasterController } from '../Master/master.controller';
import { PositionService } from '../Master/position/position.service';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePositionDto } from './position/dto/create-position.dto';
import { DepartmentService } from './department/department.service';
import { CreateDepartmentDto } from './department/dto/create-dept.dto';
import { CompanyService } from './company/company.service';

@Module({
    imports: [],
    providers: [PrismaService,PositionService, DepartmentService, CreateDepartmentDto, CreatePositionDto, CompanyService],
    controllers: [MasterController],
    exports: [],
})
export class MasterModule {}

