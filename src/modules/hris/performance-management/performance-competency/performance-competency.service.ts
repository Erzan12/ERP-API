import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { CreatePerformanceCompetencyDto, UpdatePerformanceCompetencyDto } from './dto/performance-competency.dto';

@Injectable()
export class PerformanceCompetencyService {
    constructor(private readonly prisma: PrismaService) {} 

    async getCompetencies(user: RequestUser) {
        // Authorization Check
        const requestUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: { user_roles: true, employee: true }
        });

        if (!requestUser || !requestUser.employee) {
            throw new BadRequestException(`User does not exist.`);
        }

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

    async getCompetency(user: RequestUser, competencyId: string ) {

        // Authorization Check
        const requestUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: { user_roles: true, employee: true }
        });

        if (!requestUser || !requestUser.employee) {
            throw new BadRequestException(`User does not exist.`);
        }

        const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
        const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));

        if (!canView) {
            throw new ForbiddenException('You are not authorized to perform this action');
        }

        const competency = await this.prisma.hrPerformanceCompetency.findUnique({
            where: { id: competencyId }
        })

        return {
            status: 'success',
            message: 'Here is the Performance Comptency',
            competency
        }
    }

    async createCompetencies(user: RequestUser, dto: CreatePerformanceCompetencyDto) {
        const { department_group, sea_category, land_category, title, description, highest_score_limit } = dto;

        // Authorization Check
        const requestUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: { user_roles: true, employee: true }
        });

        if (!requestUser || !requestUser.employee) {
            throw new BadRequestException(`User does not exist.`);
        }

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
            }
        })

        return {
            status: 'success',
            message: 'Performance Competency created successfully',
            competency
        }
    }

    async updateCompetency(competencyId: string, user: RequestUser, dto: UpdatePerformanceCompetencyDto) {
        // Authorization Check
        const requestUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: { 
                user_roles: true,
                employee: { 
                    include: { 
                        person: true, 
                        position: true 
                    } 
                } 
            }
        });

        if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
            throw new BadRequestException(`User does not exist.`);
        }

        const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
        const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));

        if (!canView) {
            throw new ForbiddenException('You are not authorized to perform this action');
        }

        const existingCompetency = await this.prisma.hrPerformanceCompetency.findUnique({
            where: { id: competencyId }
        });

        if (!existingCompetency) {
            throw new NotFoundException('Competency not found');
        }

        const competency = await this.prisma.hrPerformanceCompetency.update({
            where: { id: competencyId },
            data: {
                department_group: dto.department_group ?? undefined,
                sea_category: dto.sea_category ?? undefined,
                land_category: dto.land_category ?? undefined,
                title: dto.title ?? undefined,
                description: dto.description ?? undefined,
                highest_score_limit: dto.highest_score_limit ?? undefined,
            },
        });

        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPosition = requestUser.employee.position.name;

        return {
            status: 'success',
            message: `Performance Competency has been updated successfully!`,
            competency,
            updated_by_user: `${userName} - ${userPosition}`,
        }
    }
}
