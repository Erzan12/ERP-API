"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../config/prisma/prisma.service");
let RoleService = class RoleService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getRoles(user, dto) {
        const { search, sortBy, order, page, perPage } = dto;
        const skip = (page - 1) * perPage;
        const whereCondition = {
            is_active: true,
        };
        if (search) {
            const orConditions = [];
            orConditions.push({
                name: {
                    contains: search,
                    mode: 'insensitive',
                },
            });
            orConditions.push({
                description: {
                    contains: search,
                    mode: 'insensitive',
                },
            });
            whereCondition.OR = orConditions;
        }
        const allowSortFields = [
            'id',
            'name',
            'created_at',
            'updated_at',
            'isActive',
        ];
        const safeSortBy = allowSortFields.includes(sortBy) ? sortBy : 'created_at';
        const [total, roles] = await this.prisma.$transaction([
            this.prisma.role.count({
                where: {
                    ...whereCondition,
                },
            }),
            this.prisma.role.findMany({
                where: {
                    ...whereCondition,
                },
                include: {
                    createdBy: {
                        select: {
                            person: {
                                select: {
                                    first_name: true,
                                    middle_name: true,
                                    last_name: true,
                                },
                            },
                        },
                    },
                    updatedBy: {
                        select: {
                            person: {
                                select: {
                                    first_name: true,
                                    middle_name: true,
                                    last_name: true,
                                },
                            },
                        },
                    },
                },
                skip,
                take: perPage,
                orderBy: {
                    [safeSortBy]: order,
                },
            }),
        ]);
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
            throw new common_1.BadRequestException(`User does not exist.`);
        }
        const allowedRoles = ['Administrator', 'Super Administrator'];
        const canView = requestUser.user_roles.some((role) => allowedRoles.includes(role.role_name));
        if (!canView) {
            throw new common_1.ForbiddenException('You are not authorized to perform this action');
        }
        return {
            status: 'success',
            message: 'Here are the list of Roles',
            count: total,
            page,
            perPage,
            roles,
        };
    }
    async getRole(id, user) {
        const role = await this.prisma.role.findUnique({
            where: { id },
            include: {
                role_permissions: true,
                createdBy: {
                    select: {
                        person: {
                            select: {
                                first_name: true,
                                middle_name: true,
                                last_name: true,
                            },
                        },
                    },
                },
                updatedBy: {
                    select: {
                        person: {
                            select: {
                                first_name: true,
                                middle_name: true,
                                last_name: true,
                            },
                        },
                    },
                },
            },
        });
        if (!role) {
            throw new common_1.NotFoundException('Role does not exist');
        }
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
            throw new common_1.BadRequestException(`User does not exist.`);
        }
        const allowedRoles = ['Administrator', 'Super Administrator'];
        const canView = requestUser.user_roles.some((role) => allowedRoles.includes(role.role_name));
        if (!canView) {
            throw new common_1.ForbiddenException('You are not authorized to perform this action');
        }
        return {
            status: 'success',
            message: 'Here is the Role',
            data: {
                role,
            },
        };
    }
    async createRole(createRoleDto, user) {
        const { name, description } = createRoleDto;
        const existingRole = await this.prisma.role.findUnique({
            where: { name: createRoleDto.name },
        });
        if (existingRole) {
            throw new common_1.BadRequestException('Role already exist! Try again');
        }
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
            throw new common_1.BadRequestException(`User does not exist.`);
        }
        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPosition = requestUser.employee.position.name;
        const role = await this.prisma.role.create({
            data: {
                name,
                description,
                created_by: user.id,
            },
        });
        return {
            status: 'success',
            message: `Role have been successfully created!`,
            role,
            created_by_user: `${userName} - ${userPosition}`,
        };
    }
    async updateRole(dto, user, roleId) {
        const existingRole = await this.prisma.role.findUnique({
            where: { id: roleId },
        });
        if (!existingRole) {
            throw new common_1.BadRequestException('Role does not exist!');
        }
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
            throw new common_1.BadRequestException(`User does not exist.`);
        }
        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPosition = requestUser.employee.position.name;
        const role = await this.prisma.role.update({
            where: { id: roleId },
            data: {
                name: dto.name ?? undefined,
                description: dto.description ?? undefined,
                updated_by: user.id,
            },
        });
        return {
            status: 'success',
            message: `Role have been successfully created!`,
            role,
            updated_by_user: `${userName} - ${userPosition}`,
        };
    }
    async createRolePermissions(createRolePermissionDto, user) {
        const { action, sub_module_id, role_id, department_id, position_id } = createRolePermissionDto;
        const existingRole = await this.prisma.role.findFirst({
            where: { id: role_id },
        });
        if (!existingRole) {
            throw new common_1.BadRequestException('Role not found or does not exist!');
        }
        const validSubModuleActions = await this.prisma.subModulePermission.findMany({
            where: { sub_module_id },
        });
        const validActions = validSubModuleActions.map((perm) => perm.action);
        const invalidActions = action.filter((act) => !validActions.includes(act));
        if (invalidActions.length > 0) {
            throw new common_1.BadRequestException(`Invalid action(s) for this sub module: ${invalidActions.join(', ')}`);
        }
        const subModulePermissionMap = new Map(validSubModuleActions.map((perm) => [perm.action, perm.id]));
        const createRolePermission = action.map((act) => ({
            action: act,
            sub_module_id,
            role_id,
            role_name: existingRole.name,
            sub_module_permission_id: subModulePermissionMap.get(act),
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
            throw new common_1.BadRequestException('Role Permission does not exist');
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
            throw new common_1.BadRequestException(`User does not exist.`);
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
    async updateRolePermissions(id, updateRolePermissionsDto, user) {
        const { action_updates = [] } = updateRolePermissionsDto;
        const existingRole = await this.prisma.role.findUnique({
            where: { id },
            include: {
                role_permissions: true,
            },
        });
        if (!existingRole) {
            throw new common_1.BadRequestException('Role does not exist!');
        }
        if (existingRole.role_permissions.length === 0) {
            throw new common_1.BadRequestException('This role has no existing role to update');
        }
        const toUpdate = existingRole.role_permissions.filter((perm) => action_updates.some((update) => update.currentAction === perm.action));
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
            throw new common_1.BadRequestException(`User does not exist.`);
        }
        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPos = requestUser.employee.position.name;
        const results = await Promise.all(toUpdate.map((perm) => {
            const updateData = action_updates.find((u) => u.currentAction === perm.action);
            if (!updateData) {
                throw new common_1.ForbiddenException('Updating action failed');
            }
            return this.prisma.rolePermission.update({
                where: { id: perm.id },
                data: {
                    action: updateData.newAction,
                },
            });
        }));
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
};
exports.RoleService = RoleService;
exports.RoleService = RoleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RoleService);
//# sourceMappingURL=role.service.js.map