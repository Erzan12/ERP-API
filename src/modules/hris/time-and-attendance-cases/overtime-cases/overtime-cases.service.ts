import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  EmployeeType,
  EmploymentHistoryType,
  OvertimeStatus,
  Prisma,
} from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { WORKFLOW_ENTITY } from 'src/utils/constants/workflow-entity.constants';
import { OvertimeCasesPaginationDto } from 'src/utils/dtos/overtime-cases-pagination.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { CreateOvertimeCaseDto } from './dto/overtime-case.dto';

@Injectable()
export class OvertimeCasesService {
  constructor(private readonly prisma: PrismaService) {}

  // Current Employment helper
  private async getCurrentEmploymentValue(
    employeeId: string,
    type: EmploymentHistoryType,
  ) {
    const history = await this.prisma.employmentHistory.findFirst({
      where: {
        employee_id: employeeId,
        type,
      },
      orderBy: {
        effectivity_date: 'desc',
      },
    });

    return history?.current_id ?? null;
  }

  // Calculate total hours based on time from and time to
  private calculateTotalHours(timeFrom: string, timeTo: string): number {
    const [fromHour, fromMinute, fromSecond] = timeFrom.split(':').map(Number);
    const [toHour, toMinute, toSecond] = timeTo.split(':').map(Number);

    const from = new Date();
    from.setHours(fromHour, fromMinute, fromSecond, 0);

    const to = new Date();
    to.setHours(toHour, toMinute, toSecond, 0);

    // Handle overnight OT (e.g. 22:00 -> 02:00)
    if (to < from) {
      to.setDate(to.getDate() + 1);
    }

    const diffMs = to.getTime() - from.getTime();

    return Number((diffMs / (1000 * 60 * 60)).toFixed(2));
  }

  // Combine ot_date with the time\
  private combineDateAndTime(date: string, time: string): Date {
    return new Date(`${date}T${time}`);
  }

  async getOvertimeCase(user: RequestUser, overtimeRequestId: string) {
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

    try {
      const overtimeRequest = await this.prisma.hrOvertimeRequest.findUnique({
        where: { id: overtimeRequestId, is_active: true },
        include: {
          employee: {
            select: {
              id: true,
              employee_id: true,
              person: {
                select: {
                  first_name: true,
                  middle_name: true,
                  last_name: true,
                },
              },
              position: {
                select: {
                  id: true,
                  name: true,
                },
              },
              department: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          vessel: {
            select: {
              name: true,
              type: true,
              company: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!overtimeRequest) {
        throw new NotFoundException('Overtime Request not found');
      }

      const workflowActions = await this.prisma.workflowAction.findMany({
        where: {
          actionable_type: WORKFLOW_ENTITY.OVERTIME_REQUEST,
          actionable_id: overtimeRequest.id,
          action: {
            in: ['verification', 'approval'],
          },
        },
        include: {
          acted_by_user: {
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
          },
        },
      });

      const verifier = workflowActions.find((a) => a.action === 'verification');

      const approver = workflowActions.find((a) => a.action === 'approval');

      const overtime = {
        ...overtimeRequest,
        verifier: verifier?.acted_by_user ?? null,
        approver: approver?.acted_by_user ?? null,
      };

      return {
        status: 'success',
        message: 'Here is the Overtime Request',
        overtimeRequest: overtime,
      };
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
    }
  }

  async getOvertimeCases(user: RequestUser, dto: OvertimeCasesPaginationDto) {
    const { search, sortBy, order, page, perPage } = dto;

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

    const skip = (page - 1) * perPage;

    const whereCondition: Prisma.HrOvertimeRequestWhereInput = {
      is_active: true,
    };

    const whereConditions: Prisma.HrOvertimeRequestWhereInput = {};

    if (search) {
      const terms = search.split(' ');

      whereConditions.OR = terms.flatMap((term) => [
        {
          employee: {
            person: {
              first_name: { contains: term, mode: 'insensitive' },
            },
          },
        },
        {
          employee: {
            person: {
              last_name: { contains: term, mode: 'insensitive' },
            },
          },
        },
      ]);
    }

    const allowSortFields = ['created_by'];

    const safeSortBy = allowSortFields.includes(sortBy) ? sortBy : 'created_at';

    const [total, overtimes] = await this.prisma.$transaction([
      this.prisma.hrOvertimeRequest.count({
        where: {
          ...whereCondition,
          ...whereConditions,
        },
      }),
      this.prisma.hrOvertimeRequest.findMany({
        where: {
          ...whereCondition,
          ...whereConditions,
        },
        skip,
        take: perPage,
        orderBy: {
          [safeSortBy]: order,
        },
      }),
    ]);

    const overtimeIds = overtimes.map((l) => l.id);

    const workflowActions = await this.prisma.workflowAction.findMany({
      where: {
        actionable_type: WORKFLOW_ENTITY.OVERTIME_REQUEST,
        actionable_id: {
          in: overtimeIds,
        },
        action: {
          in: ['verification', 'approval'],
        },
      },
      include: {
        acted_by_user: {
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
        },
      },
    });

    const formattedOvertimes = overtimes.map((overtime) => {
      const verifier = workflowActions.find(
        (a) => a.actionable_id === overtime.id && a.action === 'verification',
      );
      const approver = workflowActions.find(
        (a) => a.actionable_id === overtime.id && a.action === 'approval',
      );
      return {
        ...overtime,
        verifier: verifier?.acted_by_user ?? null,
        approver: approver?.acted_by_user ?? null,
      };
    });

    return {
      status: 'success',
      message: 'List of Overtime Cases',
      count: total,
      page,
      perPage,
      overtimes: formattedOvertimes,
    };
  }

  async createOvertimeCase(user: RequestUser, dto: CreateOvertimeCaseDto) {
    const {
      employee_id,
      // vessel_id,
      overtime_rate_id,
      date_filed,
      overtime_date,
      time_from,
      time_to,
      // reason,
    } = dto;

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

    return await this.prisma.$transaction(async (tx) => {
      if (date_filed === null) {
        throw new BadRequestException('Date file cannot be empty!');
      }

      if (overtime_date === null) {
        throw new BadRequestException('OT Date cannot be empty!');
      }

      if (time_from === null) {
        throw new BadRequestException('Time from cannot be empty');
      }

      if (time_to === null) {
        throw new BadRequestException('Time to cannot be empty');
      }

      const employee = await tx.employee.findUnique({
        where: {
          id: employee_id,
        },
        select: {
          id: true,
          employee_type: true,
          user_location_id: true,
          vessel_id: true,
          employment_history: true,
          salary_grade: true,
        },
      });

      if (!employee) {
        throw new NotFoundException('Employee not found');
      }

      const conflict = await tx.hrOvertimeRequest.findFirst({
        where: {
          employee_id: employee_id,
          overtime_date: new Date(dto.overtime_date),
          status: {
            notIn: [OvertimeStatus.cancelled, OvertimeStatus.rejected],
          },
        },
      });

      if (conflict) {
        throw new BadRequestException(
          'Conflicting OT Date exist (active request already exist)',
        );
      }

      const vesselId: string | null = null;
      let userLocationId: string | null = null;

      // console.log(employee.employee_type);
      // console.log(EmployeeType.land_based);
      // console.log(await this.getCurrentEmploymentValue(
      //     employee_id,
      //     EmploymentHistoryType.employee_location,
      // ));

      if (EmployeeType.land_based) {
        userLocationId = await this.getCurrentEmploymentValue(
          employee_id,
          EmploymentHistoryType.employee_location,
        );

        console.log('Assigned userLocationId:', userLocationId);

        if (!userLocationId) {
          throw new BadRequestException(
            'Employee has no assigned work location.',
          );
        }
      }

      const salaryGradeId = await this.getCurrentEmploymentValue(
        employee_id,
        EmploymentHistoryType.salary_grade,
      );

      if (!salaryGradeId) {
        throw new BadRequestException('Employee has no assigned salary grade.');
      }

      const workingDays = EmployeeType.land_based ? 26.08 : 30;

      const monthlySalary = Number(employee.salary_grade?.rate);

      const dailyRate = monthlySalary / workingDays;

      const hourlyRate = dailyRate / 8;

      const perMinuteRate = hourlyRate / 60;

      // if (employee.employee_type === EmployeeType.sea_based) {
      //   vesselId = await this.getCurrentEmploymentValue(
      //       employee_id,
      //       EmploymentHistoryType.vessel,
      //   );

      //   if (!vesselId) {
      //       throw new BadRequestException(
      //           'Employee has no assigned vessel.',
      //       );
      //   }
      // }

      if (vesselId) {
        const vessel = await tx.vessel.findUnique({
          where: { id: vesselId },
        });

        if (!vessel) {
          throw new BadRequestException('Invalid vessel.');
        }
      }

      // if (userLocationId) {
      //   const location = await this.prisma.userLocation.findUnique({
      //     where: { id: userLocationId },
      //   });

      //   if (!location) {
      //     throw new BadRequestException('Invalid work location.');
      //   }
      // }

      const totalHours = this.calculateTotalHours(
        time_from ?? '',
        time_to ?? '',
      );

      const totalMinutes = totalHours * 60;

      const basicPay = totalMinutes * perMinuteRate;

      const timeFrom = this.combineDateAndTime(
        dto.overtime_date,
        dto.time_from!,
      );
      const timeTo = this.combineDateAndTime(dto.overtime_date, dto.time_to!);

      // Overnight OT (22:00 -> 02:00)
      if (timeTo < timeFrom) {
        timeTo.setDate(timeTo.getDate() + 1);
      }

      const overtimeRate = await tx.hrOvertimeRate.findUnique({
        where: {
          id: overtime_rate_id,
        },
      });

      const computedRate = basicPay * Number(overtimeRate?.rate);

      console.log({
        vesselId,
        userLocationId,
      });

      const overtimeRequest = await tx.hrOvertimeRequest.create({
        data: {
          employee_id,
          vessel_id: dto.vessel_id,
          user_location_id: userLocationId,
          overtime_rate_id: dto.overtime_rate_id,
          date_filed: new Date(dto.date_filed),
          overtime_date: new Date(dto.overtime_date),
          time_from: timeFrom,
          time_to: timeTo,
          total_hours: totalHours,
          rate: computedRate,
          reason: dto.reason,
          created_by: user.id,
        },
      });

      // Format time in api response
      const response = {
        ...overtimeRequest,
        time_from: overtimeRequest.time_from?.toISOString().slice(11, 19),
        time_to: overtimeRequest.time_to?.toISOString().slice(11, 19),
      };

      return {
        status: 'success',
        message: 'Overtime Request created',
        overtimeRequest: response,
      };
    });
  }
}
