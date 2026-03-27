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
exports.UserLocationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../config/prisma/prisma.service");
let UserLocationService = class UserLocationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserLocations(user, dto) {
        const { search, sortBy, order, page, perPage } = dto;
        const skip = (page - 1) * perPage;
        const whereCondition = {
            is_active: true,
        };
        const stringFields = [
            'location_name',
            'address_line_1',
            'address_line_2',
            'city',
            'province',
            'country',
        ];
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
        const allowSortFeilds = [
            'id',
            'created_at',
            'updated_at',
            'location_name',
            'province',
            'city',
        ];
        const safeSortBy = allowSortFeilds.includes(sortBy) ? sortBy : 'created_at';
        const [total, userLocations] = await this.prisma.$transaction([
            this.prisma.userLocation.count({
                where: {
                    ...whereCondition,
                },
            }),
            this.prisma.userLocation.findMany({
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
            message: 'Here are the list of User Locations.',
            count: total,
            page,
            perPage,
            userLocations,
        };
    }
    async getUserLocation(userLocationId, user) {
        const user_location = await this.prisma.userLocation.findUnique({
            where: { id: userLocationId },
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
        if (!user_location) {
            throw new common_1.BadRequestException('User Location not found');
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
            message: 'Here is the User Location.',
            user_location,
        };
    }
    async createUserLocation(createUserLocationDto, user) {
        const { location_name, address_line_1, address_line_2, city, province, country, } = createUserLocationDto;
        const existingUserLocation = await this.prisma.userLocation.findFirst({
            where: {
                location_name: createUserLocationDto.location_name,
            },
        });
        if (existingUserLocation) {
            throw new common_1.BadRequestException('User Location already exists!');
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
        const isAdmin = requestUser.user_roles.some((role) => role.role_name === 'Administrator');
        if (!isAdmin) {
            throw new common_1.ForbiddenException('User is not allowed to add new User Location.');
        }
        console.log('Current user role', isAdmin);
        const userLocation = await this.prisma.userLocation.create({
            data: {
                location_name,
                address_line_1,
                address_line_2,
                city,
                province,
                country,
                created_by: user.id,
            },
        });
        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPosition = requestUser.employee.position.name;
        return {
            status: 'success',
            message: `${userLocation.location_name} User Location has been created successfully!`,
            userLocation,
            created_by_user: `${userName} - ${userPosition}`,
        };
    }
    async updateUserLocation(userLocationId, updateUserLocationDto, user) {
        const userLocation = await this.prisma.userLocation.findUnique({
            where: { id: userLocationId },
        });
        if (!userLocation) {
            throw new common_1.NotFoundException('User location does not exist');
        }
        const updateUserLocation = await this.prisma.userLocation.update({
            where: { id: userLocationId },
            data: {
                location_name: updateUserLocationDto.location_name ?? undefined,
                address_line_1: updateUserLocationDto.address_line_1 ?? undefined,
                address_line_2: updateUserLocationDto.address_line_2 ?? undefined,
                city: updateUserLocationDto.city ?? undefined,
                province: updateUserLocationDto.province ?? undefined,
                country: updateUserLocationDto.country ?? undefined,
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
            message: `${userLocation.location_name} User Location has been updated successfully!`,
            updateUserLocation,
            updated_by: `${userName} - ${userPosition}`,
        };
    }
};
exports.UserLocationService = UserLocationService;
exports.UserLocationService = UserLocationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserLocationService);
//# sourceMappingURL=user_location.service.js.map