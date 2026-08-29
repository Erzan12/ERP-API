import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  HrErActionType,
  HrErCaseLevel,
  HrErCasePartyRole,
  HrErCaseStage,
  HrErIntakeStatus,
  HrErIntakeType,
  Prisma,
} from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CaseIntakePaginationDto } from 'src/utils/dtos/er-related-pagination.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { DisciplinaryCaseService } from '../disciplinary-case/disciplinary-case.service';
import { SLA_DAYS } from '../disciplinary-case/constants/hr-er-constants';

type NormalizedCasePartyInput = {
  employee_id: string;
  role: HrErCasePartyRole;
  level: HrErCaseLevel | undefined;
  remarks?: string | null;
  offense_ids?: string[];
  violation_ids?: string[];
  action?: {
    action_type: HrErActionType;
    effectivity_start: string;
    effectivity_end: string;
    remarks?: string;
  };
};

type NormalizedCaseInput = {
  company_id: string | null;
  intake_id?: string;
  incident_location_id: string;
  incident_location_type: string;
  assigned_location?: string | null;
  type?: HrErIntakeType | null;
  subject?: string | null;
  incident_date: string;
  report_date: string;
  incident_narrative?: string | null;
  parties: NormalizedCasePartyInput[];
};

@Injectable()
export class CaseIntakeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly disciplinaryCaseService: DisciplinaryCaseService,
  ) {}

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

  validatePartyActions(parties: NormalizedCasePartyInput[]) {
    for (const p of parties) {
      if (!p.action) continue;

      if (
        p.role !== HrErCasePartyRole.respondent ||
        p.level !== HrErCaseLevel.major
      ) {
        throw new BadRequestException(
          'Preventive suspension is only available for major respondents.',
        );
      }

      const start = new Date(p.action.effectivity_start);
      const end = new Date(p.action.effectivity_end);

      if (start >= end) {
        throw new BadRequestException(
          'Preventive suspension effectivity end must be later than the start date.',
        );
      }
    }
  }

  async buildAndCreateCase(
    input: NormalizedCaseInput,
    user: RequestUser,
    tx: Prisma.TransactionClient,
  ) {
    const company = input.company_id
      ? await tx.company.findUniqueOrThrow({ where: { id: input.company_id } })
      : null;

    const { controlNumber, caseCode } = company
      ? await this.disciplinaryCaseService.generate(
          input.company_id!,
          company.abbreviation,
          tx,
        )
      : { controlNumber: 0, caseCode: 'null' };

    return tx.hrErCase.create({
      data: {
        company_id: input.company_id ?? null,
        intake_id: input.intake_id ?? null,
        control_number: controlNumber,
        case_code: caseCode,
        incident_location_id: input.incident_location_id,
        incident_location_type: input.incident_location_type,
        assigned_location: input.assigned_location,
        type: input.type ?? null,
        subject: input.subject,
        incident_date: new Date(input.incident_date),
        report_date: new Date(input.report_date),
        incident_narrative: input.incident_narrative,
        created_by: user.id,
        parties: {
          create: input.parties.map((p) => ({
            employee: { connect: { id: p.employee_id } },
            role: p.role,
            remarks: p.remarks,
            createdBy: { connect: { id: user.id } },

            level: p.level,
            stage: HrErCaseStage.notice_to_explain,
            stage_started_at: new Date(),

            stage_logs: {
              create: {
                stage: HrErCaseStage.notice_to_explain,
                sla_days: SLA_DAYS[HrErCaseStage.notice_to_explain],
              },
            },

            offenses: {
              create: (p.offense_ids ?? []).map((offense_id) => ({
                offense: { connect: { id: offense_id } },
              })),
            },

            violations: {
              create: (p.violation_ids ?? []).map((violation_id) => ({
                violation: { connect: { id: violation_id } },
              })),
            },

            ...(p.action && {
              actions: {
                create: {
                  action_type: p.action.action_type,
                  effectivity_start: new Date(p.action.effectivity_start),
                  effectivity_end: new Date(p.action.effectivity_end),
                  remarks: p.action.remarks,
                  createdBy: { connect: { id: user.id } },
                },
              },
            }),
          })),
        },
      },
      include: {
        parties: {
          include: {
            stage_logs: true,
            offenses: true,
            violations: true,
            actions: true,
          },
        },
      },
    });
  }

  async getIncidentReports(dto: CaseIntakePaginationDto, user: RequestUser) {
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
        include: {
          createdBy: {
            select: {
              employee: true,
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
          parties: true,
          violations: true,
          attachments: true,
          offenses: true,
        },
        skip,
        take: perPage,
        orderBy: {
          [safeSortBy]: order,
        },
      }),
    ]);

    const locationIds = incidentReports
      .map((report) => report.incident_location_id)
      .filter((id): id is string => !!id);

    const workAssignments = await this.prisma.workAssignment.findMany({
      where: {
        id: {
          in: locationIds,
        },
      },
    });

    const workAssignmentMap = new Map(
      workAssignments.map((assignment) => [
        `${assignment.type}:${assignment.id}`,
        assignment,
      ]),
    );

    const incidentReportsWithLocation = incidentReports.map((report) => {
      const assignment = report.incident_location_id
        ? workAssignmentMap.get(
            `${report.incident_location_type}:${report.incident_location_id}`,
          )
        : null;

      return {
        ...report,
        incidentLocation: assignment ?? null,
      };
    });

    // if (incidentReports.length === 0) {
    //     throw new NotFoundException('No incident reports found.');
    // }

    return {
      status: 'success',
      message: 'Here is the list of Incident Reports.',
      count: total,
      page,
      perPage,
      incidentReports: incidentReportsWithLocation,
    };
  }

  async getEmployeeReports(dto: CaseIntakePaginationDto, user: RequestUser) {
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
              employee: true,
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
          parties: true,
          violations: true,
          attachments: true,
          offenses: true,
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

    return {
      status: 'success',
      message: 'Here is the list of Employee Reports.',
      count: total,
      page,
      perPage,
      employeeReports,
    };
  }

  async getAuthFlaggedCases() {}

  // async convertIntake(dto: ConvertIntakeToCaseDto, user: RequestUser) {
  //   await this.assertHrAccess(user.id);

  //   return this.prisma.$transaction(async (tx) => {
  //     const intake = await tx.hrErCaseIntake.findUnique({
  //       where: { id: dto.intake_id },
  //       include: {
  //         case: true,
  //         parties: true,
  //         offenses: true,
  //         violations: true,
  //       },
  //     });

  //     if (!intake) {
  //       throw new NotFoundException('Case intake not found.');
  //     }

  //     if (!intake.incident_location_id) {
  //       throw new Error('Incident location is required');
  //     }

  //     if (!intake.incident_location_type) {
  //       throw new Error('Incident location type is required');
  //     }

  //     if (intake.case) {
  //       throw new ConflictException(
  //         `This intake has already been converted to case ${intake.case.case_code ?? intake.case.id}.`,
  //       );
  //     }

  //     // Every intake party must get a case-level decision (level, optional action)
  //     const dtoPartyMap = new Map(dto.parties.map((p) => [p.employee_id, p]));
  //     const missing = intake.parties.filter(
  //       (ip) => !dtoPartyMap.has(ip.employee_id),
  //     );

  //     if (missing.length > 0) {
  //       throw new BadRequestException(
  //         `Missing level/decision for intake parties: ${missing
  //           .map((m) => m.employee_id)
  //           .join(', ')}`,
  //       );
  //     }

  //     const offenseIds = intake.offenses.map((o) => o.offense_id);
  //     const violationIds = intake.violations.map((v) => v.violation_id);

  //     const normalizedParties: NormalizedCasePartyInput[] = intake.parties.map(
  //       (ip) => {
  //         const decision = dtoPartyMap.get(ip.employee_id)!;
  //         return {
  //           employee_id: ip.employee_id,
  //           role: ip.role,
  //           level: decision.level,
  //           offense_ids:
  //             ip.role === HrErCasePartyRole.respondent ? offenseIds : [],
  //           violation_ids:
  //             ip.role === HrErCasePartyRole.respondent ? violationIds : [],
  //           action: decision.action,
  //         };
  //       },
  //     );

  //     this.validatePartyActions(normalizedParties);

  //     try {
  //       const disciplinaryCaseReport = await this.buildAndCreateCase(
  //         {
  //           company_id: dto.company_id ?? null,
  //           intake_id: dto.intake_id,
  //           incident_location_id: intake.incident_location_id,
  //           incident_location_type: intake.incident_location_type,
  //           assigned_location: dto.assigned_location,
  //           type: intake.type,
  //           subject: intake.subject,
  //           incident_date: intake.incident_date.toISOString(),
  //           report_date: dto.report_date,
  //           incident_narrative: intake.incident_narrative,
  //           parties: normalizedParties,
  //         },
  //         user,
  //         tx,
  //       );

  //       // Re-link existing intake attachments to the new case instead of duplicating
  //       await tx.hrErCaseAttachment.updateMany({
  //         where: { intake_id: intake.id },
  //         data: { case_id: disciplinaryCaseReport.id },
  //       });

  //       return {
  //         status: 'success',
  //         message: 'Case intake successfully converted to disciplinary case',
  //         disciplinaryCaseReport,
  //       };
  //     } catch (err) {
  //       if (
  //         err instanceof Prisma.PrismaClientKnownRequestError &&
  //         err.code === 'P2002'
  //       ) {
  //         throw new ConflictException(
  //           'This intake has already been converted to a case.',
  //         );
  //       }
  //       throw err;
  //     }
  //   });
  // }

  async ignoreIntake(intakeId: string, user: RequestUser) {
    await this.assertHrAccess(user.id);

    const existingIntake = await this.prisma.hrErCaseIntake.findUnique({
      where: { id: intakeId },
    });

    if (!existingIntake) {
      throw new NotFoundException('Case Intake or Report does not exist');
    }

    if (existingIntake.status === HrErIntakeStatus.cancelled) {
      throw new BadRequestException(
        'Case Intake is already cancelled cannot be ignored.',
      );
    }

    const ignoreIntake = await this.prisma.hrErCaseIntake.update({
      where: { id: intakeId },
      data: {
        status: HrErIntakeStatus.ignored,
        updated_by: user.id,
      },
    });

    return {
      status: 'success',
      message: 'Case Intake successfully ignored.',
      ignoreIntake,
    };
  }
}
