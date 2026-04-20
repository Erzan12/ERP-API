import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { CreatePerformanceCompetencyDto } from './dto/performance_comtency.dto';

@Injectable()
export class PerformanceCompetencyService {
    constructor(private readonly prisma: PrismaService) {} 

    async getCompetencies(user: RequestUser) {
        // Authorization Check
        const requestUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: { user_roles: true, employee: true }
        });

        const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
        const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));

        if (!canView) {
            throw new ForbiddenException('You are not authorized to perform this action');
        }

        const competencies = await this.prisma.hrPerformanceCompetency.findMany()
    
        if (competencies.length === 0) {
            throw new NotFoundException('No Performance competencies currently available or added')
        }

        return {
            status: 'success',
            message: 'List of Performance Competencies',
            competencies
        }
    }

    async createCompetencies(user: RequestUser, dto: CreatePerformanceCompetencyDto) {
        const { department_group, sea_category, land_category, title, description, highest_score_limit, performanceRating } = dto;

        // Authorization Check
        const requestUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: { user_roles: true, employee: true }
        });

        const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
        const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));

        if (!canView) {
            throw new ForbiddenException('You are not authorized to perform this action');
        }

        const competency = await this.prisma.hrPerformanceCompetency.create({
            data: {
                department_group: department_group,
                sea_category: sea_category && undefined,
                land_category: land_category && undefined,
                title: title,
                description: description,
                highest_score_limit: highest_score_limit,
                performanceRating: performanceRating,
            }
        })

        return {
            status: 'success',
            message: 'Performance Competency created successfully',
            competency
        }
    }


}
