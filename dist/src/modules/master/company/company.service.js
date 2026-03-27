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
exports.CompanyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../config/prisma/prisma.service");
let CompanyService = class CompanyService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCompany(companyId, user) {
        const company = await this.prisma.company.findUnique({
            where: { id: companyId },
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
        if (!company) {
            throw new common_1.NotFoundException('Company not found or is inactive.');
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
            message: 'Here is the Company.',
            company,
        };
    }
    async getCompanies(user, dto) {
        const { search, sortBy, order, page, perPage } = dto;
        const skip = (page - 1) * perPage;
        const whereCondition = {
            is_active: true,
        };
        const stringFields = [
            'name',
            'abbreviation',
            'address',
            'company_tin',
            'fax_no',
            'telephone_no',
        ];
        if (search) {
            const orConditions = [];
            orConditions.push(...stringFields.map((field) => ({
                [field]: {
                    contains: search,
                    mode: 'insensitive',
                },
            })));
            if (!isNaN(Number(search))) {
                orConditions.push({
                    is_top_20000: Number(search),
                });
            }
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
            'abbreviation',
        ];
        const safeSortBy = allowSortFeilds.includes(sortBy) ? sortBy : 'created_at';
        const [total, companies] = await this.prisma.$transaction([
            this.prisma.company.count({
                where: {
                    ...whereCondition,
                },
            }),
            this.prisma.company.findMany({
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
            message: 'Here are the list of Companies.',
            count: total,
            page,
            perPage,
            companies,
        };
    }
    async createCompany(createCompanyDto, user) {
        const { name, address, telephone_no, fax_no, company_tin, is_top_20000, abbreviation, } = createCompanyDto;
        const existingCompany = await this.prisma.company.findFirst({
            where: {
                name: createCompanyDto.name,
            },
        });
        if (existingCompany) {
            throw new common_1.ConflictException('Company already exist!');
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
            throw new common_1.ForbiddenException('User is not allowed to view Companies');
        }
        const company = await this.prisma.company.create({
            data: {
                name,
                address,
                telephone_no,
                fax_no,
                company_tin,
                abbreviation,
                is_top_20000,
                created_by: user.id,
            },
        });
        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPosition = requestUser.employee.position.name;
        return {
            status: 'success',
            message: `${company.name} company has been createad successfully!`,
            company,
            created_by_user: `${userName} - ${userPosition}`,
        };
    }
    async updateCompany(companyId, updateCompanyDto, user) {
        const company = await this.prisma.company.findUnique({
            where: { id: companyId },
            select: {
                name: true,
                is_active: true,
            },
        });
        if (!company) {
            throw new common_1.NotFoundException('Company does not exist or inactive!');
        }
        const updatedCompany = await this.prisma.company.update({
            where: { id: companyId },
            data: {
                name: updateCompanyDto.name ?? undefined,
                address: updateCompanyDto.address ?? undefined,
                telephone_no: updateCompanyDto.telephone_no ?? undefined,
                fax_no: updateCompanyDto.fax_no ?? undefined,
                company_tin: updateCompanyDto.company_tin ?? undefined,
                is_top_20000: updateCompanyDto.is_top_20000 ?? undefined,
                abbreviation: updateCompanyDto.abbreviation ?? undefined,
                is_active: updateCompanyDto.is_active ?? undefined,
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
            throw new common_1.ForbiddenException('User is not allowed to view Companies');
        }
        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPosition = requestUser.employee.position.name;
        return {
            status: 'success',
            message: `${updatedCompany.name} company has been updated successfully!`,
            updatedCompany,
            updated_by_user: `${userName} - ${userPosition}`,
        };
    }
};
exports.CompanyService = CompanyService;
exports.CompanyService = CompanyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompanyService);
//# sourceMappingURL=company.service.js.map