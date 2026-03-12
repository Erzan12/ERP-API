import { 
    BadRequestException, 
    ConflictException, 
    ForbiddenException, 
    Injectable 
} from '@nestjs/common';
import { CreateCareerPostingDto } from './dto/career-posting.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CareerPostingService {
    constructor(private prisma: PrismaService) {}

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
        // const existingCareerPosting = await this.prisma.careerPosting.findFirst({
        //     where: 
        // })

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
}
