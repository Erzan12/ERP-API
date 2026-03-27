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
exports.DivisionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../config/prisma/prisma.service");
let DivisionService = class DivisionService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDivision(divisionId, user) {
        const division = await this.prisma.division.findUnique({
            where: { id: divisionId },
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
        if (!division) {
            throw new common_1.BadRequestException('Division not found!');
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
            message: 'Here is the Division',
            division,
        };
    }
    async getDivisions(user, dto) {
        const { search, sortBy, order, page, perPage } = dto;
        const skip = (page - 1) * perPage;
        const whereCondition = {
            is_active: true,
        };
        const stringFields = ['name', 'division_head_id'];
        if (search) {
            const orConditions = [];
            orConditions.push(...stringFields.map((field) => ({
                [field]: {
                    contains: search,
                    mode: 'insensitive',
                },
            })));
            if (search === 'true' || search === 'false') {
                orConditions.push({
                    is_active: search === 'true',
                });
            }
            whereCondition.OR = orConditions;
        }
        const allowSortFeilds = [
            'id',
            'created_at',
            'updated_at',
            'name',
            'division_head_id',
        ];
        const safeSortBy = allowSortFeilds.includes(sortBy) ? sortBy : 'created_at';
        const [total, divisions] = await this.prisma.$transaction([
            this.prisma.division.count({
                where: {
                    ...whereCondition,
                },
            }),
            this.prisma.division.findMany({
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
            message: 'Here are the list of Divisions',
            count: total,
            page,
            perPage,
            divisions,
        };
    }
    async createDivision(createDivisionDto, user) {
        const { name, division_head_id } = createDivisionDto;
        const existingDivision = await this.prisma.division.findFirst({
            where: {
                name: createDivisionDto.name,
                division_head_id: createDivisionDto.division_head_id,
            },
        });
        if (existingDivision) {
            throw new common_1.ConflictException('Division already exists!');
        }
        const division = await this.prisma.division.create({
            data: {
                name,
                division_head_id,
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
            },
        });
        if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
            throw new common_1.BadRequestException(`User does not exist.`);
        }
        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPos = requestUser.employee.position.name;
        return {
            status: 'success',
            message: `${division.name} Division has been created successfully!`,
            created_by: {
                id: requestUser.id,
                name: userName,
                position: userPos,
            },
            division: division,
        };
    }
    async updateDivision(divisionId, updateDivisionDto, user) {
        const division = await this.prisma.division.findUnique({
            where: { id: divisionId },
            select: {
                name: true,
                is_active: true,
            },
        });
        if (!division) {
            throw new common_1.BadRequestException('Department does not exist!');
        }
        const updateDivision = await this.prisma.division.update({
            where: { id: divisionId },
            data: {
                name: updateDivisionDto.name ?? undefined,
                is_active: updateDivisionDto.is_active ?? undefined,
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
            message: `${updateDivision.name} Division has been updated successfully`,
            updateDivision,
            updated_by_user: `${userName} - ${userPosition}`,
        };
    }
};
exports.DivisionService = DivisionService;
exports.DivisionService = DivisionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DivisionService);
//# sourceMappingURL=division.service.js.map