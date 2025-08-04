import { BadRequestException, Injectable } from '@nestjs/common';
import { EmpStatusDto } from './dto/create-emp-stat.dto';
import { RequestUser } from '../../Components/types/request-user.interface';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateEmpStatusDto } from './dto/update-emp-stat.dto';

@Injectable()
export class EmploymentStatusService {
    constructor(private prisma: PrismaService) {}

    async getEmpStat (user: RequestUser) {
    const existingEmpStat = await this.prisma.employmentStatus.findMany()

    const formattedEmpStat = existingEmpStat.map(employmentStatus => ({
        emp_stat_id: employmentStatus.id,
        code: employmentStatus.code,
        label: employmentStatus.label,
    }))

    return formattedEmpStat;
    }

    async createEmpStat (empStatusDto: EmpStatusDto, user: RequestUser) {
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

    async updateEmpStat (updateEmpStatusDto: UpdateEmpStatusDto, user: RequestUser) {
        const { emp_stat_id, code, label } = updateEmpStatusDto;
        
        const exisitingEmptStat = await this.prisma.employmentStatus.findUnique({
            where: { id: updateEmpStatusDto.emp_stat_id }
        });

        if(!exisitingEmptStat) {
            throw new BadRequestException('Employee status does not exist');
        }

        const updateEmpStat = await this.prisma.employmentStatus.update({
            where: { id: updateEmpStatusDto.emp_stat_id },
            data: {
                id: emp_stat_id,
                code,
                label,
            },
        });
        
        return {
            status: 'success',
            message: 'Employee Status updated successfully',
            data: {
                updateEmpStat
            },
        }
    }
}
