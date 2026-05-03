import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { CreateLeaveCategory, UpdateLeaveCategory } from './dto/leave-category.dto';

@Injectable()
export class LeaveCategoryService {
    constructor(private readonly prisma: PrismaService) {}

    async getLeaveCategories (user: RequestUser) {
        // Auth check first
        const requestUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: { user_roles: true }
        });
    
        const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
        const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));
    
        if (!canView) {
            throw new ForbiddenException('You are not authorized to perform this action');
        }

        const leaveCategories = await this.prisma.hrLeaveCategory.findMany({
            where: { is_active: true }
        })

        if (leaveCategories.length === 0) {
            throw new NotFoundException ("No leave categories found")
        }

        return {
            status: 'success',
            message: 'List of Leave Categories',
            leaveCategories
        }
    }

    async getLeaveCategory (leaveCategoryId: string, user: RequestUser) {
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
    
        const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
        const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));
    
        if (!canView) {
            throw new ForbiddenException('You are not authorized to perform this action');
        }

        const leaveCategory = await this.prisma.hrLeaveCategory.findUnique({
            where: { id: leaveCategoryId, is_active: true }
        })

        if (!leaveCategory) {
            throw new NotFoundException('Leave Category does not exist')
        }

        return {
            status: 'success',
            message: 'Here is the Leave Category',
            leaveCategory
        }
    }

    async createLeaveCategory (user: RequestUser, dto: CreateLeaveCategory) {
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

        const existingCategory = await this.prisma.hrLeaveCategory.findFirst({
            where: { category_name: dto.category_name }
        })

        if (existingCategory) {
            throw new ConflictException('Leave Category already exist')
        }

        const leaveCategory = await this.prisma.hrLeaveCategory.create({
            data: {
                category_name: dto.category_name,
                created_by: user.id,
            }
        })

        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPosition = requestUser.employee.position.name;

        return {
            status: 'success',
            message: 'Leave Category created',
            leaveCategory,
            created_by: `${userName} - ${userPosition}`,
        }
    }

    async updateLeaveCategory (leaveCategoryId: string, user: RequestUser, dto: UpdateLeaveCategory) {
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
        
        const leaveCategory = await this.prisma.hrLeaveCategory.update({
            where: { id: leaveCategoryId },
            data: {
                category_name: dto.category_name ?? undefined,
                is_active: dto.is_active ?? undefined,
                updated_by: user.id
            }
        })

        if (!leaveCategory) {
            throw new NotFoundException ('Leave category does not exist')
        }

        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPosition = requestUser.employee.position.name;

        return {
            status: 'success',
            message: 'Leave Category updated',
            leaveCategory,
            updated_by_user: `${userName} - ${userPosition}`,
        }
    }
}
