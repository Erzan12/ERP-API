import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import {
  CreateIncidentReportDto,
  UpdateIncidentReportDto,
} from './dto/incident-report.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { HrErIntakeStatus, HrErIntakeType, Prisma } from '@prisma/client';
import { IncidentReportPaginationDto } from 'src/utils/dtos/er-related-pagination.dto';

@Injectable()
export class IncidentReportService {
  constructor(private readonly prisma: PrismaService) {}

  // Helper for auth check
  private async assertHrAccess(userId: string) {
    const requestUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        employee: { include: { person: true, position: true } },
        user_roles: true,
      },
    });

    if (!requestUser?.employee?.person) {
      throw new BadRequestException('User does not exist.');
    }

    const allowedRoles = [
      'Administrator',
      'Super Administrator',
      'HR Administrator',
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

    return requestUser;
  }

  async getIncidentReports(
    dto: IncidentReportPaginationDto,
    user: RequestUser,
  ) {
    const { search, sortBy, order, page, perPage } = dto;

    await this.assertHrAccess(user.id);

    const skip = (page - 1) * perPage;

    const whereCondition: Prisma.HrErCaseIntakeWhereInput = {
      type: HrErIntakeType.incident,
    };

    if (search?.trim()) {
      whereCondition.OR = [];
    }

    const allowSortFields = ['id', 'created_at', 'updated_at'];

    const safeSortBy = allowSortFields.includes(sortBy) ? sortBy : 'created_at';

    const [total, incidentReports] = await this.prisma.$transaction([
      this.prisma.hrErCaseIntake.count({
        where: {
          ...whereCondition,
        },
      }),
      this.prisma.hrErCaseIntake.findMany({
        where: {
          ...whereCondition,
        },
        select: {
          id: true,
          incident_narrative: true,
          incident_location_id: true,
          incident_location_type: true,
          incident_date: true,
          type: true,
          status: true,
          created_by: true,
          updated_by: true,
          created_at: true,
          updated_at: true,
          createdBy: {
            select: {
              employee: {
                select: {
                  id: true,
                  company: {
                    select: {
                      id: true,
                      name: true,
                      abbreviation: true,
                    },
                  },
                  person: {
                    select: {
                      first_name: true,
                      middle_name: true,
                      last_name: true,
                    },
                  },
                  employee_id: true,
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
                    },
                  },
                  division: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                  vessel: true,
                  user_location: {
                    select: {
                      id: true,
                      location_name: true,
                    },
                  },
                  salary_grade: {
                    select: {
                      id: true,
                      grade: true,
                      rate: true,
                    },
                  },
                },
              },
              person: {
                select: {
                  first_name: true,
                  middle_name: true,
                  last_name: true,
                },
              },
            },
          },
          case: true,
          parties: {
            select: {
              id: true,
              employee: {
                select: {
                  id: true,
                  company: {
                    select: {
                      id: true,
                      name: true,
                      abbreviation: true,
                    },
                  },
                  person: {
                    select: {
                      first_name: true,
                      middle_name: true,
                      last_name: true,
                    },
                  },
                  employee_id: true,
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
                    },
                  },
                  division: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                  vessel: true,
                  user_location: {
                    select: {
                      id: true,
                      location_name: true,
                    },
                  },
                  salary_grade: {
                    select: {
                      id: true,
                      grade: true,
                      rate: true,
                    },
                  },
                },
              },
              role: true,
            },
          },
          // violations: true,
          attachments: true,
          offenses: {
            select: {
              id: true,
              offense: {
                select: {
                  id: true,
                  type_of_offense: true,
                  description: true,
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

    // if (incidentReports.length === 0) {
    //     throw new NotFoundException('No incident reports found.');
    // }

    const formattedIncidentReports = incidentReports.map((incident) => ({
      ...incident,
      offenses: incident.offenses.map(({ offense }) => offense),
    }));

    return {
      status: 'success',
      message: 'Here is the list of Incident Reports.',
      count: total,
      page,
      perPage,
      incidentReports: formattedIncidentReports,
    };
  }

  async getIncidentReport(incidentReportId: string, user: RequestUser) {
    await this.assertHrAccess(user.id);

    const incidentReport = await this.prisma.hrErCaseIntake.findUnique({
      where: { id: incidentReportId },
      select: {
        id: true,
        incident_narrative: true,
        incident_location_id: true,
        incident_location_type: true,
        incident_date: true,
        type: true,
        status: true,
        created_by: true,
        updated_by: true,
        created_at: true,
        updated_at: true,
        createdBy: {
          select: {
            employee: {
              select: {
                id: true,
                company: {
                  select: {
                    id: true,
                    name: true,
                    abbreviation: true,
                  },
                },
                person: {
                  select: {
                    first_name: true,
                    middle_name: true,
                    last_name: true,
                  },
                },
                employee_id: true,
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
                  },
                },
                division: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                vessel: true,
                user_location: {
                  select: {
                    id: true,
                    location_name: true,
                  },
                },
                salary_grade: {
                  select: {
                    id: true,
                    grade: true,
                    rate: true,
                  },
                },
              },
            },
            person: {
              select: {
                first_name: true,
                middle_name: true,
                last_name: true,
              },
            },
          },
        },
        case: true,
        parties: {
          select: {
            id: true,
            employee: {
              select: {
                id: true,
                company: {
                  select: {
                    id: true,
                    name: true,
                    abbreviation: true,
                  },
                },
                person: {
                  select: {
                    first_name: true,
                    middle_name: true,
                    last_name: true,
                  },
                },
                employee_id: true,
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
                  },
                },
                division: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                vessel: true,
                user_location: {
                  select: {
                    id: true,
                    location_name: true,
                  },
                },
                salary_grade: {
                  select: {
                    id: true,
                    grade: true,
                    rate: true,
                  },
                },
              },
            },
            role: true,
          },
        },
        // violations: true,
        attachments: true,
        offenses: {
          select: {
            id: true,
            offense: {
              select: {
                id: true,
                type_of_offense: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!incidentReport) {
      throw new NotFoundException('Incident Report does not exists.');
    }

    const formattedIncidentReport = {
      ...incidentReport,
      offenses: incidentReport.offenses.map(({ offense }) => offense),
    };

    return {
      status: 'success',
      message: 'Here is the Incident Report',
      incidentReport: formattedIncidentReport,
    };
  }

  async createIncidentReport(dto: CreateIncidentReportDto, user: RequestUser) {
    await this.assertHrAccess(user.id);

    const location = await this.prisma.workAssignment.findFirst({
      where: {
        id: dto.incident_location_id,
      },
    });

    if (!location) {
      throw new BadRequestException('Invalid incident location');
    }

    const incidentReport = await this.prisma.hrErCaseIntake.create({
      data: {
        type: HrErIntakeType.incident,
        // incident_location: dto.incident_location,
        incident_location_id: dto.incident_location_id,
        incident_location_type: location.type,
        incident_date: new Date(dto.incident_date),
        incident_narrative: dto.incident_narrative,
        status: HrErIntakeStatus.draft,
        created_by: user.id,

        parties: {
          create: dto.parties.map((p) => ({
            employee: {
              connect: {
                id: p.employee_id,
              },
            },
            role: p.role,
          })),
        },

        offenses: {
          create: dto.offense_ids.map((offense_id) => ({
            offense: {
              connect: {
                id: offense_id,
              },
            },
          })),
        },
      },
      include: {
        parties: {
          include: {
            employee: true,
          },
        },
        offenses: {
          include: {
            offense: true,
          },
        },
      },
    });

    return {
      status: 'success',
      message: 'Incident Report successfully created.',
      incidentReport,
    };
  }

  async updateIncidentReport(
    incidentReportId: string,
    dto: UpdateIncidentReportDto,
    user: RequestUser,
  ) {
    await this.assertHrAccess(user.id);

    const existingIncidentReport = await this.prisma.hrErCaseIntake.findUnique({
      where: { id: incidentReportId },
    });

    if (!existingIncidentReport) {
      throw new NotFoundException('Incident Report does not exist');
    }

    const updateIncidentReport = await this.prisma.hrErCaseIntake.update({
      where: { id: incidentReportId },
      data: {
        incident_location_id:
          dto.incident_location_id ??
          existingIncidentReport.incident_location_id,
        incident_date:
          dto.incident_date ?? existingIncidentReport.incident_date,
        incident_narrative:
          dto.incident_narrative ?? existingIncidentReport.incident_narrative,
        // subject: dto.subject ?? existingIncidentReport.subject,
        updated_by: user.id,

        ...(dto.parties !== undefined && {
          parties: {
            deleteMany: {},
            create: dto.parties.map((p) => ({
              employee: {
                connect: {
                  id: p.employee_id,
                },
              },
              role: p.role,
            })),
          },
        }),
        ...(dto.offense_ids !== undefined && {
          offenses: {
            deleteMany: {},
            create: dto.offense_ids.map((offense_id) => ({
              offense: {
                connect: {
                  id: offense_id,
                },
              },
            })),
          },
        }),
      },
      include: {
        parties: {
          include: {
            employee: true,
          },
        },
        offenses: {
          include: {
            offense: true,
          },
        },
      },
    });

    return {
      status: 'success',
      message: 'Incident Report successfully updated.',
      updateIncidentReport,
    };
  }

  async submitIncidentReport(incidentReportId: string, user: RequestUser) {
    await this.assertHrAccess(user.id);

    const existingIncidentReport = await this.prisma.hrErCaseIntake.findUnique({
      where: { id: incidentReportId },
    });

    if (!existingIncidentReport) {
      throw new NotFoundException('Incident Report does not exist');
    }

    if (existingIncidentReport.status === HrErIntakeStatus.submitted) {
      throw new ConflictException('Incident Report already submitted');
    }

    const submitIncidentReport = await this.prisma.hrErCaseIntake.update({
      where: { id: incidentReportId },
      data: {
        status: HrErIntakeStatus.submitted,
        updated_by: user.id,
      },
    });

    return {
      status: 'success',
      message: 'Incident Report successfully submitted.',
      submitIncidentReport,
    };
  }

  async cancelIncidentReport(incidentReportId: string, user: RequestUser) {
    await this.assertHrAccess(user.id);

    const existingIncidentReport = await this.prisma.hrErCaseIntake.findUnique({
      where: { id: incidentReportId },
    });

    if (!existingIncidentReport) {
      throw new NotFoundException('Incident Report does not exist');
    }

    if (
      existingIncidentReport.status === HrErIntakeStatus.submitted ||
      existingIncidentReport.status === HrErIntakeStatus.processed
    ) {
      throw new BadRequestException(
        'Incident Report is already submitted or is now processed and cannot be cancelled anymore.',
      );
    }

    const cancelIncidentReport = await this.prisma.hrErCaseIntake.update({
      where: { id: incidentReportId },
      data: {
        status: HrErIntakeStatus.cancelled,
        updated_by: user.id,
      },
    });

    return {
      status: 'success',
      message: 'Incident Report cancelled',
      cancelIncidentReport,
    };
  }
}
