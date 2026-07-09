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
import {
  Prisma,
  WorkflowActionType,
  CareerPostingStatus,
} from '@prisma/client';
import { RecruitmentPaginationDto } from 'src/utils/dtos/recruitment-pagination.dto';
import { WORKFLOW_ENTITY } from 'src/utils/constants/workflow-entity.constants';

@Injectable()
export class CareerPostingService {
  constructor(private prisma: PrismaService) {}

  //get career posting
  async getCareerPosting(recruitmentId: string, user: RequestUser) {
    // Auth check first
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
      'HR Administrator',
      'HR Manager',
      'HR Clerk',
      'HR Staff',
    ];
    const canView = requestUser?.user_roles.some((role) =>
      allowedRoles.includes(role.role_name),
    );

    if (!canView) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

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

    return {
      status: 'success',
      message: 'Here is the Career/Job Posting',
      recruitment,
    };
  }

  //get career postings
  async getCareerPostings(user: RequestUser, dto: RecruitmentPaginationDto) {
    const { search, status, sortBy, order, page, perPage } = dto;

    // Auth check first
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
      'HR Administrator',
      'HR Manager',
      'HR Clerk',
      'HR Staff',
    ];
    const canView = requestUser?.user_roles.some((role) =>
      allowedRoles.includes(role.role_name),
    );

    if (!canView) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

    //pagination area
    const skip = (page - 1) * perPage;

    // const parsedStatus = status as CareerPostingStatus;

    const isValidStatus = Object.values(CareerPostingStatus).includes(
      status as CareerPostingStatus,
    );

    // invalid → empty result
    if (status && !isValidStatus) {
      return {
        status: 'success',
        message: 'List of Career Posting',
        count: 0,
        page,
        perPage,
        recruitments: [],
      };
    }

    // const parsedStatus = isValidStatus ? (status as CareerPostingStatus) : undefined;

    //filter for status submitted and verified if status filter is submitted
    // const whereCondition: Prisma.CareerPostingWhereInput = {
    //   is_active: true,
    //   ...(parsedStatus && parsedStatus !== CareerPostingStatus.ALL && {
    //     status:
    //       parsedStatus === CareerPostingStatus.SUBMITTED
    //         ? {
    //             in: [
    //               CareerPostingStatus.SUBMITTED,
    //               CareerPostingStatus.VERIFIED,
    //             ],
    //           }
    //         : parsedStatus,
    //   }),
    // };

    // const whereCondition: Prisma.CareerPostingWhereInput = {
    //   is_active: true,
    //   ...(parsedStatus &&
    //     parsedStatus !== CareerPostingStatus.ALL && {
    //       status:
    //         parsedStatus === CareerPostingStatus.SUBMITTED
    //           ? {
    //               in: [
    //                 CareerPostingStatus.SUBMITTED,
    //                 CareerPostingStatus.VERIFIED,
    //               ],
    //             }
    //           : parsedStatus,
    //     }),
    // };

    const parsedStatus = status as CareerPostingStatus;

    const whereCondition: Prisma.CareerPostingWhereInput = {
      is_active: true,
    };

    if (parsedStatus && parsedStatus !== CareerPostingStatus.all) {
      if (parsedStatus === CareerPostingStatus.submitted) {
        whereCondition.status = {
          in: [CareerPostingStatus.submitted, CareerPostingStatus.verified],
        };
      } else {
        whereCondition.status = parsedStatus;
      }
    }

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
          // {
          //   employment_type: {
          //     contains: search,
          //     mode: 'insensitive',
          //   },
          // },
          // {
          //   employee_type: {
          //     contains: search,
          //     mode: 'insensitive',
          //   },
          // },
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
          is_published: true,
          published_on: true,
          employment_type: true,
          employee_type: true,
          status: true,
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
  async create(createCareerPosting: CreateCareerPostingDto, user: RequestUser) {
    // Auth check first
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
      'HR Administrator',
      'HR Manager',
      'HR Clerk',
      'HR Staff',
    ];
    const canView = requestUser?.user_roles.some((role) =>
      allowedRoles.includes(role.role_name),
    );

    if (!canView) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
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

    return this.prisma.$transaction(async (tx) => {
      const recruitment = await tx.careerPosting.create({
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

      await tx.workflowAction.create({
        data: {
          actionable_type: WORKFLOW_ENTITY.CAREER_POSTING,
          actionable_id: recruitment.id,
          action: WorkflowActionType.creation,
          acted_by: requestUser.id,
        },
      });

      const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
      const userPosition = requestUser.employee.position.name;

      return {
        status: 'success',
        message: `Career/Job Posting has been created successfully`,
        recruitment,
        created_by_user: `${userName} - ${userPosition}`,
      };
    });
  }

  async update(
    recruitmentId: string,
    updateCareerPostingDto: UpdateCareerPostingDto,
    user: RequestUser,
  ) {
    // Auth check first
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
      'HR Administrator',
      'HR Manager',
      'HR Clerk',
      'HR Staff',
    ];
    const canView = requestUser?.user_roles.some((role) =>
      allowedRoles.includes(role.role_name),
    );

    if (!canView) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

    const careerPosting = await this.prisma.careerPosting.findUnique({
      where: { id: recruitmentId },
    });

    if (!careerPosting) {
      throw new NotFoundException('Job/Career posting not found');
    }

    // Determine the resulting status (incoming or existing)
    const nextStatus =
      updateCareerPostingDto.status &&
      updateCareerPostingDto.status !== CareerPostingStatus.all
        ? updateCareerPostingDto.status
        : careerPosting.status;

    // Determine intended publish state
    const nextIsPublished =
      updateCareerPostingDto.is_published ?? careerPosting.is_published;

    // Validation rule
    if (nextIsPublished && nextStatus !== CareerPostingStatus.approved) {
      throw new BadRequestException(
        'Only approved career postings can be published.',
      );
    }

    let publishDate: Date | undefined = undefined;

    if (
      nextIsPublished &&
      nextStatus === CareerPostingStatus.approved &&
      !careerPosting.published_on
    ) {
      publishDate = new Date();
    }

    const recruitment = await this.prisma.careerPosting.update({
      where: { id: recruitmentId, is_active: true },
      data: {
        position_id: updateCareerPostingDto.position_id ?? undefined,
        slots: updateCareerPostingDto.slots ?? undefined,
        // job_description: updateCareerPostingDto.job_description ?? undefined,
        department_id: updateCareerPostingDto.department_id ?? undefined,
        user_location_id: updateCareerPostingDto.user_location_id ?? undefined,
        // is_published: updateCareerPostingDto.is_published ?? undefined,
        is_published: nextIsPublished,
        published_on: publishDate,
        is_active: updateCareerPostingDto.is_active ?? undefined,
        employment_type: updateCareerPostingDto.employment_type ?? undefined,
        employee_type: updateCareerPostingDto.employee_type ?? undefined,
        status:
          updateCareerPostingDto.status &&
          updateCareerPostingDto.status !== CareerPostingStatus.all
            ? updateCareerPostingDto.status
            : undefined,
        updated_by: user.id,
      },
    });

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPosition = requestUser.employee.position.name;

    return {
      status: 'success',
      message: `Career/Job posting has been updated successfully!`,
      recruitment,
      updated_by_user: `${userName} - ${userPosition}`,
    };
  }

  async statusCount(user: RequestUser) {
    // Auth check first
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
      'HR Administrator',
      'HR Manager',
      'HR Clerk',
      'HR Staff',
    ];
    const canView = requestUser?.user_roles.some((role) =>
      allowedRoles.includes(role.role_name),
    );

    if (!canView) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

    const whereCondition: Prisma.CareerPostingWhereInput = {
      is_active: true,
    };

    // Execute queries
    const [counts] = await Promise.all([
      this.prisma.careerPosting.groupBy({
        by: ['status'],
        where: whereCondition, // This is {} if filter is empty, meaning "Fetch All"
        _count: { _all: true },
      }),
      this.prisma.careerPosting.count({
        where: { is_active: true }, // We always want this count regardless of the filter
      }),
    ]);

    // Build the response object with defaults
    const result = {
      all: 0,
      draft: 0,
      submitted: 0,
      verified: 0,
      approved: 0,
      rejected: 0,
      // isActive: totalActiveCount,
    };

    // Populate the result based on the DB response
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

    return {
      stauts: 'success',
      message: 'Here is the status count for job/career posting',
      result,
    };
  }

  async submit(careerPostingId: string, user: RequestUser) {
    // Auth check first
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
      'HR Administrator',
      'HR Manager',
      'HR Clerk',
      'HR Staff',
    ];
    const canView = requestUser?.user_roles.some((role) =>
      allowedRoles.includes(role.role_name),
    );

    if (!canView) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const submitRecruitment = await tx.careerPosting.update({
        where: { id: careerPostingId, status: CareerPostingStatus.draft },
        data: {
          // status: 'for_verification',
          updated_by: requestUser.id,
        },
      });

      await tx.workflowAction.create({
        data: {
          actionable_type: WORKFLOW_ENTITY.CAREER_POSTING,
          actionable_id: careerPostingId,
          action: WorkflowActionType.submission,
          acted_by: requestUser.id,
        },
      });

      const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
      const userPosition = requestUser.employee.position.name;

      return {
        status: 'success',
        message: 'Career Posting submitted',
        submitRecruitment,
        submitted_by: `${userName} - ${userPosition}`,
      };
    });
  }

  async verify(careerPostingId: string, user: RequestUser) {
    // Auth check first
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
      'HR Administrator',
      'HR Manager',
      'HR Clerk',
      'HR Staff',
    ];
    const canView = requestUser?.user_roles.some((role) =>
      allowedRoles.includes(role.role_name),
    );

    if (!canView) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const careerPosting = await tx.careerPosting.findUnique({
        where: { id: careerPostingId },
      });

      if (careerPosting?.status !== 'for_verification') {
        throw new BadRequestException('Invalid! status must be: submitted');
      }

      const verifyCareerPosting = await tx.careerPosting.update({
        // where: { id: careerPostingId, status: "for_verification" },
        where: { id: careerPostingId },
        data: {
          status: CareerPostingStatus.verified,
        },
      });

      await tx.workflowAction.create({
        data: {
          actionable_type: WORKFLOW_ENTITY.LEAVE_REQUEST,
          actionable_id: careerPostingId,
          action: WorkflowActionType.verification,
          acted_by: requestUser.id,
        },
      });

      const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
      const userPosition = requestUser.employee.position.name;

      return {
        status: 'success',
        message: 'Career Posting Verified',
        verifyCareerPosting,
        verified_by: `${userName} - ${userPosition}`,
      };
    });
  }

  async approve(careerPostingId: string, user: RequestUser) {
    // Auth check first
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
      'HR Administrator',
      'HR Manager',
      'HR Clerk',
      'HR Staff',
    ];
    const canView = requestUser?.user_roles.some((role) =>
      allowedRoles.includes(role.role_name),
    );

    if (!canView) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const careerPosting = await tx.careerPosting.findUnique({
        where: { id: careerPostingId },
      });

      if (careerPosting?.status !== CareerPostingStatus.verified) {
        throw new BadRequestException('Invalid! status must be: submitted');
      }

      const approveCareerPosting = await tx.careerPosting.update({
        where: { id: careerPostingId, status: CareerPostingStatus.verified },
        data: {
          status: CareerPostingStatus.approved,
        },
      });

      await tx.workflowAction.create({
        data: {
          actionable_type: WORKFLOW_ENTITY.CAREER_POSTING,
          actionable_id: careerPostingId,
          action: WorkflowActionType.approval,
          acted_by: requestUser.id,
        },
      });

      const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
      const userPosition = requestUser.employee.position.name;

      return {
        status: 'success',
        message: 'Career Posting Approved',
        approveCareerPosting,
        approved_by: `${userName} - ${userPosition}`,
      };
    });
  }

  async reject(careerPostingId: string, user: RequestUser) {
    // Auth check first
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
      'HR Administrator',
      'HR Manager',
      'HR Clerk',
      'HR Staff',
    ];
    const canView = requestUser?.user_roles.some((role) =>
      allowedRoles.includes(role.role_name),
    );

    if (!canView) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const careerPosting = await tx.careerPosting.findUnique({
        where: { id: careerPostingId },
      });

      if (!careerPosting) {
        throw new NotFoundException('Career Posting not found');
      }

      const allowedStatuses: CareerPostingStatus[] = [
        CareerPostingStatus.submitted,
        CareerPostingStatus.verified,
        CareerPostingStatus.for_verification,
        CareerPostingStatus.for_approval,
      ];

      if (!allowedStatuses.includes(careerPosting.status)) {
        throw new BadRequestException(
          'Invalid! status must be: submitted, verified, for_verification or for_approval',
        );
      }

      const rejectCareerPosting = await tx.careerPosting.updateMany({
        where: {
          id: careerPostingId,
          status: {
            in: [
              CareerPostingStatus.submitted,
              CareerPostingStatus.verified,
              // "for_verification",
              // "for_approval"
            ],
          },
        },
        data: {
          status: CareerPostingStatus.rejected,
        },
      });

      if (rejectCareerPosting.count === 0) {
        throw new BadRequestException('Update failed due to invalid status');
      }

      await tx.workflowAction.create({
        data: {
          actionable_type: WORKFLOW_ENTITY.CAREER_POSTING,
          actionable_id: careerPostingId,
          action: WorkflowActionType.rejection,
          acted_by: requestUser.id,
        },
      });

      const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
      const userPosition = requestUser.employee.position.name;

      return {
        status: 'success',
        message: 'Career Posting Rejected',
        rejectCareerPosting,
        rejected_by: `${userName} - ${userPosition}`,
      };
    });
  }
}
