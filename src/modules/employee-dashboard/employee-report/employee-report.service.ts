import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import {
  CreateEmployeeReportDto,
  UpdateEmployeeReportDto,
} from './dto/employee-report.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { HrErIntakeStatus, HrErIntakeType, Prisma } from '@prisma/client';
import { EmployeeReportPaginationDto } from 'src/utils/dtos/er-related-pagination.dto';

@Injectable()
export class EmployeeReportService {
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

  async getEmployeeReports(
    dto: EmployeeReportPaginationDto,
    user: RequestUser,
  ) {
    const { search, sortBy, order, page, perPage } = dto;

    await this.assertHrAccess(user.id);

    const skip = (page - 1) * perPage;

    const whereCondition: Prisma.HrErCaseIntakeWhereInput = {
      type: HrErIntakeType.employee,
    };

    if (search?.trim()) {
      whereCondition.OR = [];
    }

    const allowSortFields = ['id', 'created_at', 'updated_at'];

    const safeSortBy = allowSortFields.includes(sortBy) ? sortBy : 'created_at';

    const [total, employeeReports] = await this.prisma.$transaction([
      this.prisma.hrErCaseIntake.count({
        where: {
          ...whereCondition,
        },
      }),
      this.prisma.hrErCaseIntake.findMany({
        where: {
          ...whereCondition,
        },
        include: {
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
          // offenses: {
          //   select: {
          //     id: true,
          //     offense: {
          //       select: {
          //         id: true,
          //         type_of_offense: true,
          //         description: true,
          //       },
          //     },
          //   },
          // },
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

    // const formattedIncidentReports = employeeReports.map((employee) => ({
    //   ...employee,
    //   offenses: employee.offenses.map(({ offense }) => offense),
    // }))

    return {
      status: 'success',
      message: 'Here is the list of Employee Reports.',
      count: total,
      page,
      perPage,
      employeeReports,
    };
  }

  async getEmployeeReport(employeeReportId: string, user: RequestUser) {
    await this.assertHrAccess(user.id);

    const employeeReport = await this.prisma.hrErCaseIntake.findUnique({
      where: { id: employeeReportId },
      include: {
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
        // offenses: {
        //   select: {
        //     id: true,
        //     offense: {
        //       select: {
        //         id: true,
        //         type_of_offense: true,
        //         description: true,
        //       },
        //     },
        //   },
        // },
      },
    });

    if (!employeeReport) {
      throw new NotFoundException('Employee Report does not exists.');
    }

    // const formatEmployeeReport = {
    //   ...employeeReport,
    //   offenses: employeeReport.offenses.map(({ offense }) => offense),
    // }

    return {
      status: 'success',
      message: 'Here is the Employee Report',
      employeeReport,
    };
  }

  async createEmployeeReport(dto: CreateEmployeeReportDto, user: RequestUser) {
    await this.assertHrAccess(user.id);

    const location = await this.prisma.workAssignment.findFirst({
      where: {
        id: dto.incident_location_id,
      },
    });

    if (!location) {
      throw new BadRequestException('Invalid incident location');
    }

    const employeeReport = await this.prisma.hrErCaseIntake.create({
      data: {
        type: HrErIntakeType.employee,
        incident_location_id: dto.incident_location_id,
        incident_location_type: location.type,
        incident_date: new Date(dto.incident_date),
        incident_narrative: dto.incident_narrative,
        status: HrErIntakeStatus.pending_review,
        subject: dto.subject,
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
      },
      include: {
        parties: {
          include: {
            employee: true,
          },
        },
      },
    });

    return {
      status: 'success',
      message: 'Employee Report filed successfully',
      employeeReport,
    };
  }

  async updateEmployeeReport(
    employeeReportId: string,
    dto: UpdateEmployeeReportDto,
    user: RequestUser,
  ) {
    await this.assertHrAccess(user.id);

    const existingEmployeeReport = await this.prisma.hrErCaseIntake.findUnique({
      where: { id: employeeReportId },
    });

    if (!existingEmployeeReport) {
      throw new NotFoundException('Employee Report does not exist');
    }

    const updateEmployeeReport = await this.prisma.hrErCaseIntake.update({
      where: { id: employeeReportId },
      data: {
        incident_location_id:
          dto.incident_location_id ??
          existingEmployeeReport.incident_location_id,
        incident_date:
          dto.incident_date ?? existingEmployeeReport.incident_date,
        incident_narrative:
          dto.incident_narrative ?? existingEmployeeReport.incident_narrative,
        subject: dto.subject ?? existingEmployeeReport.subject,
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
      },
      include: {
        parties: {
          include: {
            employee: true,
          },
        },
      },
    });

    return {
      status: 'success',
      message: 'Employee Report updated successfully',
      updateEmployeeReport,
    };
  }

  async statusCount(user: RequestUser) {
    await this.assertHrAccess(user.id);

    const whereCondition: Prisma.HrErCaseIntakeWhereInput = {};

    // Execute queries 
    const [counts] = await Promise.all([
      this.prisma.hrErCaseIntake.groupBy({
        by: ['status'],
        where: whereCondition,
        _count: { _all: true },
      }),
      this.prisma.hrErCaseIntake.count(),
    ]);

    const result = {
      all: 0,
      ignored: 0,
      cancelled: 0,
      draft: 0,
      submitted: 0,
      processed: 0,
    };

    // Populate the result based on the DB response
    counts.forEach((item) => {
      const statusKey = item.status.toLocaleLowerCase();

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
      message: 'Here is the status count for Employee Reports',
      result,
    };
  }
}
