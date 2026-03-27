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
exports.CareerPostingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../config/prisma/prisma.service");
let CareerPostingService = class CareerPostingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCareerPosting(recruitmentId, user) {
        const recruitment = await this.prisma.careerPosting.findUnique({
            where: { id: recruitmentId },
            include: {
                department: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                position: {
                    select: {
                        id: true,
                        name: true,
                        job_description: true,
                    },
                },
                user_location: {
                    select: {
                        id: true,
                        location_name: true,
                        city: true,
                        province: true,
                        country: true,
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
        if (!recruitment) {
            throw new common_1.NotFoundException('Career Posting not found');
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
            message: 'Here is the Career/Job Posting',
            recruitment,
        };
    }
    async getCareerPostings(user, dto) {
        const { search, status, is_active, sortBy, order, page, perPage } = dto;
        const skip = (page - 1) * perPage;
        const whereCondition = {
            ...(is_active !== undefined && { is_active }),
            ...(status && {
                status: status,
            }),
        };
        const positionFields = ['name'];
        const departmentFields = ['name'];
        const userLocationFields = ['location_name'];
        let whereConditions = {};
        if (search) {
            whereConditions = {
                OR: [
                    ...positionFields.map((field) => ({
                        position: {
                            [field]: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                    })),
                    ...departmentFields.map((field) => ({
                        department: {
                            [field]: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                    })),
                    ...userLocationFields.map((field) => ({
                        user_location: {
                            [field]: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                    })),
                    {
                        employment_type: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        employee_type: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                ],
            };
        }
        const allowSortFields = [
            'position_id',
            'slots',
            'department_id',
            'user_location_id',
            'employment_type',
            'employee_type',
            'created_at',
            'updated_at',
        ];
        const safeSortBy = allowSortFields.includes(sortBy) ? sortBy : 'created_at';
        const [total, recruitments] = await this.prisma.$transaction([
            this.prisma.careerPosting.count({
                where: {
                    ...whereCondition,
                    ...whereConditions,
                },
            }),
            this.prisma.careerPosting.findMany({
                where: {
                    ...whereCondition,
                    ...whereConditions,
                },
                select: {
                    id: true,
                    position: {
                        select: {
                            id: true,
                            name: true,
                            job_description: true,
                        },
                    },
                    slots: true,
                    job_description: true,
                    department: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    user_location: {
                        select: {
                            id: true,
                            location_name: true,
                            city: true,
                            province: true,
                            country: true,
                        },
                    },
                    isPublished: true,
                    published_on: true,
                    employment_type: true,
                    employee_type: true,
                    status: true,
                    is_active: true,
                    created_at: true,
                    updated_at: true,
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
            message: 'List of Career Posting',
            count: total,
            page,
            perPage,
            recruitments,
        };
    }
    async createCareerPosting(createCareerPosting, user) {
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
            throw new common_1.ForbiddenException('You are not allowed to perform this action');
        }
        const posting = await this.prisma.position.findUnique({
            where: {
                id: createCareerPosting.position_id,
            },
            select: {
                id: true,
                job_description: true,
            },
        });
        if (!posting) {
            throw new Error('Position not found');
        }
        const recruitment = await this.prisma.careerPosting.create({
            data: {
                position_id: createCareerPosting.position_id,
                slots: createCareerPosting.slots,
                created_by: user.id,
                department_id: createCareerPosting.department_id,
                employee_type: createCareerPosting.employee_type,
                employment_type: createCareerPosting.employment_type,
                user_location_id: createCareerPosting.user_location_id,
            },
        });
        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPosition = requestUser.employee.position.name;
        return {
            status: 'success',
            message: `Career has been created successfully`,
            recruitment,
            created_by_user: `${userName} - ${userPosition}`,
        };
    }
    async updateCareerPosting(recruitmentId, updateCareerPostingDto, user) {
        const careerPosting = await this.prisma.careerPosting.findUnique({
            where: { id: recruitmentId },
        });
        if (!careerPosting) {
            throw new common_1.NotFoundException('Job/Career posting not found');
        }
        let publishDate = undefined;
        if (updateCareerPostingDto.isPublished === true &&
            !careerPosting.published_on) {
            publishDate = new Date();
        }
        const recruitment = await this.prisma.careerPosting.update({
            where: { id: recruitmentId },
            data: {
                position_id: updateCareerPostingDto.position_id ?? undefined,
                slots: updateCareerPostingDto.slots ?? undefined,
                job_description: updateCareerPostingDto.job_description ?? undefined,
                department_id: updateCareerPostingDto.department_id ?? undefined,
                user_location_id: updateCareerPostingDto.user_location_id ?? undefined,
                isPublished: updateCareerPostingDto.isPublished ?? undefined,
                published_on: publishDate,
                is_active: updateCareerPostingDto.is_active ?? undefined,
                employment_type: updateCareerPostingDto.employment_type ?? undefined,
                employee_type: updateCareerPostingDto.employee_type ?? undefined,
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
            message: `Job/Career posting has been updated successfully!`,
            recruitment,
            updated_by_user: `${userName} - ${userPosition}`,
        };
    }
    async statusCount(user, dto) {
        const { is_active } = dto;
        const whereCondition = {
            ...(is_active !== undefined && { is_active }),
        };
        const [counts] = await Promise.all([
            this.prisma.careerPosting.groupBy({
                by: ['status'],
                where: whereCondition,
                _count: { _all: true },
            }),
            this.prisma.careerPosting.count({
                where: { is_active: true },
            }),
        ]);
        const result = {
            all: 0,
            draft: 0,
            submitted: 0,
            verified: 0,
            approved: 0,
            rejected: 0,
        };
        counts.forEach((item) => {
            const statusKey = item.status.toLowerCase();
            if (Object.prototype.hasOwnProperty.call(result, statusKey)) {
                const key = statusKey;
                const countValue = item._count._all;
                result[key] = countValue;
                result.all += countValue;
            }
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
        return {
            stauts: 'success',
            message: 'Here is the status count',
            result,
        };
    }
};
exports.CareerPostingService = CareerPostingService;
exports.CareerPostingService = CareerPostingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CareerPostingService);
//# sourceMappingURL=career-posting.service.js.map