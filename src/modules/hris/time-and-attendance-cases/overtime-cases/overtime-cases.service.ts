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
  WorkflowActionType,
} from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { WORKFLOW_ENTITY } from 'src/utils/constants/workflow-entity.constants';
import { OvertimeRequestsPaginationDto } from 'src/utils/dtos/overtime-request-pagination.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import {
  CreateOvertimeRequestDto,
  UpdateOvertimeRequestDto,
} from './dto/overtime-case.dto';

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
        effective_date: 'desc',
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

  private formatTime(date: Date | null): string {
    if (!date) {
      throw new Error('Time is required');
    }

    return date.toTimeString().slice(0, 8);
  }

  async getOvertimeRequest(user: RequestUser, overtimeRequestId: string) {
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
          overtimeRate: {
            select: {
              id: true,
              type: true,
              rate: true,
              is_active: true,
            },
          },
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

  async getOvertimeRequests(
    user: RequestUser,
    dto: OvertimeRequestsPaginationDto,
    // statusDto: OvertimeRequestStatusPaginationDto,
  ) {
    const {
      search,
      date_filed_from,
      date_filed_to,
      employee_id,
      sortBy,
      order,
      page,
      perPage,
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

    const skip = (page - 1) * perPage;

    const whereCondition: Prisma.HrOvertimeRequestWhereInput = {
      is_active: true,
    };

    if (dto.show_by_status?.length) {
      whereCondition.status = {
        in: dto.show_by_status,
      };
    } else if (dto.status) {
      whereCondition.status = dto.status as OvertimeStatus;
    }

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

    // if (time_from) {
    //   whereConditions.time_from = {
    //     gte: new Date(`1970-01-01T${time_from}`),
    //   };
    // }

    // if (time_to) {
    //   whereConditions.time_to = {
    //     lte: new Date(`1970-01-01T${time_to}`),
    //   };
    // }

    const today = new Date();

    //  End of today
    today.setHours(23, 59, 59, 999);

    if (date_filed_from || date_filed_to) {
      const dateFilter: Prisma.DateTimeFilter = {};

      if (date_filed_from) {
        dateFilter.gte = new Date(date_filed_from);
      }

      if (date_filed_to) {
        const endDate = new Date(date_filed_to);

        //  Dont allow dates beyond today
        if (endDate > today) {
          dateFilter.lte = today;
        } else {
          endDate.setHours(23, 59, 59, 999);
          dateFilter.lte = endDate;
        }
      } else {
        // If no "to" is supplied, default to today
        dateFilter.lte = today;
      }

      whereConditions.date_filed = dateFilter;
    }

    await this.prisma.employee.findFirst({
      where: { id: employee_id },
      include: {
        overtimes: true,
      },
    });

    if (employee_id) {
      const existingEmployee = await this.prisma.employee.findFirst({
        where: {
          id: employee_id,
        },
      });

      if (!existingEmployee) {
        throw new NotFoundException('Employee does not exist');
      }

      whereCondition.employee_id = employee_id;
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
        include: {
          employee: {
            select: {
              person: {
                select: {
                  first_name: true,
                  middle_name: true,
                  last_name: true,
                },
              },
              user_location: {
                select: {
                  location_name: true,
                },
              },
              vessel: {
                select: {
                  name: true,
                },
              },
            },
          },
          overtimeRate: true,
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
      message: 'List of Overtime Request',
      count: total,
      page,
      perPage,
      overtimes: formattedOvertimes,
    };
  }

  // async getOvertimeRequestWithStatuses(dto: OvertimeRequestStatusPaginationDto) {
  // const whereCondition: Prisma.HrOvertimeRequestWhereInput = {
  //   is_active: true,
  // };

  // if (dto.show_by_status?.length) {
  //   whereCondition.status = {
  //     in: dto.show_by_status,
  //   };
  // }

  // const requests = await this.prisma.hrOvertimeRequest.findMany({
  //   where: whereCondition,
  // });

  // return {
  //   status: 'success',
  //   message: 'List of Overtime Request based on status',
  //   requests,
  // }
  // }

  async createOvertimeRequest(
    user: RequestUser,
    dto: CreateOvertimeRequestDto,
  ) {
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
          EmploymentHistoryType.user_location,
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
          verifier_id: dto.approver_id,
          approver_id: dto.approver_id,
          time_from: timeFrom,
          time_to: timeTo,
          total_hours: totalHours,
          rate: computedRate,
          reason: dto.reason,
          created_by: user.id,
        },
      });

      //query users first
      const [verifierUser, approverUser, currentUser] = await Promise.all([
        tx.user.findUnique({
          where: {
            id: dto.verifier_id,
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
        }),

        tx.user.findUnique({
          where: {
            id: dto.approver_id,
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
        }),

        tx.user.findUnique({
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
        }),
      ]);

      // build names
      const verifierName = verifierUser
        ? [
            verifierUser.employee?.person?.first_name,
            verifierUser.employee?.person?.middle_name,
            verifierUser.employee?.person?.last_name,
          ]
            .filter(Boolean)
            .join(' ')
        : '';

      const approverName = approverUser
        ? [
            approverUser.employee?.person?.first_name,
            approverUser.employee?.person?.middle_name,
            approverUser.employee?.person?.last_name,
          ]
            .filter(Boolean)
            .join(' ')
        : '';

      const creatorName = currentUser
        ? [
            currentUser.employee?.person?.first_name,
            currentUser.employee?.person?.middle_name,
            currentUser.employee?.person?.last_name,
          ]
            .filter(Boolean)
            .join(' ')
        : '';

      await tx.workflowAction.createMany({
        data: [
          {
            actionable_type: WORKFLOW_ENTITY.OVERTIME_REQUEST,
            actionable_id: overtimeRequest.id,
            action: WorkflowActionType.creation,
            acted_by: requestUser.id,
            metadata: {
              title: 'Overtime Request created',
              message: 'You have created a new Overtime Request',
              user: creatorName,
              role: 'creator',
            },
          },
          {
            actionable_type: WORKFLOW_ENTITY.OVERTIME_REQUEST,
            actionable_id: overtimeRequest.id,
            action: WorkflowActionType.verification,
            acted_by: dto.verifier_id,
            metadata: {
              title: 'Verify Overtime Request',
              message: 'You have new Verify Request',
              user: verifierName,
              role: 'verifier',
            },
            acted_at: null,
          },
          {
            actionable_type: WORKFLOW_ENTITY.OVERTIME_REQUEST,
            actionable_id: overtimeRequest.id,
            action: WorkflowActionType.approval,
            acted_by: dto.approver_id,
            metadata: {
              title: 'Approve Overtime Request',
              message: 'You have a new Approval Request',
              user: approverName,
              role: 'approver',
            },
            acted_at: null,
          },
        ],
      });

      const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
      const userPosition = requestUser.employee.position.name;

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
        created_by: `${userName} - ${userPosition}`,
      };
    });
  }

  async updateOvertimeRequest(
    user: RequestUser,
    dto: UpdateOvertimeRequestDto,
    overtimeRequestId: string,
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

    return await this.prisma.$transaction(async (tx) => {
      const existingOvertimeCase = await tx.hrOvertimeRequest.findFirst({
        where: {
          id: overtimeRequestId,
          is_active: true,
          status: {
            notIn: [OvertimeStatus.cancelled, OvertimeStatus.rejected],
          },
        },
        include: {
          employee: {
            include: {
              salary_grade: true,
            },
          },
        },
      });

      if (!existingOvertimeCase) {
        throw new NotFoundException('Overtime request not found');
      }

      // Calculate date and time
      const overtimeDate = dto.overtime_date
        ? new Date(dto.overtime_date)
        : existingOvertimeCase.overtime_date;

      const timeFromString =
        dto.time_from ?? this.formatTime(existingOvertimeCase.time_from);

      const timeToString =
        dto.time_to ?? this.formatTime(existingOvertimeCase.time_to);

      const overtimeRateId =
        dto.overtime_rate_id ?? existingOvertimeCase.overtime_rate_id;

      const conflict = await tx.hrOvertimeRequest.findFirst({
        where: {
          employee_id: existingOvertimeCase.employee_id,
          overtime_date: overtimeDate,
          is_active: true,
          status: {
            notIn: [OvertimeStatus.cancelled, OvertimeStatus.rejected],
          },
          NOT: {
            id: overtimeRequestId,
          },
        },
      });

      if (conflict) {
        throw new BadRequestException(
          'Conflicting OT Date exist (active request already exist)',
        );
      }

      const salaryGradeId = await this.getCurrentEmploymentValue(
        existingOvertimeCase?.employee_id ?? '',
        EmploymentHistoryType.salary_grade,
      );

      if (!salaryGradeId) {
        throw new BadRequestException('Employee has no assigned salary grade.');
      }

      const workingDays = EmployeeType.land_based ? 26.08 : 30;

      const monthlySalary = Number(
        existingOvertimeCase?.employee.salary_grade?.rate,
      );

      const dailyRate = monthlySalary / workingDays;

      const hourlyRate = dailyRate / 8;

      const perMinuteRate = hourlyRate / 60;

      const vesselId: string | null = null;
      // let userLocationId: string | null = null;

      if (vesselId) {
        const vessel = await tx.vessel.findUnique({
          where: { id: vesselId },
        });

        if (!vessel) {
          throw new BadRequestException('Invalid vessel.');
        }
      }

      const totalHours = this.calculateTotalHours(timeFromString, timeToString);

      const totalMinutes = totalHours * 60;

      const basicPay = totalMinutes * perMinuteRate;

      const overtimeDateString = overtimeDate.toISOString().split('T')[0];

      const timeFrom = this.combineDateAndTime(
        overtimeDateString,
        timeFromString,
      );

      const timeTo = this.combineDateAndTime(overtimeDateString, timeToString);

      // Overnight OT (22:00 -> 02:00)
      if (timeTo < timeFrom) {
        timeTo.setDate(timeTo.getDate() + 1);
      }

      const overtimeRate = await tx.hrOvertimeRate.findFirst({
        where: {
          id: overtimeRateId!,
        },
      });

      const computedRate = basicPay * Number(overtimeRate?.rate);

      const updateOvertimeRequest = await tx.hrOvertimeRequest.update({
        where: { id: overtimeRequestId },
        data: {
          vessel_id: dto.vessel_id ?? existingOvertimeCase.vessel_id,
          overtime_rate_id: overtimeRateId,
          date_filed: dto.date_filed ? new Date(dto.date_filed) : undefined,
          overtime_date: dto.overtime_date
            ? new Date(dto.overtime_date)
            : undefined,
          time_from: timeFrom,
          time_to: timeTo,
          total_hours: totalHours ?? existingOvertimeCase.total_hours,
          rate: computedRate ?? existingOvertimeCase.rate,
          reason: dto.reason ?? existingOvertimeCase.reason,
          verifier_id: dto.verifier_id ?? existingOvertimeCase.verifier_id,
          approver_id: dto.approver_id ?? existingOvertimeCase.approver_id,
          updated_by: user.id,
        },
      });

      // Workflow Logic Fetch current pending workflow routing lines
      const pendingWorkflowActions = await tx.workflowAction.findMany({
        where: {
          actionable_type: WORKFLOW_ENTITY.OVERTIME_REQUEST,
          actionable_id: overtimeRequestId,
          action: {
            in: [WorkflowActionType.verification, WorkflowActionType.approval],
          },
          acted_at: null,
        },
      });

      const currentVerificationStep = pendingWorkflowActions.find(
        (a) => a.action === WorkflowActionType.verification,
      );

      const currentApprovalStep = pendingWorkflowActions.find(
        (a) => a.action === WorkflowActionType.approval,
      );

      // Handle verifier update/patch
      if (dto.verifier_id) {
        // Fetch name from User table (since WorkflowAction.acted_by maps to User)
        const targetUser = await tx.user.findUnique({
          where: { id: dto.verifier_id },
          include: {
            employee: {
              select: {
                person: {
                  select: {
                    first_name: true,
                    last_name: true,
                  },
                },
              },
            },
          },
        });

        const verifierName = targetUser
          ? `${targetUser.employee.person.first_name} ${targetUser.employee.person.last_name}`.trim()
          : 'Unknown User';

        if (currentVerificationStep) {
          //  If assigned verifier changed, update the row
          if (currentVerificationStep.acted_by !== dto.verifier_id) {
            await tx.workflowAction.update({
              where: { id: currentVerificationStep.id },
              data: {
                acted_by: dto.verifier_id,
                metadata: {
                  title: 'Verify Overtime Request',
                  message: 'You have a new Verify Request',
                  user: verifierName,
                  role: 'verifier',
                },
              },
            });
          }
        } else {
          // Edge case safety net if it didnt exist for some reason create it
          await tx.workflowAction.create({
            data: {
              actionable_type: WORKFLOW_ENTITY.OVERTIME_REQUEST,
              actionable_id: overtimeRequestId,
              action: WorkflowActionType.verification,
              acted_by: dto.verifier_id,
              acted_at: null,
              metadata: {
                title: 'Verify Overtime Request',
                message: 'You have a new Verify Request',
                user: verifierName,
                role: 'verifier',
              },
            },
          });
        }
      }

      // Handle Approver Update/patch
      if (dto.approver_id) {
        const targetUser = await tx.user.findUnique({
          where: { id: dto.approver_id },
          include: {
            employee: {
              select: {
                person: {
                  select: {
                    first_name: true,
                    last_name: true,
                  },
                },
              },
            },
          },
        });

        const approverName = targetUser
          ? `${targetUser.employee.person.first_name} ${targetUser.employee.person.last_name}`.trim()
          : 'Unknown User';

        if (currentApprovalStep) {
          // If assigned approver changed, update the row
          if (currentApprovalStep.acted_by !== dto.approver_id) {
            await tx.workflowAction.update({
              where: { id: currentApprovalStep.id },
              data: {
                acted_by: dto.approver_id,
                metadata: {
                  title: 'Approve Leave Request',
                  message: 'You have a new Approval Request',
                  user: approverName,
                  role: 'approver',
                },
              },
            });
          }
        } else {
          // Edge case safety net: Create if missing
          await tx.workflowAction.create({
            data: {
              actionable_type: WORKFLOW_ENTITY.OVERTIME_REQUEST,
              actionable_id: overtimeRequestId,
              action: WorkflowActionType.approval,
              acted_by: dto.approver_id,
              acted_at: null,
              metadata: {
                title: 'Approve Overtime Request',
                message: 'You have a new Approval Request',
                user: approverName,
                role: 'approver',
              },
            },
          });
        }
      }

      const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
      const userPosition = requestUser.employee.position.name;

      // Format time in api response
      const response = {
        ...updateOvertimeRequest,
        time_from: updateOvertimeRequest.time_from?.toISOString().slice(11, 19),
        time_to: updateOvertimeRequest.time_to?.toISOString().slice(11, 19),
      };

      return {
        status: 'success',
        message: 'Overtime Request updated successfully',
        updateOvertimeRequest: response,
        updated_by: `${userName} - ${userPosition}`,
      };
    });
  }

  async submitOvertimeRequest(overtimeRequestId: string, user: RequestUser) {
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
      const submitOvertimeRequest = await tx.hrOvertimeRequest.update({
        where: { id: overtimeRequestId, status: OvertimeStatus.draft },
        data: {
          status: 'submitted',
          updated_by: requestUser.id,
        },
      });

      await tx.workflowAction.create({
        data: {
          actionable_type: WORKFLOW_ENTITY.OVERTIME_REQUEST,
          actionable_id: overtimeRequestId,
          action: WorkflowActionType.submission,
          acted_by: requestUser.id,
        },
      });

      const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
      const userPosition = requestUser.employee.position.name;

      return {
        status: 'success',
        message: 'Overtime Request Submitted',
        submitOvertimeRequest,
        submitted_by: `${userName} - ${userPosition}`,
      };
    });
  }

  async verifyOvertimeRequest(overtimeRequestId: string, user: RequestUser) {
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
      const overtimeRequest = await tx.hrOvertimeRequest.findUnique({
        where: { id: overtimeRequestId },
      });

      // console.log('Current id:', user.id);
      // console.log('Verifier id:', overtimeRequest?.verifier_id);

      if (overtimeRequest?.status !== OvertimeStatus.submitted) {
        throw new BadRequestException('Invalid! status must be: submitted');
      }

      if (overtimeRequest.verifier_id !== user.id) {
        throw new BadRequestException('User is not allowed to verify');
      }

      const verifyOvertimeRequest = await tx.hrOvertimeRequest.update({
        where: { id: overtimeRequestId },
        data: {
          status: OvertimeStatus.verified,
        },
      });

      const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
      const userPosition = requestUser.employee.position.name;

      const currentVerificationStep = await tx.workflowAction.findFirst({
        where: {
          actionable_type: WORKFLOW_ENTITY.OVERTIME_REQUEST,
          actionable_id: overtimeRequestId,
          action: WorkflowActionType.verification,
          acted_at: null,
        },
      });

      if (!currentVerificationStep) {
        throw new NotFoundException(
          'No pending verification workflow action found',
        );
      }

      await tx.workflowAction.update({
        where: { id: currentVerificationStep.id },
        data: {
          acted_at: new Date(),
          metadata: {
            title: 'Overtime Request Verified',
            message: 'You have verified this Overtime Request',
            user: `${userName} - ${userPosition}`,
            role: 'verifier',
          },
        },
      });

      return {
        status: 'success',
        message: 'Overtime Request Verified',
        verifyOvertimeRequest,
        verified_by: `${userName} - ${userPosition}`,
      };
    });
  }

  async approveOvertimeRequest(overtimeRequestId: string, user: RequestUser) {
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
      const overtimeRequest = await tx.hrOvertimeRequest.findUnique({
        where: { id: overtimeRequestId },
      });

      console.log('Current id:', user.id);
      console.log('Approver id:', overtimeRequest?.approver_id);

      if (overtimeRequest?.status !== OvertimeStatus.verified) {
        throw new BadRequestException('Invalid! status must be: verified');
      }

      if (overtimeRequest.approver_id !== user.id) {
        throw new BadRequestException('User is not allowed to approve');
      }

      const approveOvertimeRequest = await tx.hrOvertimeRequest.update({
        where: { id: overtimeRequestId },
        data: {
          status: OvertimeStatus.approved,
        },
      });

      const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
      const userPosition = requestUser.employee.position.name;

      const currentVerificationStep = await tx.workflowAction.findFirst({
        where: {
          actionable_type: WORKFLOW_ENTITY.OVERTIME_REQUEST,
          actionable_id: overtimeRequestId,
          action: WorkflowActionType.approval,
          acted_at: null,
        },
      });

      if (!currentVerificationStep) {
        throw new NotFoundException(
          'No pending verification workflow action found',
        );
      }

      await tx.workflowAction.update({
        where: { id: currentVerificationStep.id },
        data: {
          acted_at: new Date(),
          metadata: {
            title: 'Overtime Request Approved',
            message: 'You have approved this Overtime Request',
            user: `${userName} - ${userPosition}`,
            role: 'approver',
          },
        },
      });

      return {
        status: 'success',
        message: 'Overtime Request Approved',
        approveOvertimeRequest,
        approved_by: `${userName} - ${userPosition}`,
      };
    });
  }

  async processeOvertimeRequest(overtimeRequestId: string, user: RequestUser) {
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
      const overtimeRequest = await tx.hrOvertimeRequest.findUnique({
        where: { id: overtimeRequestId },
      });

      console.log('Current id:', user.id);
      console.log('Approver id:', overtimeRequest?.approver_id);

      if (overtimeRequest?.status !== OvertimeStatus.approved) {
        throw new BadRequestException('Invalid! status must be: approved');
      }

      const processOvertimeRequest = await tx.hrOvertimeRequest.update({
        where: { id: overtimeRequestId },
        data: {
          status: OvertimeStatus.processed,
        },
      });

      const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
      const userPosition = requestUser.employee.position.name;

      await tx.workflowAction.create({
        data: {
          actionable_type: WORKFLOW_ENTITY.OVERTIME_REQUEST,
          actionable_id: overtimeRequest.id,
          action: WorkflowActionType.processing,
          acted_by: requestUser.id,
          metadata: {
            title: 'Overtime Request processed',
            message: 'You have processed a Overtime Request',
            user: `${userName} - ${userPosition}`,
            role: 'HR Manager',
          },
        },
      });

      return {
        status: 'success',
        message: 'Overtime Request created',
        processOvertimeRequest,
        processed_by: `${userName} - ${userPosition}`,
      };
    });
  }

  async rejectOvertimeRequest(overtimeRequestId: string, user: RequestUser) {
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
      const existingOvertimeRequest = await tx.hrOvertimeRequest.findUnique({
        where: { id: overtimeRequestId },
      });

      if (!existingOvertimeRequest) {
        throw new NotFoundException('Overtime Request does not exist');
      }

      const allowedStatuses: OvertimeStatus[] = [
        OvertimeStatus.verified,
        OvertimeStatus.submitted,
        OvertimeStatus.approved,
      ];

      if (!allowedStatuses.includes(existingOvertimeRequest.status)) {
        throw new BadRequestException(
          'Invalid! status must be: for_verification, for_approval or for_processing',
        );
      }

      const rejectOvertimeRequest = await tx.hrOvertimeRequest.updateMany({
        where: {
          id: overtimeRequestId,
          status: {
            in: [
              OvertimeStatus.verified,
              OvertimeStatus.submitted,
              OvertimeStatus.approved,
            ],
          },
        },
        data: {
          status: OvertimeStatus.rejected,
          updated_by: requestUser.id,
        },
      });

      if (rejectOvertimeRequest.count === 0) {
        throw new BadRequestException('Update failed due to invalid status');
      }

      const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
      const userPosition = requestUser.employee.position.name;

      await tx.workflowAction.create({
        data: {
          actionable_type: WORKFLOW_ENTITY.OVERTIME_REQUEST,
          actionable_id: overtimeRequestId,
          action: WorkflowActionType.rejection,
          acted_by: requestUser.id,
          metadata: {
            title: 'Overtime Request Rejected',
            message: 'You have rejected this Overtime Request',
            user: `${userName} - ${userPosition}`,
            role: 'HR Manager',
          },
        },
      });

      return {
        status: 'success',
        message: 'Overtime Request Rejected',
        rejectOvertimeRequest,
        rejected_by: `${userName} - ${userPosition}`,
      };
    });
  }
}
