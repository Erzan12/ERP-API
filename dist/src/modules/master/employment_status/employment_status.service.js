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
exports.EmploymentStatusService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../config/prisma/prisma.service");
let EmploymentStatusService = class EmploymentStatusService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getEmployeeStats(user, dto) {
        const { search, sortBy, order, page, perPage } = dto;
        const skip = (page - 1) * perPage;
        const whereCondition = {};
        const stringFields = ['label', 'code'];
        if (search) {
            const orConditions = [];
            orConditions.push(...stringFields.map((field) => ({
                [field]: {
                    contains: search,
                    mode: 'insensitive',
                },
            })));
            whereCondition.OR = orConditions;
        }
        const allowSortFeilds = ['id', 'created_at', 'updated_at', 'code', 'label'];
        const safeSortBy = allowSortFeilds.includes(sortBy) ? sortBy : 'created_at';
        const [total, employmentStatus] = await this.prisma.$transaction([
            this.prisma.employmentStatus.count({
                where: {
                    ...whereCondition,
                },
            }),
            this.prisma.employmentStatus.findMany({
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
            message: 'Here are the list of Employment Status',
            count: total,
            page,
            perPage,
            employmentStatus,
        };
    }
    async getEmployeeStat(employeeStatusId, user) {
        const employeeStat = await this.prisma.employmentStatus.findUnique({
            where: { id: employeeStatusId },
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
        if (!employeeStat) {
            throw new common_1.BadRequestException('Employee status not found.');
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
            throw new common_1.ForbiddenException('User is not allowed to perform this action');
        }
        return {
            status: 'success',
            message: 'Here is the Employee Status',
            employeeStat,
        };
    }
    async createEmployeeStatus(empStatusDto, user) {
        const existingEmpStat = await this.prisma.employmentStatus.findUnique({
            where: { code: empStatusDto.code },
        });
        if (existingEmpStat) {
            throw new common_1.BadRequestException('Employee Status already exist');
        }
        const employeeStatus = await this.prisma.employmentStatus.create({
            data: {
                code: empStatusDto.code,
                label: empStatusDto.label,
                created_by: user.id,
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
        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPosition = requestUser.employee.position.name;
        return {
            status: 'success',
            mesage: 'Employment Status created successfully',
            employeeStatus,
            created_by_user: `${userName} - ${userPosition}`,
        };
    }
    async updateEmployeeStatus(employeeStatusId, updateEmployeeStatusDto, user) {
        const employment_status = await this.prisma.employmentStatus.findUnique({
            where: { id: employeeStatusId },
        });
        if (!employment_status) {
            throw new common_1.BadRequestException('Employee status does not exist.');
        }
        const updatedEmployeeStatus = await this.prisma.employmentStatus.update({
            where: { id: employeeStatusId },
            data: {
                code: updateEmployeeStatusDto.code ?? undefined,
                label: updateEmployeeStatusDto.label ?? undefined,
                updatedBy: {
                    connect: { id: user.id },
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
            throw new common_1.NotFoundException('User does not exist');
        }
        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPosition = requestUser.employee.position.name;
        const isAdmin = requestUser.user_roles.some((role) => role.role_name === 'Administrator');
        if (!isAdmin) {
            throw new common_1.ForbiddenException('User is not allowed to update User Location.');
        }
        return {
            status: 'success',
            message: 'Employment Status updated successfully.',
            updatedEmployeeStatus,
            updated_by_user: `${userName} - ${userPosition}`,
        };
    }
};
exports.EmploymentStatusService = EmploymentStatusService;
exports.EmploymentStatusService = EmploymentStatusService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmploymentStatusService);
//# sourceMappingURL=employment_status.service.js.map