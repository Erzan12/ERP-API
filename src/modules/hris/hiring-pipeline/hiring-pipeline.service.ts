import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CreateApplicantDto, UpdateApplicantDto } from './dto/applicant.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';
import { RecruitmentPaginationDto } from 'src/utils/dtos/recruitment-pagination.dto';
import { ApplicationSource, ApplicationStatus, InterviewStage } from 'src/utils/decorators/global.enums.decorator';

@Injectable()
export class HiringPipelineService {
    constructor(private prisma: PrismaService) {}

    async getApplicant(
        applicantId: string,
        user: RequestUser,
    ) {
        const applicant = await this.prisma.applicant.findUnique({
            where: { id: applicantId },
            include: {
                careerPosting: {
                    select: {
                        id: true,
                        position: {
                            select: {
                                name: true,
                            }
                        },
                        user_location: {
                            select: {
                                locationName: true,
                            }
                        }
                    }

                },
                createdBy: {
                    select: {
                        person: {
                            select: {
                                first_name: true,
                                middle_name: true,
                                last_name: true,
                            }
                        }
                    }
                },
                updatedBy: {
                    select: {
                        person: {
                            select: {
                                first_name: true,
                                middle_name: true,
                                last_name: true,
                            }
                        }
                    }
                },
            }
        });

        if (!applicant) {
            throw new NotFoundException('Applicant not found');
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
            throw new BadRequestException(`User does not exist.`);
        }

        const allowedRoles = [
            'Administrator',
            'Super Administrator',
            'HR Manager',
            'HR Clerk',
            'HR Staff',
        ];

        const canView = requestUser.user_roles.some((role) =>
            allowedRoles.includes(role.role_name),
        );

        if (!canView) {
            throw new ForbiddenException(
                'You are not authorized to perform this action',
            );
        }

        return {
            status: 'success',
            message: 'Here is the Applicant.',
            applicant,
        };
    }

    async getApplicants(
        user: RequestUser,
        dto: RecruitmentPaginationDto,
    ) {
        const { search, status, sortBy, order, page, perPage } = dto;

        //pagination area
        const skip = (page - 1) * perPage;

        const whereCondition: any = {
            isActive: true,
            ...(status && {
                application_status: status as ApplicationStatus,
            })
        };

        const careerFields = ['name'];
        const userLocationFields = ['locationName'];

        let whereConditions: any = {};

        if (search) {
            whereConditions = {
                OR: [
                    ...careerFields.map((field) => ({
                        //useful query if searching for columns under a table that only posesses a FK like career_id -> position(relation column)
                        careerPosting: {
                            position: {
                                [field]: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            },
                        }
                    })),
                    ...userLocationFields.map((field) => ({
                        //useful query if searching for columns under a table that only posesses a FK like career_id -> user_location(relation column)
                        careerPosting: {
                            user_location:{ 
                                [field]: {
                                    contains: search,
                                    mode: 'insensitive',
                                },
                            }
                        }
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
                    {
                       application_source: {
                        contains: search,
                        mode: 'insensitive',
                       },
                    },
                    {
                        application_status: {
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
        ];

        if (!allowSortFeilds.includes(sortBy)) {
            sortBy;
        }

        const [total, applicants] = await this.prisma.$transaction([
            this.prisma.applicant.count({
                where: {
                    ...whereCondition,
                    ...whereConditions
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
                                    name: true
                                }
                            },
                            user_location: {
                                select: {
                                    locationName: true,
                                }
                            }
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
                    isActive: true,
                    created_at: true,
                    updated_at: true,
                    createdBy: {
                        select: {
                            person: {
                                select: {
                                    first_name: true,
                                    middle_name: true,
                                    last_name: true,
                                }
                            }
                        }
                    },
                    updatedBy: {
                        select: {
                            person: {
                                select: {
                                    first_name: true,
                                    middle_name: true,
                                    last_name: true,
                                }
                            }
                        }
                    }
                },
                skip,
                take: perPage,
                orderBy: {
                    [sortBy]: order,
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
            throw new BadRequestException(`User does not exist.`);
        }

        const allowedRoles = [
            'Administrator',
            'Super Administrator',
            'HR Manager',
            'HR Clerk',
            'HR Staff',
        ];

        const canView = requestUser.user_roles.some((role) =>
            allowedRoles.includes(role.role_name),
        );

        if (!canView) {
            throw new ForbiddenException(
                'You are not authorized to perform this action',
            );
        }

        return {
            status: 'success',
            message: 'List of Applicant Posting',
            count: total,
            page,
            perPage,
            // totalPage: Math.ceil(total / perPage),
            applicants,
        };
    }

    //create applicant
    async createApplicant(
        createApplicantDto: CreateApplicantDto,
        user: RequestUser,
    ) {
        const { career_id, application_source, application_status } = createApplicantDto;

        if (!Object.values(ApplicationSource).includes(application_source)) {
            throw new ForbiddenException('Error! Please use male or female');
        }

        if (!Object.values(ApplicationStatus).includes(application_status)) {
            throw new ForbiddenException(
                'Error! Please use single, married, separated, or widowed',
            );
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
                user_roles:true,
            },
        });

        if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
            throw new BadRequestException(`User does not exist.`);
        }

        const allowedRoles = [
            'Administrator',
            'Super Administrator',
            'HR Manager',
            'HR Clerk',
            'HR Staff',
        ];

        const canView = requestUser.user_roles.some((role) =>
            allowedRoles.includes(role.role_name),
        );

        if (!canView) {
            throw new ForbiddenException(
                'You are not allowed to perform this action',
            );
        } 

        await this.prisma.careerPosting.findUnique({
            where: {
                id: career_id,
            },
            select: {
                user_location: {
                    select: {
                        locationName: true,
                    }
                }
            }
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
                date_applied: new Date(
                    createApplicantDto.date_applied
                ),
                created_by: user.id,
            }
        })

        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPosition = requestUser.employee.position.name;

        return {
            status: 'success',
            message: `Applicant has been created successfully`,
            applicant,
            created_by_user: `${userName} - ${userPosition}`
        }
    }

    async updateApplicant(
        applicantId: string,
        updateApplicantDto: UpdateApplicantDto,
        user: RequestUser
    ) {
        const exisitngApplicant = await this.prisma.applicant.findUnique({
            where: { id: applicantId },
        })

        if (!exisitngApplicant) {
            throw new NotFoundException('Applicant not found')
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
                updated_by: user.id
            }
        })

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
            throw new BadRequestException(`User does not exist.`);
        }

        const allowedRoles = [
            'Administrator',
            'Super Administrator',
            'HR Manager',
            'HR Clerk',
            'HR Staff',
        ];

        const canView = requestUser.user_roles.some((role) =>
            allowedRoles.includes(role.role_name),
        );

        if (!canView) {
            throw new ForbiddenException(
                'You are not authorized to perform this action',
            );
        }

        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPosition = requestUser.employee.position.name;

        return {
            status: 'success',
            message: `Job/Career posting has been updated successfully!`,
            // updated_by: {
            //   id: requestUser.id,
            //   name: userName,
            //   position: userPos,
            // },
            applicant,
            updated_by_user: `${userName} - ${userPosition}`
        };
    }

    async assignInterviewer(user: RequestUser, dto: {
        applicant_id: string;
        interviewers: string[]; // [initial, second, third]
    }) {
        const { applicant_id, interviewers } = dto;

        // Optional: validate length (must be 3)
        if (interviewers.length !== 3) {
            throw new Error('You must assign exactly 3 interviewers');
        }

        if (!Object.values(InterviewStage)) {
            throw new ForbiddenException('Error! Please use initial, second, third');
        }

        // // Create records
        // const dataToCreate = interviewers.map((employee_id, index) => ({
        //     employee_id,
        //     applicant_id,
        //     remarks: '',
        //     total_points: 0,
        //     recommendations: '',
        //     created_by: user.id,

        //     // Optional: track stage
        //     // stage: ['INITIAL', 'SECOND', 'FINAL'][index]
        // }));

        const stages = ['INITIAL', 'SECOND', 'FINAL'];

        const dataToCreate = interviewers.map((employee_id, index) => ({
            employee_id,
            applicant_id,
            stage: stages[index],
            remarks: '',
            total_points: 0,
            recommendations: '',
            created_by: user.id,
        }));

        return await this.prisma.$transaction(
            dataToCreate.map(data =>
            this.prisma.interviewer.create({ data })
            )
        );
    }
}
