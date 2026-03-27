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
exports.PermissionTemplateService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../config/prisma/prisma.service");
let PermissionTemplateService = class PermissionTemplateService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPermissionTemplates(user) {
        const existingPermTemplate = await this.prisma.permissionTemplate.findMany();
        if (existingPermTemplate.length === 0) {
            throw new common_1.BadRequestException('No available permission templates available');
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
        const allowedRoles = [
            'Administrator',
            'Super Administrator',
            'HR Manager',
            'HR Clerk',
            'HR Staff',
        ];
        const canView = requestUser.user_roles.some((role) => allowedRoles.includes(role.role_name));
        if (!canView) {
            throw new common_1.ForbiddenException('You are not authorized to perform this action');
        }
        return {
            status: 'success',
            message: 'Here are the list of Permission Templates',
            data: {
                existingPermTemplate,
            },
        };
    }
    async getPermissionTemplate(id, user) {
        const permissionTemplate = await this.prisma.permissionTemplate.findUnique({
            where: { id },
        });
        if (!permissionTemplate) {
            throw new common_1.BadRequestException('Permission Template not found.');
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
        const allowedRoles = [
            'Administrator',
            'Super Administrator',
            'HR Manager',
            'HR Clerk',
            'HR Staff',
        ];
        const canView = requestUser.user_roles.some((role) => allowedRoles.includes(role.role_name));
        if (!canView) {
            throw new common_1.ForbiddenException('You are not authorized to perform this action');
        }
        return {
            status: 'success',
            message: 'Here is the Permission Template',
            data: {
                permissionTemplate,
            },
        };
    }
    async createPermissionTemplate(dto, user) {
        return this.prisma.$transaction(async (tx) => {
            const { name, department_id, position_id, role_permission_ids } = dto;
            const existing = await tx.permissionTemplate.findFirst({
                where: { name },
            });
            if (existing) {
                throw new common_1.BadRequestException('Permission template already exists');
            }
            const template = await tx.permissionTemplate.create({
                data: {
                    name,
                    department_id,
                },
            });
            const ptDept = await tx.permissionTemplateDepartment.create({
                data: {
                    permission_template_id: template.id,
                    user_id: user.id,
                    department_id,
                    position_id,
                },
            });
            const rolePermissions = await tx.rolePermission.findMany({
                where: {
                    id: { in: role_permission_ids },
                    department_id,
                    ...(position_id && { position_id }),
                },
            });
            for (const rp of rolePermissions) {
                await tx.permissionTemplateRolePermission.create({
                    data: {
                        permission_template_id: template.id,
                        role_permission_id: rp.id,
                        permission_template_department_id: ptDept.id,
                    },
                });
            }
            return {
                message: 'Permission template created',
                template_id: template.id,
                name: template.name,
            };
        });
    }
    async updatePermissionTemplate(permissionTemplateId, dto, user) {
        return this.prisma.$transaction(async (tx) => {
            const { name, department_id, position_id, role_permission_ids } = dto;
            const existing = await tx.permissionTemplate.findUnique({
                where: { id: permissionTemplateId },
                include: {
                    departments: true,
                    role_permissions: true,
                },
            });
            if (!existing) {
                throw new common_1.BadRequestException('Permission template does not exist');
            }
            if (name && name !== existing.name) {
                const duplicate = await tx.permissionTemplate.findFirst({
                    where: { name, NOT: { id: permissionTemplateId } },
                });
                if (duplicate) {
                    throw new common_1.BadRequestException('Permission template name already exists');
                }
            }
            const updatedTemplate = await tx.permissionTemplate.update({
                where: { id: permissionTemplateId },
                data: {
                    name,
                    department_id,
                },
            });
            await tx.permissionTemplateDepartment.deleteMany({
                where: { permission_template_id: permissionTemplateId },
            });
            const departmentIdToUse = department_id ?? existing.departments[0]?.department_id;
            const positionIdToUse = position_id ?? existing.departments[0]?.position_id;
            const ptDept = await tx.permissionTemplateDepartment.create({
                data: {
                    permission_template_id: permissionTemplateId,
                    department_id: departmentIdToUse,
                    position_id: positionIdToUse,
                    user_id: user.id,
                },
            });
            await tx.permissionTemplateRolePermission.deleteMany({
                where: {
                    permission_template_id: permissionTemplateId,
                },
            });
            const rolePermissions = await tx.rolePermission.findMany({
                where: {
                    id: { in: role_permission_ids },
                    department_id,
                    ...(position_id && { position_id }),
                },
            });
            for (const rp of rolePermissions) {
                await tx.permissionTemplateRolePermission.create({
                    data: {
                        permission_template_id: permissionTemplateId,
                        role_permission_id: rp.id,
                        permission_template_department_id: ptDept.id,
                    },
                });
            }
            return {
                message: 'Permission template updated',
                template_id: updatedTemplate.id,
                name: updatedTemplate.name,
            };
        });
    }
    async assignTemplateToUser(dto, user) {
        const { user_id, template_id } = dto;
        return this.prisma.$transaction(async (tx) => {
            const existingUser = await tx.user.findUnique({
                where: { id: user_id },
                include: {
                    employee: {
                        select: {
                            department_id: true,
                            position_id: true,
                        },
                    },
                    PermissionTemplateDepartment: true,
                    user_roles: true,
                },
            });
            if (!existingUser || !existingUser.employee) {
                throw new common_1.BadRequestException('User or employee not found');
            }
            const templateDept = await tx.permissionTemplateDepartment.findFirst({
                where: {
                    permission_template_id: template_id,
                    department_id: existingUser.employee.department_id,
                    OR: [
                        { position_id: existingUser.employee.position_id },
                        { position_id: null },
                    ],
                },
                include: {
                    permission_template_role_permissions: {
                        include: { role_permissions: true },
                    },
                },
            });
            if (!templateDept) {
                throw new common_1.BadRequestException('Template not valid for this department or position');
            }
            const userRolesMap = new Map();
            for (const ptrp of templateDept.permission_template_role_permissions) {
                const rp = ptrp.role_permissions;
                const key = `${rp.role_id}-${rp.sub_module_id}`;
                let userRole = userRolesMap.get(key);
                if (!userRole) {
                    const existing = await tx.userRole.findFirst({
                        where: {
                            user_id: user.id,
                            role_id: rp.role_id,
                        },
                        include: { role: true },
                    });
                    if (existing) {
                        userRole = existing;
                    }
                    else {
                        userRole = await tx.userRole.create({
                            data: {
                                user_id: user.id,
                                role_id: rp.role_id,
                                role_name: rp.role_name,
                                created_at: new Date(),
                            },
                            include: {
                                role: true,
                            },
                        });
                    }
                    userRolesMap.set(key, userRole);
                }
                const existingPermission = await tx.userPermission.findFirst({
                    where: {
                        user_id: user.id,
                        user_role_id: userRole.id,
                        role_permission_id: rp.id,
                    },
                });
                if (!existingPermission) {
                    await tx.userPermission.create({
                        data: {
                            user_id: user.id,
                            user_role_id: userRole.id,
                            role_permission_id: rp.id,
                            action: rp.action,
                        },
                    });
                }
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
            if (!requestUser ||
                !requestUser.employee ||
                !requestUser.employee.person) {
                throw new common_1.BadRequestException(`User does not exist.`);
            }
            const isAdmin = requestUser.user_roles.some((role) => role.role_name === 'Administrator' ||
                role.role_name === 'Super Administrator');
            if (!isAdmin) {
                throw new common_1.ForbiddenException('You are not allowed to perform this action');
            }
            return {
                message: `Permissions from template '${template_id}' assigned to user`,
            };
        });
    }
    async getUserPermissionTemplate(userPermissionTemplateId, user) {
        const userWithEmployee = await this.prisma.user.findUnique({
            where: { id: userPermissionTemplateId },
            include: {
                employee: true,
            },
        });
        if (!userWithEmployee || !userWithEmployee.employee) {
            throw new common_1.BadRequestException('User or employee not found');
        }
        const { department_id, position_id } = userWithEmployee.employee;
        if (!department_id && !position_id) {
            throw new common_1.BadRequestException('User has no department or position assigned');
        }
        const userPermissionTemplate = await this.prisma.permissionTemplate.findMany({
            where: {
                department_id,
                departments: {
                    some: {
                        department_id,
                        OR: [{ position_id }, { position_id: null }],
                    },
                },
            },
            include: {
                departments: true,
                role_permissions: {
                    include: {
                        role_permissions: true,
                    },
                },
            },
        });
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
        const isAdmin = requestUser.user_roles.some((role) => role.role_name === 'Administrator' || 'Super Administrator');
        if (!isAdmin) {
            throw new common_1.ForbiddenException('You are not allowed to perform this action');
        }
        return {
            status: 'success',
            message: 'Here is the Users Permission Template.',
            userPermissionTemplate,
        };
    }
};
exports.PermissionTemplateService = PermissionTemplateService;
exports.PermissionTemplateService = PermissionTemplateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PermissionTemplateService);
//# sourceMappingURL=permission_template.service.js.map