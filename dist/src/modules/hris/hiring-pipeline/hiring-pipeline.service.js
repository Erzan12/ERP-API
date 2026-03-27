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
exports.InterviewApplicantService = exports.HiringPipelineService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../config/prisma/prisma.service");
const global_enums_decorator_1 = require("../../../utils/decorators/global.enums.decorator");
let HiringPipelineService = class HiringPipelineService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getApplicant(applicantId, user) {
        const applicant = await this.prisma.applicant.findUnique({
            where: { id: applicantId },
            include: {
                careerPosting: {
                    select: {
                        id: true,
                        position: {
                            select: {
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
        if (!applicant) {
            throw new common_1.NotFoundException('Applicant not found');
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
            message: 'Here is the Applicant.',
            applicant,
        };
    }
    async getApplicants(user, dto) {
        const { search, status, is_active, sortBy, order, page, perPage } = dto;
        const skip = (page - 1) * perPage;
        const whereCondition = {
            ...(is_active !== undefined && { is_active }),
            ...(status && {
                application_status: status,
            }),
        };
        const careerFields = ['name'];
        const userLocationFields = ['location_name'];
        let whereConditions = {};
        if (search) {
            whereConditions = {
                OR: [
                    ...careerFields.map((field) => ({
                        careerPosting: {
                            position: {
                                [field]: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                        },
                    })),
                    ...userLocationFields.map((field) => ({
                        careerPosting: {
                            user_location: {
                                [field]: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                        },
                    })),
                    {
                        first_name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        middle_name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        last_name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        email: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                ],
            };
        }
        const allowSortFeilds = [
            'career_id',
            'application_source',
            'applicaiton_status',
            'date_applied',
            'created_by',
        ];
        const safeSortBy = allowSortFeilds.includes(sortBy) ? sortBy : 'created_at';
        const [total, applicants] = await this.prisma.$transaction([
            this.prisma.applicant.count({
                where: {
                    ...whereCondition,
                    ...whereConditions,
                },
            }),
            this.prisma.applicant.findMany({
                where: {
                    ...whereCondition,
                    ...whereConditions,
                },
                select: {
                    id: true,
                    careerPosting: {
                        select: {
                            id: true,
                            position: {
                                select: {
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
                        },
                    },
                    first_name: true,
                    middle_name: true,
                    last_name: true,
                    email: true,
                    mobile_number: true,
                    application_source: true,
                    application_status: true,
                    date_applied: true,
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
            message: 'List of Applicant Posting',
            count: total,
            page,
            perPage,
            applicants,
        };
    }
    async createApplicant(createApplicantDto, user) {
        const { career_id, application_source, application_status } = createApplicantDto;
        if (!Object.values(global_enums_decorator_1.ApplicationSource).includes(application_source)) {
            throw new common_1.ForbiddenException('Error! Please use male or female');
        }
        if (!Object.values(global_enums_decorator_1.ApplicationStatus).includes(application_status)) {
            throw new common_1.ForbiddenException('Error! Please use single, married, separated, or widowed');
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
            throw new common_1.ForbiddenException('You are not allowed to perform this action');
        }
        await this.prisma.careerPosting.findUnique({
            where: {
                id: career_id,
            },
            select: {
                user_location: {
                    select: {
                        location_name: true,
                    },
                },
            },
        });
        const applicant = await this.prisma.applicant.create({
            data: {
                career_id: career_id,
                first_name: createApplicantDto.first_name,
                middle_name: createApplicantDto.middle_name ?? undefined,
                last_name: createApplicantDto.last_name,
                email: createApplicantDto.email,
                mobile_number: createApplicantDto.mobile_number,
                application_source,
                application_status,
                date_applied: new Date(createApplicantDto.date_applied),
                created_by: user.id,
            },
        });
        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPosition = requestUser.employee.position.name;
        return {
            status: 'success',
            message: `Applicant has been created successfully`,
            applicant,
            created_by_user: `${userName} - ${userPosition}`,
        };
    }
    async updateApplicant(applicantId, updateApplicantDto, user) {
        const exisitngApplicant = await this.prisma.applicant.findUnique({
            where: { id: applicantId },
        });
        if (!exisitngApplicant) {
            throw new common_1.NotFoundException('Applicant not found');
        }
        const applicant = await this.prisma.applicant.update({
            where: { id: applicantId },
            data: {
                career_id: updateApplicantDto.career_id ?? undefined,
                first_name: updateApplicantDto.first_name ?? undefined,
                middle_name: updateApplicantDto.middle_name ?? undefined,
                last_name: updateApplicantDto.last_name ?? undefined,
                email: updateApplicantDto.email ?? undefined,
                mobile_number: updateApplicantDto.mobile_number ?? undefined,
                application_source: updateApplicantDto.application_source ?? undefined,
                application_status: updateApplicantDto.application_status ?? undefined,
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
            applicant,
            updated_by_user: `${userName} - ${userPosition}`,
        };
    }
    async statusCount(user, dto) {
        const { is_active } = dto;
        const whereCondition = {
            ...(is_active !== undefined && { is_active }),
        };
        const [counts] = await Promise.all([
            this.prisma.applicant.groupBy({
                by: ['application_status'],
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
            const statusKey = item.application_status.toLowerCase();
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
exports.HiringPipelineService = HiringPipelineService;
exports.HiringPipelineService = HiringPipelineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HiringPipelineService);
class InterviewApplicantService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assignInterviewPanel(user, dto) {
        const { applicant_id, interviewer_ids, date_of_interview } = dto;
        const stages = [
            global_enums_decorator_1.InterviewStage.INITIAL,
            global_enums_decorator_1.InterviewStage.SECOND,
            global_enums_decorator_1.InterviewStage.FINAL,
        ];
        const dataToCreate = interviewer_ids.map((employee_id, index) => ({
            employee_id,
            applicant_id,
            stage: stages[index],
            remarks: '',
            date_of_interview: date_of_interview,
            created_by: user.id,
        }));
        return await this.prisma.interviewer.createMany({
            data: dataToCreate,
        });
    }
    async assessInterviewPanel(user, dto) {
        const { interviewer_id, ratings, ...assessmentData } = dto;
        const currentInterviewer = await this.prisma.interviewer.findUnique({
            where: { id: interviewer_id },
        });
        if (!currentInterviewer)
            throw new common_1.NotFoundException('Interviewer record not found');
        if (currentInterviewer.stage !== global_enums_decorator_1.InterviewStage.INITIAL) {
            const previousStage = currentInterviewer.stage === global_enums_decorator_1.InterviewStage.FINAL
                ? global_enums_decorator_1.InterviewStage.SECOND
                : global_enums_decorator_1.InterviewStage.INITIAL;
            const prevAssessment = await this.prisma.interviewer.findFirst({
                where: {
                    applicant_id: currentInterviewer.applicant_id,
                    stage: previousStage,
                },
            });
            if (!prevAssessment || prevAssessment.total_points === 0) {
                throw new common_1.ForbiddenException(`Cannot assess the ${currentInterviewer.stage} stage until the ${previousStage} stage is completed.`);
            }
        }
        return await this.prisma.$transaction(async (tx) => {
            const updated = await tx.interviewer.update({
                where: { id: interviewer_id },
                data: {
                    ...assessmentData,
                    updated_by: user.id,
                },
            });
            if (ratings.length > 0) {
                await tx.examinationRating.createMany({
                    data: ratings.map((r) => ({
                        ...r,
                        interviewer_id: interviewer_id,
                        created_by: user.id,
                    })),
                });
            }
            return updated;
        });
    }
}
exports.InterviewApplicantService = InterviewApplicantService;
//# sourceMappingURL=hiring-pipeline.service.js.map