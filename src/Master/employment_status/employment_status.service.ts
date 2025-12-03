import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEmployeeStatusDto } from './dto/create-emp-stat.dto';
import { RequestUser } from '../../Components/types/request-user.interface';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateEmpStatusDto } from './dto/update-emp-stat.dto';

@Injectable()
export class EmploymentStatusService {
    constructor(private prisma: PrismaService) {}

    //get a single employee_status
    async getEmpStatus (employeeStatusId: number, user: RequestUser) {
        const employeeStatus = await this.prisma.employmentStatus.findUnique({
            where: { id: employeeStatusId },
        });

        if (!employeeStatus) {
            throw new BadRequestException('Employee status not found.')
        }

        return {
            status: 'success',
            message: 'Here is the Employee Status',
            data: {
                employeeStatus,
            },
        };
    }

    //get all employee_status
    async getEmpStat (user: RequestUser) {
        const existingEmpStat = await this.prisma.employmentStatus.findMany()

        const formattedEmpStat = existingEmpStat.map(employmentStatus => ({
            emp_stat_id: employmentStatus.id,
            code: employmentStatus.code,
            label: employmentStatus.label,
        }))

        return formattedEmpStat;
    }

    async createEmpStat (empStatusDto: CreateEmployeeStatusDto, user: RequestUser) {
        const { code, label } = empStatusDto;

        const existingEmpStat = await this.prisma.employmentStatus.findUnique({
            where: { code: empStatusDto.code }
        });

        if(existingEmpStat){
            throw new BadRequestException('Employee Status already exist');
        }

        const createEmpStat = await this.prisma.employmentStatus.create({
            data: {
                code: empStatusDto.code,
                label: empStatusDto.label,
            }
        })

        return {
            status: 'success',
            mesage: 'Employment Status created successfully',
            data: {
                createEmpStat
            }
        }
    }

    async updateEmpStat (employmentStatusId: number, updateEmpStatusDto: UpdateEmpStatusDto, user: RequestUser) {
        const {  code, label } = updateEmpStatusDto;

        const employment_status = await this.prisma.employmentStatus.findUnique({
            where: { id: employmentStatusId},
        })

        if(!employment_status) {
            throw new BadRequestException('Employee status does not exist.');
        }

        const updateEmpStat = await this.prisma.employmentStatus.update({
            where: { id: employmentStatusId},
            data: {
                code,
                label,
            },
        });
        
        return {
            status: 'success',
            message: 'Employment Status updated successfully.',
            data: {
                updateEmpStat
            },
        }
    }
}
