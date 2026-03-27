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
exports.ModuleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../config/prisma/prisma.service");
let ModuleService = class ModuleService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createModule(createModuleDto, user) {
        const existingModule = await this.prisma.module.findFirst({
            where: {
                name: createModuleDto.name,
            },
        });
        if (existingModule) {
            throw new common_1.BadRequestException('Module already exists!');
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
            throw new common_1.ForbiddenException('You are not allowed to perform this action');
        }
        const module = await this.prisma.module.create({
            data: {
                name: createModuleDto.name,
                createdBy: {
                    connect: { id: user.id },
                },
            },
        });
        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPosition = requestUser.employee.position.name;
        return {
            status: 'success',
            message: `New module has been added to the system!`,
            module,
            created_by_user: `${userName} - ${userPosition}`,
        };
    }
    async getModule(user, moduleId) {
        const subModules = await this.prisma.subModule.findMany();
        if (subModules.length === 0) {
            throw new common_1.NotFoundException('No available submodules for this module');
        }
        const module = await this.prisma.module.findUnique({
            where: { id: moduleId },
            include: {
                sub_module: {
                    select: {
                        id: true,
                        name: true,
                        is_active: true,
                    },
                },
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
        if (!module) {
            throw new common_1.NotFoundException('Module does not exist');
        }
        return {
            status: 'success',
            message: 'Here is the module with its submodule',
            data: {
                module,
            },
        };
    }
    async getModules(user, dto) {
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
            if (search === 'true' || search === 'false') {
                orConditions.push({
                    is_active: search === 'true',
                });
            }
            whereCondition.OR = orConditions;
        }
        const allowSortFeilds = ['name', 'created_at', 'updated_at', 'isActive'];
        const safeSortBy = allowSortFeilds.includes(sortBy) ? sortBy : 'created_at';
        const [total, modules] = await this.prisma.$transaction([
            this.prisma.module.count({
                where: {
                    ...whereCondition,
                },
            }),
            this.prisma.module.findMany({
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
                    sub_module: {
                        select: {
                            id: true,
                            name: true,
                            is_active: true,
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
            message: 'Here are the list of Sub Modules',
            count: total,
            page,
            perPage,
            modules,
        };
    }
    async updateModude(updateModuleDto, user, id) {
        const existingModule = await this.prisma.module.findUnique({
            where: { id },
            select: {
                name: true,
            },
        });
        if (!existingModule) {
            throw new common_1.NotFoundException(`${existingModule} Module does not exist or inactive!`);
        }
        const updatedModule = await this.prisma.module.update({
            where: { id },
            data: {
                name: updateModuleDto.name,
                updated_by: user.id,
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
        const userPosition = requestUser.employee.position.name;
        return {
            status: 'success',
            message: `Module has been updated successfully!`,
            updatedModule,
            updated_by_user: `${userName} - ${userPosition}`,
        };
    }
};
exports.ModuleService = ModuleService;
exports.ModuleService = ModuleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ModuleService);
//# sourceMappingURL=module.service.js.map