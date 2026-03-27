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
exports.SubModuleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../config/prisma/prisma.service");
let SubModuleService = class SubModuleService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSubModules(user, dto) {
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
            whereCondition.OR = orConditions;
        }
        const allowSortFields = ['name', 'module_id', 'created_at', 'updated_at'];
        const safeSortBy = allowSortFields.includes(sortBy) ? sortBy : 'created_at';
        const [total, subModules] = await this.prisma.$transaction([
            this.prisma.subModule.count({
                where: {
                    ...whereCondition,
                },
            }),
            this.prisma.subModule.findMany({
                where: {
                    ...whereCondition,
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
            message: 'Here are the list of Sub Modules',
            count: total,
            page,
            perPage,
            subModules,
        };
    }
    async getSubmodule(subModuleId, user) {
        const subModule = await this.prisma.subModule.findUnique({
            where: { id: subModuleId },
            include: {
                module: true,
                role_permission: true,
                sub_module_permissions: true,
            },
        });
        if (!subModule) {
            throw new common_1.NotFoundException('Submodule not found');
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
        const isAdmin = requestUser.user_roles.some((role) => role.role_name === 'Administrator' || 'Super Administrator');
        if (!isAdmin) {
            throw new common_1.ForbiddenException('You are not allowed to perform this action');
        }
        return {
            status: 'success',
            message: 'Here is the Submodule',
            data: {
                subModule,
            },
        };
    }
    async createSubModule(createSubModuleDto, user) {
        const findModule = await this.prisma.module.findUnique({
            where: { id: createSubModuleDto.module_id },
        });
        if (!findModule) {
            throw new common_1.BadRequestException('Module not found!');
        }
        const subModule = await this.prisma.subModule.create({
            data: {
                name: createSubModuleDto.name,
                module_id: createSubModuleDto.module_id,
            },
            include: {
                module: true,
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
            },
        });
        if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
            throw new common_1.BadRequestException(`User does not exist.`);
        }
        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPos = requestUser.employee.position.name;
        return {
            status: 'success',
            message: `Sub Module ${subModule.name} for Module ${subModule.module.name} has been added`,
            created_by: {
                id: requestUser.id,
                name: userName,
                position: userPos,
            },
            subModule_id: subModule.id,
            subModule_name: subModule.name,
        };
    }
    async getSubModuleActions(user) {
        const modules = await this.prisma.subModuleAction.findMany();
        if (modules.length === 0) {
            throw new common_1.NotFoundException('No Submodule actions yet available or added');
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
        const isAdmin = requestUser.user_roles.some((role) => role.role_name === 'Administrator' || 'Super Administrator');
        if (!isAdmin) {
            throw new common_1.ForbiddenException('You are not allowed to perform this action');
        }
        return {
            status: 'success',
            message: 'Here is the list of Submodule Actions available',
            modules,
        };
    }
    async addSubModuleAction(dto, user) {
        const { action } = dto;
        const permissionsToCreate = action.map((act) => ({
            action: act,
        }));
        const subModuleAction = await this.prisma.subModuleAction.createMany({
            data: permissionsToCreate,
            skipDuplicates: true,
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
            },
        });
        if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
            throw new common_1.BadRequestException(`User does not exist.`);
        }
        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPos = requestUser.employee.position.name;
        return {
            status: 'success',
            message: `Added ${subModuleAction.count} new permission(s).`,
            created_by: {
                id: requestUser.id,
                name: userName,
                position: userPos,
            },
            count: subModuleAction.count,
            actions_added: action,
        };
    }
    async updateSubModuleAction(dto, user, subModulePermissionId) {
        const { action, is_active } = dto;
        const existingSubModulePermission = await this.prisma.subModuleAction.findFirst({
            where: { id: subModulePermissionId },
        });
        if (!existingSubModulePermission) {
            throw new common_1.NotFoundException('Sub Module permission does not exist!');
        }
        const updateSubModulePermission = await this.prisma.subModuleAction.update({
            where: { id: subModulePermissionId },
            data: {
                id: existingSubModulePermission.id,
                action,
                is_active,
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
            },
        });
        if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
            throw new common_1.BadRequestException(`User does not exist.`);
        }
        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPos = requestUser.employee.position.name;
        return {
            status: 'success',
            message: `${existingSubModulePermission.action} action has been updated successfully!`,
            updated_by: {
                id: requestUser.id,
                name: userName,
                position: userPos,
            },
            data: {
                updateSubModulePermission,
            },
        };
    }
    async assignSubModulePermissions(dto, user) {
        const { action, sub_module_id } = dto;
        const subModule = await this.prisma.subModule.findFirst({
            where: { id: sub_module_id },
            include: {
                module: true,
            },
        });
        if (!subModule) {
            throw new common_1.NotFoundException('Sub Module does not exist!');
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
        const userPos = requestUser.employee.position.name;
        const availablePermissions = await this.prisma.subModuleAction.findMany({
            where: {
                action: {
                    in: action,
                },
                is_active: true,
            },
        });
        if (availablePermissions.length === 0) {
            throw new common_1.BadRequestException('No matching active permissions found.');
        }
        const subModulePermissionsToCreate = availablePermissions.map((perm) => ({
            sub_module_id,
            sub_module_action_id: perm.id,
            action: perm.action,
        }));
        const result = await this.prisma.subModulePermission.createMany({
            data: subModulePermissionsToCreate,
            skipDuplicates: true,
        });
        return {
            status: 'success',
            message: `Added permissions to Sub Module ${subModule.name}`,
            created_by: {
                id: requestUser.id,
                name: userName,
                position: userPos,
            },
            data: {
                result,
            },
        };
    }
};
exports.SubModuleService = SubModuleService;
exports.SubModuleService = SubModuleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubModuleService);
//# sourceMappingURL=sub_module.service.js.map