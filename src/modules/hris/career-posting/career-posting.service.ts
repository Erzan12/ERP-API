import { 
    BadRequestException, 
    ConflictException, 
    ForbiddenException, 
    Injectable, 
    NotFoundException
} from '@nestjs/common';
import { CreateCareerPostingDto, UpdateCareerPostingDto } from './dto/career-posting.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CareerPostingService {
    constructor(private prisma: PrismaService) {}

    //get career posting
    async getCareerPosting(
        careerPostingId: string,
        user: RequestUser
    ) {
        const careerPosting = await this.prisma.careerPosting.findUnique({
            where: { id: careerPostingId },
            include: {
                department: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                position: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                user_location: {
                    select: {
                        id: true,
                        locationName: true,
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
                }
            }
        });

        if (!careerPosting) {
            throw new NotFoundException('Career Posting not found');
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

        const isAdmin = requestUser.user_roles.some(
            (role) =>
            // role.role_id === 'b1118e05-6377-4e64-a677-14f9b9226fdd' &&
             role.role_name === 'Administrator' || 'Super Administrator',
        );

        if (!isAdmin) {
            throw new ForbiddenException('User is not allowed to view a Company');
        }

        return {
            status: 'success',
            message: 'Here is the Company.',
            careerPosting,
        };
    }

    //get career postings
    async getCareerPostings(
        user: RequestUser,
        dto: PaginationDto,
    ) {

        const { search, sortBy, order, page, perPage } = dto;

        //pagination area
        const skip = (page - 1) * perPage;

        const whereCondition: any = {
            isActive: true,
        };

        const positionFields = ['name'];
        const departmentFields = ['name'];
        const userLocationFields = ['locationName'];

        let whereConditions: any = {};

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

        const allowSortFeilds = [
            'position_id',
            'slots',
            'department_id',
            'user_location_id',
            'employment_type',
            'employee_type',
        ];
        if (!allowSortFeilds.includes(sortBy)) {
            sortBy;
        }

        const [total, careerPostings] = await this.prisma.$transaction([
            this.prisma.careerPosting.count({
                where: {
                    ...whereCondition,
                    ...whereConditions
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
                        }
                    },
                    slots: true,
                    job_description: true,
                    department: {
                        select: {
                            id: true,
                            name: true,
                        }
                    },
                    user_location: {
                        select: {
                            id: true,
                            locationName: true,
                        }
                    },
                    isPublished: true,
                    published_on: true,
                    employment_type: true,
                    employee_type: true,
                    status: true,
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
            message: 'List of Career Posting',
            count: total,
            page,
            perPage,
            // totalPage: Math.ceil(total / perPage),
            careerPostings,
        };
    }

    //create career posting
    async createCareerPosting(
        createCareerPosting: CreateCareerPostingDto,
        user: RequestUser,
    ) {
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

        const position = await this.prisma.position.findUnique({
            where: {
                id: createCareerPosting.position_id,
            },
            select: {
                job_description: true,
            },
        });

        const combinedJobDescription = `
        ${position?.job_description ?? ''}
        
        Additional Information: 
        ${createCareerPosting.job_description ?? ''}
        `;
        
        const careerPosting = await this.prisma.careerPosting.create({
            data: {
                position_id: createCareerPosting.position_id,
                slots: createCareerPosting.slots,
                job_description: combinedJobDescription,
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
            careerPosting,
            created_by_user: `${userName} - ${userPosition}`
        }
    }

    async updateCareerPosting(
       careerPostingId: string,
       updateCareerPostingDto: UpdateCareerPostingDto,
       user: RequestUser, 
    ) {
        const careerPosting = await this.prisma.careerPosting.findUnique({
            where: { id: careerPostingId },
        })

        if (!careerPosting) {
            throw new NotFoundException('Job/Career posting not found');
        }

        let publishDate: Date | undefined = undefined;

        if (
        updateCareerPostingDto.isPublished === true &&
        !careerPosting.published_on
        ) {
        publishDate = new Date();
        }

        const updatedCareerPosting = await this.prisma.careerPosting.update({
            where: { id: careerPostingId },
            data: {
                position_id: updateCareerPostingDto.position_id ?? undefined,
                slots: updateCareerPostingDto.slots ?? undefined,
                job_description: updateCareerPostingDto.job_description ?? undefined,
                department_id: updateCareerPostingDto.department_id ?? undefined,
                user_location_id: updateCareerPostingDto.user_location_id ?? undefined,
                isPublished: updateCareerPostingDto.isPublished ?? undefined,
                published_on: publishDate,
                isActive: updateCareerPostingDto.isActive ?? undefined,
                employment_type: updateCareerPostingDto.employment_type ?? undefined,
                employee_type: updateCareerPostingDto.employee_type ?? undefined,
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

        const isAdmin = requestUser.user_roles.some(
            (role) =>
                // role.role_id === 'b1118e05-6377-4e64-a677-14f9b9226fdd' &&
                role.role_name === 'Administrator' ||
                role.role_name === 'Super Administrator',
        );

        if (!isAdmin) {
            throw new ForbiddenException('User is not allowed to view Companies');
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
            updatedCareerPosting,
            updated_by_user: `${userName} - ${userPosition}`
        };
    }
}
