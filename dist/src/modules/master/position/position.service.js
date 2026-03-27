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
exports.PositionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../config/prisma/prisma.service");
let PositionService = class PositionService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPosition(positionId, user) {
        const position = await this.prisma.position.findUnique({
            where: { id: positionId },
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
        if (!position) {
            throw new common_1.BadRequestException('Position not found.');
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
            message: 'Here is the Position',
            position,
        };
    }
    async getPositions(user, dto) {
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
                department: {
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
            'department_id',
            'sorting',
        ];
        const safeSortBy = allowSortFeilds.includes(sortBy) ? sortBy : 'created_at';
        const [total, positions] = await this.prisma.$transaction([
            this.prisma.position.count({
                where: {
                    ...whereCondition,
                },
            }),
            this.prisma.position.findMany({
                where: {
                    ...whereCondition,
                },
                include: {
                    department: {
                        include: {
                            division: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
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
            message: 'Here are the list of Positions',
            count: total,
            page,
            perPage,
            positions,
        };
    }
    async createPosition(createPositionDto, user) {
        const { name } = createPositionDto;
        const existingPosition = await this.prisma.position.findFirst({
            where: { name: createPositionDto.name },
            select: {
                name: true,
                department: true,
                is_active: true,
            },
        });
        if (existingPosition) {
            throw new common_1.ConflictException('Position already exist! Try again!');
        }
        const position = await this.prisma.position.create({
            data: {
                name,
                hierarchy: createPositionDto.hierarchy ?? null,
                job_description: createPositionDto.job_description ?? null,
                sorting: createPositionDto.sorting ?? null,
                department: {
                    connect: { id: createPositionDto.department_id },
                },
                createdBy: {
                    connect: { id: user.id },
                },
            },
            include: {
                department: {
                    select: {
                        id: true,
                        name: true,
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
            },
        });
        if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
            throw new common_1.BadRequestException(`User does not exist.`);
        }
        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPosition = requestUser.employee.position.name;
        return {
            status: 'success',
            message: `${position.name} position has been created successfully!`,
            position,
            created_by_user: `${userName} - ${userPosition}`,
        };
    }
    async updatePosition(positionId, updatePositionDto, user) {
        const existingPosition = await this.prisma.position.findUnique({
            where: { id: positionId },
            select: {
                id: true,
                name: true,
                is_active: true,
            },
        });
        if (!existingPosition) {
            throw new common_1.BadRequestException('Position not Found.');
        }
        if (updatePositionDto.department_id !== undefined) {
            const existingDept = await this.prisma.department.findFirst({
                where: { id: updatePositionDto.department_id },
            });
            if (!existingDept) {
                throw new common_1.BadRequestException('Department not found!');
            }
        }
        const updateData = {
            name: updatePositionDto.name ?? undefined,
            hierarchy: updatePositionDto.hierarchy,
            job_description: updatePositionDto.job_description ?? undefined,
            sorting: updatePositionDto.sorting ?? undefined,
            is_active: updatePositionDto.is_active ?? undefined,
            updatedBy: {
                connect: { id: user.id },
            },
        };
        if (updatePositionDto.department_id !== undefined) {
            updateData.department = {
                connect: { id: updatePositionDto.department_id },
            };
        }
        const position = await this.prisma.position.update({
            where: { id: positionId },
            data: updateData,
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
            message: `${position.name} position has been updated successfully!`,
            position,
            updated_by_user: `${userName} - ${userPosition}`,
        };
    }
};
exports.PositionService = PositionService;
exports.PositionService = PositionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PositionService);
//# sourceMappingURL=position.service.js.map