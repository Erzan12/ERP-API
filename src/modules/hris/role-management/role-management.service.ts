import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { RoleService } from 'src/modules/administrator/role/role.service';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permisisons.dto';

@Injectable()
export class RoleManagementService {
    constructor (
        private readonly prisma: PrismaService,
    ) {}

    //Add Get Role -> to query the roles available
    async getRoles(user: RequestUser) {
        const existingRoles = await this.prisma.role.findMany({
            where: { stat: 1 },
            include: {
            role_permissions: true,
            },
        });

        if (existingRoles.length === 0) {
            throw new BadRequestException('No available or active roles exist!');
        }

        return {
            status: 'success',
            message: 'Here are the list of Roles',
            data: {
            existingRoles,
            },
        };
    }

    async getRole(roleId: string, user: RequestUser) {
        const role = await this.prisma.role.findUnique({
            where: { id: roleId },
            include: {
            role_permissions: true,
            },
        });

        if (!role) {
            throw new NotFoundException('Role does not exist');
        }

        return {
            status: 'success',
            message: 'Here is the Role',
            role,
        };
    }

    async createRolePermissions(
        createRolePermissionDto: CreateRolePermissionDto,
        user: RequestUser,
        ) {
        const { action, sub_module_id, role_id, department_id, position_id } =
            createRolePermissionDto;

        const existingRole = await this.prisma.role.findFirst({
            where: { id: role_id },
        });

        if (!existingRole) {
            throw new BadRequestException('Role not found or does not exist!');
        }

        const validSubModuleActions =
            await this.prisma.subModulePermission.findMany({
            where: { sub_module_id },
            });

        const validActions = validSubModuleActions.map((perm) => perm.action);

        const invalidActions = action.filter((act) => !validActions.includes(act));

        if (invalidActions.length > 0) {
            throw new BadRequestException(
            `Invalid action(s) for this sub module: ${invalidActions.join(', ')}`,
            );
        }

        // to map the role_name and sub_module_permission_id so it wont return null in prisma studio
        const subModulePermissionMap = new Map(
            validSubModuleActions.map((perm) => [perm.action, perm.id]),
        );

        const createRolePermission = action.map((act) => ({
            action: act,
            sub_module_id,
            role_id,
            role_name: existingRole.name,
            sub_module_permission_id: subModulePermissionMap.get(act)!, // ! to asset sub_mobule_permission id if it is always defined and cannot be null
            department_id,
            position_id,
        }));

        await this.prisma.rolePermission.createMany({
            data: createRolePermission,
            skipDuplicates: true,
        });

        const rolePermission = await this.prisma.role.findFirst({
            where: { id: role_id },
        });

        if (!rolePermission) {
            throw new BadRequestException('Role Permission does not exist');
        }

        const requestUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: {
            employee: {
                include: {
                person: true,
                position: true,
                department: true,
                },
            },
            user_roles: true,
            },
        });

        if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
            throw new BadRequestException(`User does not exist.`);
        }

        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPos = requestUser.employee.position.name;
        const userRole = requestUser.user_roles.map((r) => r.role_name);

        return {
            status: 'success',
            message: `Added permissions to Role ${rolePermission?.name}`,
            created_by: {
            id: requestUser.id,
            name: userName,
            department: requestUser.employee.department,
            position: userPos,
            role: userRole,
            },
            role_id: rolePermission.id,
            role_name: rolePermission.name,
        };
    }

    async updateRolePermissions(
        id: string,
        updateRolePermissionsDto: UpdateRolePermissionsDto,
        user: RequestUser,
    ) {
        const { action_updates = [] } = updateRolePermissionsDto;

        const existingRole = await this.prisma.role.findUnique({
            where: { id },
            include: {
            role_permissions: true,
            },
        });

        if (!existingRole) {
            throw new BadRequestException('Role does not exist!');
        }

        if (existingRole.role_permissions.length === 0) {
            throw new BadRequestException('This role has no existing role to update');
        }

        const toUpdate = existingRole.role_permissions.filter((perm) =>
            action_updates.some((update) => update.currentAction === perm.action),
        );

        const requestUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: {
            employee: {
                include: {
                person: true,
                position: true,
                },
            },
            },
        });

        if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
            throw new BadRequestException(`User does not exist.`);
        }

        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPos = requestUser.employee.position.name;

        const results = await Promise.all(
            toUpdate.map((perm) => {
            const updateData = action_updates.find(
                (u) => u.currentAction === perm.action,
            );

            if (!updateData) {
                throw new ForbiddenException('Updating action failed');
            }

            return this.prisma.rolePermission.update({
                where: { id: perm.id },
                data: {
                action: updateData.newAction,
                },
            });
            }),
        );
        return {
            status: 'success',
            message: 'Role Permission successfully updated',
            updated_by: {
            id: requestUser.id,
            name: userName,
            position: userPos,
            },
            updated_data: {
            results,
            },
        };
    }
}
