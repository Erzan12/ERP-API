import { BadRequestException, ConflictException, UnauthorizedException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateModuleDto } from './module/dto/create-module.dto';
import { CreateSubModuleDto } from './sub_module/dto/create-sub-module.dto';
import { CreateSubModulePermissionDto } from '../Administrator/sub_module/dto/create-sub-module-permission.dto'
import { CreatePermissionTemplateDto } from './role/dto/create-permission-template.dto';
import { CreateRoleDto } from './role/dto/create-role.dto';
import { CreateRolePermissionDto } from './role/dto/create-role-permission.dto';
import { UpdateRolePermissionsDto } from './role/dto/update-role-permisisons.dto';
import { UserRole } from '../Components/decorators/ability';
import { AddPermissionToExistingUserDto } from './role/dto/add-permission-template.dto';
import { RequestUser } from '../Components/types/request-user.interface';

@Injectable()
export class AdministratorService {
    constructor (private prisma: PrismaService) {}
    
    async getAdminDashboardStats(user: RequestUser) {
        const totalUsers = await this.prisma.user.count();
        const activeUsers = await this.prisma.user.count({ where: { is_active: true }});
        const inActiceUsers = await this.prisma.user.count({ where: { is_active: false}});
        
        const roles = await this.prisma.role.findMany({
            include: {
                _count: {
                    select: { users: true },
                },
            },
        });

        const rolesSummary = roles.map(role => ({
            role: role.name,
            total_users: role._count.users,
        }));

        const onlineUsers = await this.prisma.user.findMany({
            where: {
                last_login: {
                    gte: new Date(Date.now() - 1000 * 60 * 5), //last 5 minutes
                },
            },
            select: {
                id: true,
                username: true,
                last_login: true,
            },
        });

        return {
            status: 'success',
            message: 'Welcome to Administrator Dashboard',
            data: {
                total_users: totalUsers,
                active_users: activeUsers,
                inactive_users: inActiceUsers,
                classification_by_roles: rolesSummary,
                online_users: onlineUsers,
            },
        };
    }
    
}