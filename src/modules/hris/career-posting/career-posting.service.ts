import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateCareerPostingDto,
  UpdateCareerPostingDto,
} from './dto/career-posting.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CareerPosingStatus, Prisma } from '@prisma/client';
import {
  RecruitmentPaginationDto,
  StatusCountDto,
} from 'src/utils/dtos/recruitment-pagination.dto';

@Injectable()
export class CareerPostingService {
  constructor(private prisma: PrismaService) {}

  //get career posting
  async getCareerPosting(recruitmentId: string, user: RequestUser) {
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
      message: 'Here is the Career/Job Posting',
      recruitment,
    };
  }

  //get career postings
  async getCareerPostings(user: RequestUser, dto: RecruitmentPaginationDto) {
    const { search, status, sortBy, order, page, perPage } = dto;

    //pagination area
    const skip = (page - 1) * perPage;

    //with status params filter
    const whereCondition: Prisma.CareerPostingWhereInput = {
      isActive: true,
      ...(status && {
        status: status as CareerPosingStatus,
      }),
    };

    const positionFields = ['name'];
    const departmentFields = ['name'];
    const userLocationFields = ['location_name'];

    let whereConditions: Prisma.CareerPostingWhereInput = {};

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
      recruitments,
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
        'You are not allowed to perform this action',
      );
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

    // const combinedJobDescription = `
    // ${position?.job_description ?? ''}

    // Additional Information:
    // ${createCareerPosting.job_description ?? ''}
    // `;

    const recruitment = await this.prisma.careerPosting.create({
      data: {
        position_id: createCareerPosting.position_id,
        slots: createCareerPosting.slots,
        // job_description: posting.job_description || '',
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

  async updateCareerPosting(
    recruitmentId: string,
    updateCareerPostingDto: UpdateCareerPostingDto,
    user: RequestUser,
  ) {
    const careerPosting = await this.prisma.careerPosting.findUnique({
      where: { id: recruitmentId },
    });

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
        isActive: updateCareerPostingDto.isActive ?? undefined,
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
      recruitment,
      updated_by_user: `${userName} - ${userPosition}`,
    };
  }

  async statusCount(user: RequestUser, dto: StatusCountDto) {
    const { filter } = dto;

    // 1. Initialize an empty where object
    const whereCondition: Prisma.CareerPostingWhereInput = {};

    // 2. Only apply isActive filter if the user specifically asked for 'active'
    if (filter === 'active') {
      whereCondition.isActive = true;
    }

    // 3. Execute queries
    const [counts] = await Promise.all([
      this.prisma.careerPosting.groupBy({
        by: ['status'],
        where: whereCondition, // This is {} if filter is empty, meaning "Fetch All"
        _count: { _all: true },
      }),
      this.prisma.careerPosting.count({
        where: { isActive: true }, // We always want this count regardless of the filter
      }),
    ]);

    // 4. Build the response object with defaults
    const result = {
      all: 0,
      draft: 0,
      submitted: 0,
      verified: 0,
      approved: 0,
      rejected: 0,
      // isActive: totalActiveCount,
    };

    // 5. Populate the result based on the DB response
    counts.forEach((item) => {
      const statusKey = item.status.toLowerCase();

      // Check if the key exists in our object
      if (Object.prototype.hasOwnProperty.call(result, statusKey)) {
        // Cast the string to a valid key type
        const key = statusKey as keyof typeof result;

        const countValue = item._count._all;
        result[key] = countValue;
        result.all += countValue;
      }
    });

    return result;
  }
}
