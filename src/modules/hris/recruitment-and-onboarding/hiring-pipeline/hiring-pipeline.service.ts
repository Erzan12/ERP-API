import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CreateApplicantDto, UpdateApplicantDto } from './dto/applicant.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { RecruitmentPaginationDto } from 'src/utils/dtos/recruitment-pagination.dto';
import { BulkAssignInterviewDto } from './dto/bulk-assign-interviewer.dto';
import { AssessInterviewDto } from './dto/assess-interviewer.dto';
import {
  ApplicationStatus,
  InterviewStage,
  Prisma,
  WorkflowActionType,
} from '@prisma/client';
import { AttachmentUploadService } from 'src/jobs/attachment-upload/attachment-upload.service';
import { WORKFLOW_ENTITY } from 'src/utils/constants/workflow-entity.constants';
import { TRANSACTION_TYPE } from 'src/utils/constants/transaction-type.constants';

@Injectable()
export class HiringPipelineService {
  constructor(
    private prisma: PrismaService,
    private uploadService: AttachmentUploadService,
  ) {}

  async getApplicant(applicantId: string, user: RequestUser) {
    // Auth check first
    const requestUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { user_roles: true },
    });

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
      throw new NotFoundException('Applicant not found');
    }

    return {
      status: 'success',
      message: 'Here is the Applicant.',
      applicant,
    };
  }

  async getApplicantDocuments(applicantId: string, user: RequestUser) {
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

    const applicant = await this.prisma.applicant.findUnique({
      where: { id: applicantId },
    });

    if (!applicant) {
      throw new NotFoundException('Applicant not found');
    }

    const documents = await this.prisma.attachments.findMany({
      where: {
        transaction_type: TRANSACTION_TYPE.APPLICANT_DOC,
        transaction_id: applicant.id,
      },
    });

    return {
      status: 'success',
      message: 'These are the Applicants Documents',
      documents,
    };
  }

  async getApplicants(user: RequestUser, dto: RecruitmentPaginationDto) {
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

    const whereCondition: Prisma.ApplicantWhereInput = {
      is_active: true,
      ...(status && {
        application_status: status as ApplicationStatus,
      }),
    };

    // const whereCondition: Prisma.ApplicantWhereInput = {
    //   ...(is_active !== undefined && { is_active }),
    //   ...(status && {
    //     application_status: status as ApplicationStatus,
    //   }),
    // };

    const careerFields = ['name'];
    const userLocationFields = ['location_name'];

    let whereConditions: Prisma.ApplicantWhereInput = {};

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
            },
          })),
          ...userLocationFields.map((field) => ({
            //useful query if searching for columns under a table that only posesses a FK like career_id -> user_location(relation column)
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

    const allowSortFields = [
      'career_id',
      'application_source',
      'applicaiton_status',
      'date_applied',
      'created_by',
    ];

    // if (!allowSortFields.includes(sortBy)) {
    //   sortBy;
    // }
    const safeSortBy = allowSortFields.includes(sortBy) ? sortBy : 'created_at';
    const [total, findApplicants] = await this.prisma.$transaction([
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

    const applicantIds = findApplicants.map((a) => a.id);

    const attachments = await this.prisma.attachments.findMany({
      where: {
        transaction_type: WORKFLOW_ENTITY.HIRING_PIPELINE,
        transaction_id: { in: applicantIds },
      },
    });

    const attachmentMap = new Map<string, any[]>();

    for (const file of attachments) {
      const list = attachmentMap.get(file.transaction_id) || [];
      list.push(file);
      attachmentMap.set(file.transaction_id, list);
    }

    const applicants = findApplicants.map((applicant) => ({
      ...applicant,
      attachments: attachmentMap.get(applicant.id) || [],
    }));

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
    applicantDto: CreateApplicantDto,
    user: RequestUser,
    files: Express.Multer.File[],
  ) {
    const { career_id, application_source } = applicantDto;

    // if (!Object.values(application_source).includes(application_source)) {
    //   throw new ForbiddenException('Error! Please use company_website, walk_in, referral, linkedIn or jobstreet');
    // }

    // if (!Object.values(ApplicationStatus).includes(application_status)) {
    //   throw new ForbiddenException(
    //     'Error! Please use single, married, separated, or widowed',
    //   );
    // }

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

    return this.prisma.$transaction(async (tx) => {
      const applicant = await tx.applicant.create({
        data: {
          career_id: career_id,
          first_name: applicantDto.first_name,
          middle_name: applicantDto.middle_name ?? undefined,
          last_name: applicantDto.last_name,
          email: applicantDto.email,
          mobile_number: applicantDto.mobile_number,
          application_source,
          // application_status,
          date_applied: new Date(applicantDto.date_applied),
          created_by: user.id,
        },
      });

      const attachments = await this.uploadService.attachFiles({
        files,
        transaction_type: TRANSACTION_TYPE.APPLICANT_DOC,
        transaction_id: applicant.id,
        // file_desc: file_desc,
        user_id: user.id,
      });

      const currentUser = await tx.user.findUnique({
        where: {
          id: requestUser.id,
        },
        select: {
          id: true,
          employee: {
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

      const creatorName = currentUser
        ? [
            currentUser.employee.person.first_name,
            currentUser.employee.person.middle_name,
            currentUser.employee.person.last_name,
          ]
            .filter(Boolean)
            .join(' ')
        : '';

      await tx.workflowAction.create({
        data: {
          actionable_type: WORKFLOW_ENTITY.HIRING_PIPELINE,
          actionable_id: applicant.id,
          action: WorkflowActionType.creation,
          acted_by: requestUser.id,
          acted_at: new Date(),
          metadata: {
            title: 'Applicant created',
            message: 'You have created a new Applicant',
            user: creatorName,
            role: 'creator',
          },
        },
      });

      const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
      const userPosition = requestUser.employee.position.name;

      return {
        status: 'success',
        message: `Applicant has been created successfully`,
        applicant,
        attachments,
        created_by_user: `${userName} - ${userPosition}`,
      };
    });
  }

  async updateApplicant(
    applicantId: string,
    updateApplicantDto: UpdateApplicantDto,
    user: RequestUser,
    files: Express.Multer.File[],
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

    const existingApplicant = await this.prisma.applicant.findUnique({
      where: { id: applicantId },
    });

    if (!existingApplicant) {
      throw new NotFoundException('Applicant not found');
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

    const attachments = await this.uploadService.attachFiles({
      files,
      transaction_type: TRANSACTION_TYPE.APPLICANT_DOC,
      transaction_id: applicant.id,
      // file_desc: file_desc,
      user_id: user.id,
    });

    const userName = `${requestUser.employee.person?.first_name} ${requestUser.employee.person?.last_name}`;
    const userPosition = requestUser.employee.position?.name;

    return {
      status: 'success',
      message: `Job/Career posting has been updated successfully!`,
      applicant,
      attachments,
      updated_by_user: `${userName} - ${userPosition}`,
    };
  }

  async statusCount(user: RequestUser) {
    // Count per status and also if isActive is true or false
    // const { is_active } = dto;

    // const whereCondition: Prisma.ApplicantWhereInput = {
    //   ...(is_active !== undefined && { is_active }),
    // };

    // Auth check first
    const requestUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { user_roles: true },
    });

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

    const whereCondition: Prisma.ApplicantWhereInput = {
      is_active: true,
      // ...(is_active === true)
    };

    // Execute queries
    const [counts] = await Promise.all([
      this.prisma.applicant.groupBy({
        by: ['application_status'],
        where: whereCondition, // This is {} if filter is empty, meaning "Fetch All"
        _count: { _all: true },
      }),
      this.prisma.applicant.count({
        where: { is_active: true }, // We always want this count regardless of the filter
      }),
    ]);

    // Build the response object with defaults
    const result = {
      all: 0,
      applied: 0,
      shortlisted: 0,
      screening: 0,
      for_interview: 0,
      accepted: 0,
      rejected: 0,
      onboarding: 0,
      // isActive: totalActiveCount,
    };

    // Populate the result based on the DB response
    counts.forEach((item) => {
      const statusKey = item.application_status.toLowerCase();

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
      status: 'success',
      message: 'Here is the status count for applicants',
      result,
    };
  }

  async screenApplicant(applicantId: string, user: RequestUser) {
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
      const screenApplicant = await tx.applicant.update({
        where: {
          id: applicantId,
          application_status: ApplicationStatus.applied,
        },
        data: {
          application_status: ApplicationStatus.shortlisted,
          updated_by: requestUser.id,
        },
      });

      await tx.workflowAction.create({
        data: {
          actionable_type: WORKFLOW_ENTITY.APPLICANT,
          actionable_id: applicantId,
          action: WorkflowActionType.shortlisting,
          acted_by: user.id,
        },
      });

      const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
      const userPosition = requestUser.employee.position.name;

      return {
        status: 'success',
        message: 'Applicant has been shortlisted',
        screenApplicant,
        shortlisted_by: `${userName} - ${userPosition}`,
      };
    });
  }

  async forInterview(applicantId: string, user: RequestUser) {
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
      const forInterview = await tx.applicant.findFirst({
        where: { id: applicantId },
      });

      if (forInterview?.application_status !== ApplicationStatus.shortlisted) {
        throw new BadRequestException('Invalid! status must be: shortlisted');
      }

      const verifyForInterview = await tx.applicant.update({
        where: {
          id: applicantId,
          application_status: ApplicationStatus.shortlisted,
        },
        data: {
          application_status: ApplicationStatus.for_interview,
          updated_by: requestUser.id,
        },
      });

      await tx.workflowAction.create({
        data: {
          actionable_type: WORKFLOW_ENTITY.APPLICANT,
          actionable_id: applicantId,
          action: WorkflowActionType.interview_scheduling,
          acted_by: user.id,
        },
      });

      const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
      const userPosition = requestUser.employee.position.name;

      return {
        status: 'success',
        message: 'Applicant has been set for interview',
        verifyForInterview,
        set_by: `${userName} - ${userPosition}`,
      };
    });
  }

  async accepted(applicantId: string, user: RequestUser) {
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
      const forAcceptance = await tx.applicant.findFirst({
        where: { id: applicantId, application_status: 'for_interview' },
      });

      if (forAcceptance?.completed_interview !== true) {
        throw new BadRequestException(
          'Invalid! Interview Stage must be completed first before acceptance.',
        );
      }

      const accepted = await tx.applicant.update({
        where: {
          id: applicantId,
          application_status: ApplicationStatus.for_interview,
        },
        data: {
          application_status: ApplicationStatus.accepted,
          updated_by: requestUser.id,
        },
      });

      if (accepted.completed_interview !== true) {
        throw new BadRequestException(
          'Invalid! Applicant must complete Interview stage first to be accepted.',
        );
      }

      await tx.workflowAction.create({
        data: {
          actionable_type: WORKFLOW_ENTITY.APPLICANT,
          actionable_id: applicantId,
          action: WorkflowActionType.acceptance,
          acted_by: user.id,
        },
      });

      const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
      const userPosition = requestUser.employee.position.name;

      return {
        status: 'success',
        message: 'Applicant has been accepted',
        accepted,
        accepted_by: `${userName} - ${userPosition}`,
      };
    });
  }

  async onBoarding(applicantId: string, user: RequestUser) {
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
      const checkStatus = await tx.applicant.findUnique({
        where: { id: applicantId },
      });

      if (
        !checkStatus ||
        checkStatus.application_status !== ApplicationStatus.accepted
      ) {
        throw new BadRequestException(
          'Applicant must be accepted first before can be onboarded',
        );
      }

      const onBoard = await tx.applicant.update({
        where: {
          id: applicantId,
          application_status: ApplicationStatus.accepted,
        },
        data: {
          application_status: ApplicationStatus.onboarding,
          updated_by: requestUser.id,
        },
      });

      const currentUser = await tx.user.findUnique({
        where: {
          id: requestUser.id,
        },
        select: {
          id: true,
          employee: {
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

      const onboarderName = currentUser
        ? [
            currentUser.employee.person.first_name,
            currentUser.employee.person.middle_name,
            currentUser.employee.person.last_name,
          ]
            .filter(Boolean)
            .join(' ')
        : '';

      await tx.workflowAction.create({
        data: {
          actionable_type: WORKFLOW_ENTITY.APPLICANT,
          actionable_id: applicantId,
          action: ApplicationStatus.onboarding,
          acted_by: requestUser.id,
          acted_at: new Date(),
          metadata: {
            title: 'Applicant onboarded',
            message: 'You have onboarded an Applicant',
            user: onboarderName,
            role: 'recruiter',
          },
        },
      });

      const userName = `${requestUser.employee.person?.first_name} ${requestUser.employee.person?.last_name}`;
      const userPosition = requestUser.employee.position?.name;

      return {
        status: 'success',
        message: 'Applicant is now Onboard',
        onBoard,
        onboarded_by: `${userName} - ${userPosition}`,
      };
    });
  }

  async reject(applicantId: string, user: RequestUser) {
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
      const checkStatus = await tx.applicant.findUnique({
        where: { id: applicantId },
      });

      if (
        !checkStatus ||
        checkStatus.application_status === ApplicationStatus.onboarding
      ) {
        throw new BadRequestException(
          'Applicant is now onboarded cannot be rejected',
        );
      }

      const reject = await tx.applicant.update({
        where: {
          id: applicantId,
        },
        data: {
          application_status: ApplicationStatus.rejected,
          updated_by: requestUser.id,
        },
      });

      await tx.workflowAction.create({
        data: {
          actionable_type: WORKFLOW_ENTITY.APPLICANT,
          actionable_id: applicantId,
          action: WorkflowActionType.rejection,
          acted_by: requestUser.id,
        },
      });

      const userName = `${requestUser.employee.person?.first_name} ${requestUser.employee.person?.last_name}`;
      const userPosition = requestUser.employee.position?.name;

      return {
        status: 'success',
        message: 'Applicant has been rejected',
        reject,
        rejected_by: `${userName} - ${userPosition}`,
      };
    });
  }

  // Interview API
  async getInterviews(user: RequestUser) {
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

    const existingInterviews = await this.prisma.interviewer.findMany({
      include: {
        applicant: true,
        employee: {
          select: {
            id: true,
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

    const grouped = Object.values(
      existingInterviews.reduce<
        Record<string, { applicant: any; interviews: any[] }>
      >((acc, interview) => {
        const applicantId = String(interview.applicant_id);

        if (!acc[applicantId]) {
          acc[applicantId] = {
            applicant: interview.applicant,
            interviews: [],
          };
        }

        acc[applicantId].interviews.push({
          id: interview.id,
          employee: interview.employee,
          stage: interview.stage,
          date_of_interview: interview.date_of_interview,
          is_completed: interview.is_completed,
          remarks: interview.remarks,
          total_points: interview.total_points,
          recommendations: interview.recommendations,
        });

        return acc;
      }, {}),
    );

    return {
      status: 'success',
      message: 'List of Interviews',
      interviews: grouped,
    };
  }

  async assignInterviewPanel(user: RequestUser, dto: BulkAssignInterviewDto) {
    const { applicant_id, interviews } = dto;

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
      const existingApplicant = await tx.applicant.findFirst({
        where: {
          id: applicant_id,
          is_active: true,
        },
      });

      if (existingApplicant?.application_status !== 'for_interview') {
        throw new BadRequestException(
          'Invalid! Applicant application status must be for_interview to proceed.',
        );
      }

      const existingInterview = await tx.interviewer.findFirst({
        where: {
          applicant_id,
        },
      });

      if (existingInterview) {
        throw new BadRequestException(
          'Interview panel has already been assigned for this applicant.',
        );
      }

      const stages = interviews.map((i) => i.stage);

      const existingStages = await tx.interviewer.findMany({
        where: {
          applicant_id,
          stage: {
            in: stages,
          },
        },
        select: {
          stage: true,
        },
      });

      if (existingStages.length > 0) {
        throw new BadRequestException(
          `Interview stage(s) already exist: ${existingStages
            .map((s) => s.stage)
            .join(', ')}.`,
        );
      }

      const employeeIds = interviews.map((i) => i.employee_id);

      const existingEmployees = await tx.interviewer.findMany({
        where: {
          applicant_id,
          employee_id: {
            in: employeeIds,
          },
        },
        select: {
          employee_id: true,
        },
      });

      if (existingEmployees.length > 0) {
        throw new BadRequestException(
          'One or more interviewers are already assigned.',
        );
      }

      const conflicts = await tx.interviewer.findMany({
        where: {
          OR: interviews.map((i) => ({
            employee_id: i.employee_id,
            date_of_interview: new Date(i.date_of_interview),
          })),
        },
        include: {
          applicant: true,
        },
      });

      if (conflicts.length > 0) {
        throw new BadRequestException(
          'One or more interviewers are already scheduled at the selected date and time.',
        );
      }

      //map the ids to the data structure
      const dataToCreate = interviews.map((interview) => ({
        applicant_id,
        employee_id: interview.employee_id,
        stage: interview.stage,
        date_of_interview: new Date(interview.date_of_interview),
        remarks: '',
        created_by: user.id,
      }));

      // Optional: validate length (must be 3)
      // if (interviewers.length !== 3) {
      //     throw new Error('You must assign exactly 3 interviewers');
      // }

      // if (!Object.values(InterviewStage)) {
      //     throw new ForbiddenException('Error! Please use initial, second, third');
      // }

      //using createmany for better perfomance than mapping multi create calls
      await tx.interviewer.createMany({
        data: dataToCreate,
      });

      const interviewPanel = await tx.interviewer.findMany({
        where: {
          applicant_id,
        },
        orderBy: {
          date_of_interview: 'asc',
        },
      });

      return {
        status: 'success',
        message: 'Assigned interview panel for this applicant successful',
        interviewPanel,
      };
    });
  }

  async assessInterviewPanel(
    user: RequestUser,
    dto: AssessInterviewDto,
    interviewId: string,
  ) {
    const { ratings, ...assessmentData } = dto;

    // auth check first
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

    // Fetch current interviewer and their stage
    const currentInterviewer = await this.prisma.interviewer.findUnique({
      where: { id: interviewId },
    });

    if (!currentInterviewer) {
      throw new NotFoundException('Interview record not found');
    }

    if ((currentInterviewer.total_points ?? 0) > 0) {
      throw new BadRequestException(
        'This interview has already been assessed.',
      );
    }

    if (currentInterviewer.employee_id !== requestUser.employee.id) {
      throw new ForbiddenException('You are not assigned to this interview.');
    }

    const applicant = await this.prisma.applicant.findUnique({
      where: {
        id: currentInterviewer.applicant_id,
      },
    });

    if (!applicant) {
      throw new NotFoundException('Applicant not found');
    }

    if (applicant.application_status !== 'for_interview') {
      throw new BadRequestException(
        'Applicant is not currently in interview stage.',
      );
    }

    const stage = currentInterviewer.stage;

    // Sequential Logic Check
    if (stage !== InterviewStage.initial) {
      const previousStage =
        stage === InterviewStage.final
          ? InterviewStage.second
          : InterviewStage.initial;

      const prevAssessment = await this.prisma.interviewer.findFirst({
        where: {
          applicant_id: currentInterviewer.applicant_id,
          stage: previousStage,
          is_completed: true,
        },
      });

      // Check if previous stage is "done" (e.g., total_points is still 0 or recommendations is empty)
      if (!prevAssessment || prevAssessment.total_points === 0) {
        throw new ForbiddenException(
          `Cannot assess the ${currentInterviewer.stage} stage until the ${previousStage} stage is completed.`,
        );
      }
    }

    // Transaction: Update Interviewer + Create Ratings
    return await this.prisma.$transaction(async (tx) => {
      // Update the interviewer record
      const updated = await tx.interviewer.update({
        where: { id: interviewId },
        data: {
          ...assessmentData,
          is_completed: true,
          updated_by: user.id,
        },
      });

      // If this is the final interview stage, mark the applicant as having completed all interviews
      if (currentInterviewer.stage === InterviewStage.final) {
        await tx.applicant.update({
          where: {
            id: currentInterviewer.applicant_id,
          },
          data: {
            completed_interview: true,
            updated_by: user.id,
          },
        });
      }

      // Create the exam ratings
      if (ratings.length > 0) {
        await tx.examinationRating.createMany({
          // data: ratings.map((r) => ({
          //   ...r,
          //   interviewer_id: interviewer_id,
          //   created_by: user.id,
          // })),
          data: ratings.map((rating) => ({
            exam_name: rating.exam_name,
            result: rating.result,
            remarks: rating.remarks,
            interviewer_id: interviewId,
            created_by: user.id,
          })),
        });
      }

      return updated;
    });
  }
}
