import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { RequestUser } from 'src/utils/types/request-user.interface';

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
}
