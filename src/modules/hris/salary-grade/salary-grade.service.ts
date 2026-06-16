import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { CreateSalaryGradeDto } from './dto/salary-grade.dto';

@Injectable()
export class SalaryGradeService {

    constructor (private readonly prisma:PrismaService) {}

    async getSalaryGrades(user: RequestUser) {
        // Auth check first
        const requestUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: {
                employee: {
                include: {
                    person: true,
                    position: true,
                },
                },
                user_roles: true,
            },
        });

        if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
            throw new BadRequestException(`User does not exist.`);
        }
    
        const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
        const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));
    
        if (!canView) {
            throw new ForbiddenException('You are not authorized to perform this action');
        }

        const salaryGrades = await this.prisma.salaryGrade.findMany({
            where: { is_active: true }
        })

        if (salaryGrades.length === 0) {
            throw new NotFoundException("No salary grades found!");
        } 

        return {
            status: 'success',
            message: 'List of Salary Grades',
            salaryGrades
        }
    }

    async createSalaryGrade(user: RequestUser, dto: CreateSalaryGradeDto) {
        const { grade, rate, level, is_confidential } = dto;

        // Auth check first
        const requestUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: {
                employee: {
                include: {
                    person: true,
                    position: true,
                },
                },
                user_roles: true,
            },
        });

        if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
            throw new BadRequestException(`User does not exist.`);
        }
    
        const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
        const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));
    
        if (!canView) {
            throw new ForbiddenException('You are not authorized to perform this action');
        }

        const existingGrade = await this.prisma.salaryGrade.findFirst({
            where: { grade: dto.grade }
        })

        if (existingGrade) {
            throw new ConflictException("Salary Grade already exist!");
        }

        const salaryGrade = await this.prisma.salaryGrade.create({
            data: {
                grade,
                rate,
                level,
                is_confidential,
                created_by: user.id
            }
        })

        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPosition = requestUser.employee.position.name;

        return {
            status: 'success',
            message: 'Salary Grade added successfully',
            salaryGrade,
            created_by: `${userName} - ${userPosition}`
        }
    }
}
