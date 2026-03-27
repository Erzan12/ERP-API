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
exports.DepartmentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../config/prisma/prisma.service");
let DepartmentService = class DepartmentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDepartments(user, dto) {
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
                division: {
                    name: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
            });
            if (search === 'true' || search === 'false') {
                orConditions.push({
                    is_active: search === 'true',
                });
            }
            if (!isNaN(Number(search))) {
                orConditions.push({
                    sorting: Number(search),
                });
            }
            whereCondition.OR = orConditions;
        }
        const allowSortFeilds = [
            'id',
            'created_at',
            'updated_at',
            'name',
            'division_id',
            'sorting',
        ];
        const safeSortBy = allowSortFeilds.includes(sortBy) ? sortBy : 'created_at';
        const [total, departments] = await this.prisma.$transaction([
            this.prisma.department.count({
                where: {
                    ...whereCondition,
                },
            }),
            this.prisma.department.findMany({
                where: {
                    ...whereCondition,
                },
                include: {
                    division: {
                        select: {
                            id: true,
                            name: true,
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
            message: 'Here are the list of Departments.',
            count: total,
            page,
            perPage,
            departments,
        };
    }
    async getDepartment(departmentId, user) {
        const department = await this.prisma.department.findUnique({
            where: { id: departmentId },
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
        });
        if (!department) {
            throw new common_1.BadRequestException('Department not found or is inactive');
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
            throw new common_1.ForbiddenException('You are not allowed perform this action');
        }
        return {
            status: 'success',
            message: 'Here is the Department',
            department,
        };
    }
    async createDepartment(createDepartmentDto, user) {
        const existingDepartment = await this.prisma.department.findFirst({
            where: {
                name: createDepartmentDto.name,
                division_id: createDepartmentDto.division_id,
            },
        });
        if (existingDepartment) {
            throw new common_1.ConflictException('Department already exists!');
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
            throw new common_1.ForbiddenException('You are not allowed to create department');
        }
        const department = await this.prisma.department.create({
            data: {
                name: createDepartmentDto.name,
                division: {
                    connect: { id: createDepartmentDto.division_id },
                },
                createdBy: {
                    connect: { id: user.id },
                },
            },
        });
        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPosition = requestUser.employee.position.name;
        return {
            status: 'success',
            message: `${department.name} Department has been created successfully!`,
            department,
            created_by_user: `${userName} - ${userPosition}`,
        };
    }
    async updateDepartment(departmentId, updateDepartmentDto, user) {
        const department = await this.prisma.department.findUnique({
            where: { id: departmentId },
            select: {
                name: true,
                is_active: true,
            },
        });
        if (!department || department.is_active === false) {
            throw new common_1.BadRequestException('Department does not exist or is inactive!');
        }
        const updatedDepartment = await this.prisma.department.update({
            where: { id: departmentId },
            data: {
                name: updateDepartmentDto.name ?? undefined,
                sorting: updateDepartmentDto.sorting ?? undefined,
                division_id: updateDepartmentDto.division_id ?? undefined,
                is_active: updateDepartmentDto.is_active ?? undefined,
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
                user_roles: true,
            },
        });
        if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
            throw new common_1.BadRequestException(`User does not exist.`);
        }
        const isAdmin = requestUser.user_roles.some((role) => role.role_name === 'Administrator' || 'Super Administrator');
        if (!isAdmin) {
            throw new common_1.ForbiddenException('User is not allowed to update Department');
        }
        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPosition = requestUser.employee.position.name;
        return {
            status: 'success',
            message: `${updatedDepartment.name} Department has been updated successfully!`,
            updatedDepartment,
            updated_by_user: `${userName} - ${userPosition}`,
        };
    }
};
exports.DepartmentService = DepartmentService;
exports.DepartmentService = DepartmentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DepartmentService);
//# sourceMappingURL=department.service.js.map