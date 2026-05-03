import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CreateApplicantDto, UpdateApplicantDto } from './dto/applicant.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import {
  RecruitmentPaginationDto,
} from 'src/utils/dtos/recruitment-pagination.dto';
import {
  ApplicationStatus,
  InterviewStage,
} from 'src/utils/decorators/global.enums.decorator';
import { BulkAssignInterviewDto } from './dto/bulk-assign-interviewer.dto';
import { AssessInterviewDto } from './dto/assess-interviewer.dto';
import { Prisma } from '@prisma/client';
import { AttachmentUploadService } from 'src/jobs/attachment-upload/attachment-upload.service';
import { WORKFLOW_ENTITY } from 'src/utils/constants/workflow-entity.constant';

@Injectable()
export class HiringPipelineService {
  constructor(
    private prisma: PrismaService,
    private uploadService: AttachmentUploadService
  ) {}

  async getApplicant(applicantId: string, user: RequestUser) {

    // Auth check first
    const requestUser = await this.prisma.user.findUnique({
        where: { id: user.id },
        include: { user_roles: true }
    });

    const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
    const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));

    if (!canView) {
        throw new ForbiddenException('You are not authorized to perform this action');
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

  async getApplicants(user: RequestUser, dto: RecruitmentPaginationDto) {
    const { search, status, sortBy, order, page, perPage } = dto;

    // Auth check first
    const requestUser = await this.prisma.user.findUnique({
        where: { id: user.id },
        include: { user_roles: true }
    });

    const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
    const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));

    if (!canView) {
        throw new ForbiddenException('You are not authorized to perform this action');
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

    const allowSortFeilds = [
      'career_id',
      'application_source',
      'applicaiton_status',
      'date_applied',
      'created_by',
    ];

    // if (!allowSortFeilds.includes(sortBy)) {
    //   sortBy;
    // }
    const safeSortBy = allowSortFeilds.includes(sortBy) ? sortBy : 'created_at';
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

    const applicantIds = findApplicants.map(a => a.id);

    const attachments = await this.prisma.attachments.findMany({
      where: {
        transaction_type: 'Applicant',
        transaction_id: { in: applicantIds },
      },
    });

    const attachmentMap = new Map<string, any[]>();

    for (const file of attachments) {
      const list = attachmentMap.get(file.transaction_id) || [];
      list.push(file);
      attachmentMap.set(file.transaction_id, list);
    }

    const applicants = findApplicants.map(applicant => ({
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
    createApplicantDto: CreateApplicantDto,
    user: RequestUser,
    files: Express.Multer.File[]
  ) {
    const { career_id, application_source } =
      createApplicantDto;

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

    const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
    const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));

    if (!canView) {
      throw new ForbiddenException('You are not authorized to perform this action');
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
        // application_status,
        date_applied: new Date(createApplicantDto.date_applied),
        created_by: user.id,
      },
    });

    const attachments = await this.uploadService.attachFiles({
      files,
      transaction_type: 'Applicant',
      transaction_id: applicant.id,
      // file_desc: file_desc,
      user_id: user.id,
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
  }

  async updateApplicant(
    applicantId: string,
    updateApplicantDto: UpdateApplicantDto,
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

    const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
    const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));

    if (!canView) {
      throw new ForbiddenException('You are not authorized to perform this action');
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

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPosition = requestUser.employee.position.name;

    return {
      status: 'success',
      message: `Job/Career posting has been updated successfully!`,
      applicant,
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
        include: { user_roles: true }
    });

    const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
    const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));

    if (!canView) {
        throw new ForbiddenException('You are not authorized to perform this action');
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

  async shortlisted(applicantId: string, user: RequestUser) {
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

    const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
    const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));

    if (!canView) {
        throw new ForbiddenException('You are not authorized to perform this action');
    }

    return this.prisma.$transaction(async (tx) => {
      const shortlist = await tx.applicant.update({
        where: { id: applicantId, application_status: "applied" },
        data: {
          application_status: "shortlisted",
          updated_by: requestUser.id
        }
      });

      await tx.workflowAction.create({
        data: {
          actionable_type: WORKFLOW_ENTITY.APPLICANT,
          actionable_id: applicantId,
          action: "shortlist",
          acted_by: user.id
        }
      });

      const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
      const userPosition = requestUser.employee.position.name;

      return {
          status: 'success',
          message: 'Applicant has been shortlisted',
          shortlist,
          shortlisted_by: `${userName} - ${userPosition}`,
      };
    })
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

    const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
    const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));

    if (!canView) {
        throw new ForbiddenException('You are not authorized to perform this action');
    }

    return this.prisma.$transaction(async (tx) => {
      const forInterview = await tx.applicant.update({
        where: { id: applicantId, application_status: "shortlisted" },
        data: {
          application_status: "for_interview",
          updated_by: requestUser.id,
        }
      });

      await tx.workflowAction.create({
        data: {
          actionable_type: WORKFLOW_ENTITY.APPLICANT,
          actionable_id: applicantId,
          action: "set_interview",
          acted_by: user.id
        }
      });

      const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
      const userPosition = requestUser.employee.position.name;

      return {
          status: 'success',
          message: 'Applicant has been set for interview',
          forInterview,
          set_by: `${userName} - ${userPosition}`,
      };
    })
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

    const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
    const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));

    if (!canView) {
        throw new ForbiddenException('You are not authorized to perform this action');
    }

    return this.prisma.$transaction(async (tx) => {
      const accepted = await tx.applicant.update({
        where: { id: applicantId, application_status: "for_interview" },
        data: {
          application_status: "accepted",
          updated_by: requestUser.id
        }
      });

      await tx.workflowAction.create({
        data: {
          actionable_type: WORKFLOW_ENTITY.APPLICANT,
          actionable_id: applicantId,
          action: "accept",
          acted_by: user.id
        }
      });

      const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
      const userPosition = requestUser.employee.position.name;

      return {
          status: 'success',
          message: 'Applicant has been accepted',
          accepted,
          accepted_by: `${userName} - ${userPosition}`,
      };
    })
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

    const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
    const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));

    if (!canView) {
        throw new ForbiddenException('You are not authorized to perform this action');
    }

    return this.prisma.$transaction(async (tx) => {
      try {
        const checkStatus = await tx.applicant.findUnique({
          where: { id: applicantId }
        })

        if (!checkStatus || checkStatus.application_status !== "accepted") {
          throw new BadRequestException("Applicant must be accepted first before can be onboarded");
        }

        const onBoard = await tx.applicant.update({
          where: { id: applicantId, application_status: "accepted" },
          data: {
            application_status: "onboarding",
            updated_by: requestUser.id
          }
        });

        await tx.workflowAction.create({
          data: {
            actionable_type: WORKFLOW_ENTITY.APPLICANT,
            actionable_id: applicantId,
            action: "onboard",
            acted_by: requestUser.id
          }
        })

        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPosition = requestUser.employee.position.name;

        return {
          status: 'success',
          message: 'Applicant is now Onboard',
          onBoard,
          onboarded_by: `${userName} - ${userPosition}`,
        }
      } catch (e) {
        if (e instanceof BadRequestException) {
            throw e; // keep your validation errors
        }
        throw new Error ('Leave Request cannot be approved')
      }
    })
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

    const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
    const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));

    if (!canView) {
        throw new ForbiddenException('You are not authorized to perform this action');
    }

    return this.prisma.$transaction(async (tx) => {
      try {
          const checkStatus = await tx.applicant.findUnique({
            where: { id: applicantId }
          })

          if (!checkStatus || checkStatus.application_status === "onboarding") {
            throw new BadRequestException("Applicant is now onboarding cannot be rejected");
          }

          const reject = await tx.applicant.update({
            where: { 
              id: applicantId
            },
            data: {
              application_status: 'rejected',
              updated_by: requestUser.id
            }
          });

          await tx.workflowAction.create({
            data: {
              actionable_type: WORKFLOW_ENTITY.APPLICANT,
              actionable_id: applicantId,
              action: 'reject',
              acted_by: requestUser.id
            }
          });

          const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
          const userPosition = requestUser.employee.position.name;

          return {
            status: 'success',
            message: 'Applicant has been rejected',
            reject,
            rejected_by: `${userName} - ${userPosition}`,
          }
      } catch (e) {
        if (e instanceof BadRequestException) {
            throw e; // keep your validation errors
        }
        // throw new Error ('Applicant cannot be rejected')
      }
    })
  }
}

/**
 * SCREENING SERVICE SECTION
 */

// export class ScreeningApplicantService {
//   constructor(private prisma: PrismaService) {}

//   async screenApplicant(applicantId: string, files: UploadedFileDto[], user: RequestUser) {
//     const screenApplicant = await this.prisma.applicant.findUnique({
//       where: { id: applicantId },
//       include: {
//         applicant: true,
//         createdBy: {
//           select: {
//             person: {
//               select: {
//                 first_name: true,
//                 middle_name: true,
//                 last_name: true,
//               }
//             }
//           }
//         },
//         updatedBy: {
//           select: {
//             person: {
//               select: {
//                 first_name: true,
//                 middle_name: true,
//                 last_name: true,
//               }
//             }
//           }
//         }
//       }
//     });

//     if (!screenApplicant) {
//       throw new NotFoundException('Applicant not found')
//     }

//     const requestUser = await this.prisma.user.findUnique({
//       where: { id: user.id },
//       include: {
//         employee: {
//           include: {
//             person: true,
//             position: true,
//           },
//         },
//         user_roles: true,
//       },
//     });

//     if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
//       throw new BadRequestException(`User does not exist.`);
//     }

//     const allowedRoles = [
//       'Administrator',
//       'Super Administrator',
//       'HR Manager',
//       'HR Clerk',
//       'HR Staff',
//     ];

//     const canView = requestUser.user_roles.some((role) =>
//       allowedRoles.includes(role.role_name),
//     );

//     if (!canView) {
//       throw new ForbiddenException(
//         'You are not authorized to perform this action',
//       );
//     }

//     return {
//       status: 'success',
//       message: 'Here is the Applicant.',
//       screenApplicant,
//     };
//   }
// }

/**
 * INTERVIEW SERVICE SECTION
 */

export class InterviewApplicantService {
  constructor(private prisma: PrismaService) {}

  async assignInterviewPanel(user: RequestUser, dto: BulkAssignInterviewDto) {
    const { applicant_id, interviewer_ids, date_of_interview } = dto;

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

    const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
    const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));

    if (!canView) {
      throw new ForbiddenException('You are not authorized to perform this action');
    }

    const stages = [
      InterviewStage.INITIAL,
      InterviewStage.SECOND,
      InterviewStage.FINAL,
    ];

    //map the ids to the data structure
    const dataToCreate = interviewer_ids.map((employee_id, index) => ({
      employee_id,
      applicant_id,
      stage: stages[index],
      remarks: '',
      date_of_interview: date_of_interview,
      // total_points: 0,
      // recommendations: '',
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
    return await this.prisma.interviewer.createMany({
      data: dataToCreate,
    });
  }

  async assessInterviewPanel(user: RequestUser, dto: AssessInterviewDto) {
    const { interviewer_id, ratings, ...assessmentData } = dto;

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

    const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
    const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));

    if (!canView) {
      throw new ForbiddenException('You are not authorized to perform this action');
    }

    // Fetch current interviewer and their stage
    const currentInterviewer = await this.prisma.interviewer.findUnique({
      where: { id: interviewer_id },
    });

    if (!currentInterviewer)
      throw new NotFoundException('Interviewer record not found');

    // Sequential Logic Check
    if (
      (currentInterviewer.stage as InterviewStage) !== InterviewStage.INITIAL
    ) {
      const previousStage =
        (currentInterviewer.stage as InterviewStage) === InterviewStage.FINAL
          ? InterviewStage.SECOND
          : InterviewStage.INITIAL;

      const prevAssessment = await this.prisma.interviewer.findFirst({
        where: {
          applicant_id: currentInterviewer.applicant_id,
          stage: previousStage,
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
        where: { id: interviewer_id },
        data: {
          ...assessmentData,
          updated_by: user.id,
        },
      });

      // Create the exam ratings
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
