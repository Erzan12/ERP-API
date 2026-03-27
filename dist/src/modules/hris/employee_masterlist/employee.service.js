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
exports.EmployeeService = void 0;
const common_1 = require("@nestjs/common");
const global_enums_decorator_1 = require("../../../utils/decorators/global.enums.decorator");
const prisma_service_1 = require("../../../config/prisma/prisma.service");
let EmployeeService = class EmployeeService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createEmployee(createEmployeeWithDetails, user) {
        return await this.prisma.$transaction(async (prisma) => {
            try {
                const { gender, civil_status } = createEmployeeWithDetails.person;
                if (!Object.values(global_enums_decorator_1.Gender).includes(gender)) {
                    throw new common_1.ForbiddenException('Error! Please use male or female');
                }
                if (!Object.values(global_enums_decorator_1.CivilStatus).includes(civil_status)) {
                    throw new common_1.ForbiddenException('Error! Please use single, married, separated, or widowed');
                }
                const company = await prisma.company.findUnique({
                    where: { id: createEmployeeWithDetails.employee.company_id },
                });
                if (!company)
                    throw new common_1.BadRequestException('Invalid company_id');
                const department = await prisma.department.findUnique({
                    where: { id: createEmployeeWithDetails.employee.department_id },
                });
                if (!department)
                    throw new common_1.BadRequestException('Invalid department_id');
                const companyId = createEmployeeWithDetails.employee.company_id;
                const existingPerson = await prisma.person.findFirst({
                    where: {
                        email: createEmployeeWithDetails.person.email,
                    },
                });
                if (existingPerson) {
                    const existingEmployee = await prisma.employee.findFirst({
                        where: {
                            person_id: existingPerson.id,
                            company_id: createEmployeeWithDetails.employee.company_id,
                        },
                    });
                    if (existingEmployee) {
                        throw new common_1.BadRequestException('This person is already employed in the company.');
                    }
                }
                const person = existingPerson ??
                    (await prisma.person.create({
                        data: {
                            first_name: createEmployeeWithDetails.person.first_name,
                            middle_name: createEmployeeWithDetails.person.middle_name,
                            last_name: createEmployeeWithDetails.person.last_name,
                            date_of_birth: new Date(createEmployeeWithDetails.person.date_of_birth),
                            gender,
                            civil_status,
                            email: createEmployeeWithDetails.person.email,
                        },
                    }));
                const hireDate = new Date(createEmployeeWithDetails.employee.hire_date);
                const generatedEmpID = await this.createUniqueEmpID(prisma, companyId, hireDate);
                const employeeCheck = await prisma.employee.findFirst({
                    where: {
                        person_id: person.id,
                        company_id: companyId,
                    },
                });
                if (employeeCheck) {
                    throw new common_1.BadRequestException('Employee already exists for this person in this company.');
                }
                const employee = await prisma.employee.create({
                    data: {
                        person_id: person.id,
                        employee_id: generatedEmpID,
                        company_id: companyId,
                        department_id: createEmployeeWithDetails.employee.department_id,
                        position_id: createEmployeeWithDetails.employee.position_id,
                        division_id: createEmployeeWithDetails.employee.division_id,
                        salary: createEmployeeWithDetails.employee.salary,
                        hire_date: hireDate,
                        pay_frequency: createEmployeeWithDetails.employee.pay_frequency,
                        employment_status_id: createEmployeeWithDetails.employee.employment_status_id,
                        monthly_equivalent_salary: createEmployeeWithDetails.employee.monthly_equivalent_salary,
                        archive_date: createEmployeeWithDetails.employee.archive_date,
                        other_employee_data: createEmployeeWithDetails.employee.other_employee_data,
                        corporate_rank_id: createEmployeeWithDetails.employee.corporate_rank_id,
                        created_by: user.id ?? null,
                    },
                });
                const requestUser = await prisma.user.findUnique({
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
                if (!requestUser?.employee?.person) {
                    throw new common_1.BadRequestException(`User does not exist.`);
                }
                const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
                const userPosition = requestUser.employee.position.name;
                return {
                    status: 'success',
                    message: 'Employee created',
                    employee,
                    created_by_user: `${userName} - ${userPosition}`,
                };
            }
            catch (error) {
                console.error('CREATE EMPLOYEE ERROR');
                console.error('Message:', error instanceof Error ? error.message : String(error));
                console.error('Stack:', error instanceof Error ? error.stack : 'N/A');
                console.error('Full error:', error);
                console.error('Transaction failed:', error);
                throw error;
            }
        });
    }
    async createUniqueEmpID(prisma, company_id, hire_date) {
        const company = await prisma.company.findUnique({
            where: { id: company_id },
            select: { abbreviation: true },
        });
        if (!company || !company.abbreviation) {
            throw new common_1.BadRequestException('Company not found or missing abbreviation');
        }
        const year = hire_date.getFullYear().toString().slice(2);
        const month = String(hire_date.getMonth() + 1).padStart(2, '0');
        const day = String(hire_date.getDate()).padStart(2, '0');
        const hireDateStr = `${year}${month}${day}`;
        const existingCount = await prisma.employee.count({
            where: {
                company_id: company_id,
                hire_date: hire_date,
            },
        });
        const suffix = String(existingCount + 1).padStart(3, '0');
        const employeeID = `${company.abbreviation}-${hireDateStr}-${suffix}`;
        console.log('Generated Employee ID:', employeeID);
        return employeeID;
    }
    async getEmployees(user, dto) {
        const { search, sortBy, order, page, perPage } = dto;
        const skip = (page - 1) * perPage;
        const whereCondition = {
            employment_status: {
                code: {
                    notIn: [
                        'TERMINATED',
                        'RESIGNED',
                    ],
                },
            },
        };
        const personFields = ['first_name', 'last_name', 'email'];
        const employmentStatusFields = ['code', 'label'];
        const departmentFields = ['name'];
        const companyFields = ['name'];
        const divisionFields = ['name'];
        const positionFields = ['name'];
        let whereConditions = {};
        if (search) {
            whereConditions = {
                OR: [
                    ...personFields.map((field) => ({
                        person: {
                            [field]: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                    })),
                    ...employmentStatusFields.map((field) => ({
                        employment_status: {
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
                    ...companyFields.map((field) => ({
                        company: {
                            [field]: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                    })),
                    ...divisionFields.map((field) => ({
                        division: {
                            [field]: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                    })),
                    ...positionFields.map((field) => ({
                        position: {
                            [field]: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                    })),
                    {
                        employee_id: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                ],
            };
        }
        const allowSortFields = [
            'department_id',
            'company_id',
            'employee_id',
            'employment_status_id',
            'created_at',
            'updated_at',
        ];
        const safeSortBy = allowSortFields.includes(sortBy) ? sortBy : 'created_at';
        const [total, employees] = await this.prisma.$transaction([
            this.prisma.employee.count({
                where: {
                    ...whereCondition,
                    ...whereConditions,
                },
            }),
            this.prisma.employee.findMany({
                where: {
                    ...whereCondition,
                    ...whereConditions,
                },
                select: {
                    id: true,
                    employee_id: true,
                    person: {
                        select: {
                            first_name: true,
                            middle_name: true,
                            last_name: true,
                        },
                    },
                    division: {
                        select: {
                            name: true,
                        },
                    },
                    company: {
                        select: {
                            name: true,
                        },
                    },
                    department: {
                        select: {
                            name: true,
                        },
                    },
                    position: {
                        select: {
                            name: true,
                        },
                    },
                    employment_status: {
                        select: {
                            label: true,
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
            message: 'Employees Masterlist',
            count: total,
            page,
            perPage,
            employees,
        };
    }
    async getEmployee(id, user) {
        const employee = await this.prisma.employee.findUnique({
            where: { id },
            include: {
                person: true,
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
        if (!employee) {
            throw new common_1.BadRequestException('Employee not found.');
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
            message: 'Here is the Employee.',
            employee,
        };
    }
    async updateEmployee(id, updateEmployeeWithDetailsDto, user) {
        return await this.prisma.$transaction(async (prisma) => {
            const employee = await prisma.employee.findUnique({
                where: { id },
                include: { person: true },
            });
            if (!employee) {
                throw new common_1.BadRequestException('Employee not found.');
            }
            const { person: UpdatePersonDto, employee: UpdateEmployeeDto } = updateEmployeeWithDetailsDto;
            if (UpdatePersonDto?.gender) {
                if (!Object.values(global_enums_decorator_1.Gender).includes(UpdatePersonDto.gender)) {
                    throw new common_1.BadRequestException('Invalid gender value.');
                }
            }
            if (UpdatePersonDto?.civil_status) {
                if (!Object.values(global_enums_decorator_1.CivilStatus).includes(UpdatePersonDto.civil_status)) {
                    throw new common_1.BadRequestException('Invalid civil status vlue.');
                }
            }
            const updatedPerson = UpdatePersonDto
                ? await prisma.person.update({
                    where: { id: employee.person_id },
                    data: {
                        ...UpdatePersonDto,
                        updated_at: user.id ?? undefined,
                    },
                })
                : null;
            const updatedEmployee = UpdateEmployeeDto
                ? await prisma.employee.update({
                    where: { id },
                    data: {
                        ...UpdateEmployeeDto,
                        updated_at: user.id ?? undefined,
                    },
                })
                : null;
            return {
                employee: updatedEmployee,
                person: updatedPerson,
            };
        });
    }
};
exports.EmployeeService = EmployeeService;
exports.EmployeeService = EmployeeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmployeeService);
//# sourceMappingURL=employee.service.js.map