import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  HrErCaseLevel,
  HrErCasePartyRole,
  HrErCaseStage,
  HrErCaseStatus,
  HrErExplanationStatus,
  HrErHearingStatus,
  HrErIntakeStatus,
  Prisma,
} from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { ControlNumberService } from 'src/jobs/control-number/control-number.service';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { CreateCaseDto, getStageTiming, UpdateCaseDto } from './dto/case.dto';
import { SLA_DAYS, STAGE_ORDER } from './constants/hr-er-constants';
import { ErCasePaginationDto } from 'src/utils/dtos/er-related-pagination.dto';
import { UpdateCasePartyDto } from './dto/update-party-details.dto';

type Eligibility = { eligible: boolean; reason?: string };

@Injectable()
export class DisciplinaryCaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly controlNumberService: ControlNumberService,
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

  private checkPartyEligibility(
    party: Prisma.HrErCasePartyGetPayload<{
      include: {
        nte: true;
        explanation: true;
        hearings: true;
        decision: true;
      };
    }>,
  ): Eligibility {
    switch (party.stage) {
      case HrErCaseStage.notice_to_explain:
        return party.nte?.issued_at
          ? { eligible: true }
          : { eligible: false, reason: 'NTE not yet issued/served.' };

      case HrErCaseStage.written_explanation: {
        const status = party.explanation?.status;

        return status === 'received' || status === 'no_response'
          ? { eligible: true }
          : { eligible: false, reason: 'Still awaiting written explanation.' };
      }
      case HrErCaseStage.administrative_hearing: {
        const latest = party.hearings.at(-1); // most recent by created_at
        return latest && ['conducted', 'no_show'].includes(latest.status)
          ? { eligible: true }
          : { eligible: false, reason: 'Hearing not yet conducted.' };
      }

      case HrErCaseStage.notice_of_decision:
        return party.decision?.issued_at
          ? { eligible: true }
          : { eligible: false, reason: 'Decision not yet issued.' };

      default:
        return { eligible: false, reason: 'Already at final stage.' };
    }
  }

  private async recomputeCaseRollup(
    tx: Prisma.TransactionClient,
    caseId: string,
  ) {
    const respondents = await tx.hrErCaseParty.findMany({
      where: { case_id: caseId, role: 'respondent' },
      select: { stage: true },
    });
    // const active = respondents.filter(r => r.stage !== 'case_closed');
    const active = respondents.filter(
      (r): r is { stage: HrErCaseStage } =>
        r.stage !== null && r.stage !== 'case_closed',
    );
    const allClosed = active.length === 0;

    const STAGE_ORDER: HrErCaseStage[] = [
      HrErCaseStage.notice_to_explain,
      HrErCaseStage.written_explanation,
      HrErCaseStage.administrative_hearing,
      HrErCaseStage.notice_of_decision,
      HrErCaseStage.case_closed,
    ];

    const rollupStage = allClosed
      ? 'case_closed'
      : active.reduce(
          (min, r) =>
            STAGE_ORDER.indexOf(r.stage) < STAGE_ORDER.indexOf(min)
              ? r.stage
              : min,
          active[0].stage,
        );

    await tx.hrErCase.update({
      where: { id: caseId },
      data: {
        stage: rollupStage,
        // Left status open and closed_at not included so that in the case close api it will be status closed and closed_at in case close api
        ...(allClosed ? { status: HrErCaseStatus.open } : {}),
        // ...(allClosed ? { status: HrErCaseStatus.closed, closed_at: new Date() } : {}),
      },
    });
  }

  async generate(
    // companyId: string,
    // companyAbbreviation: string,
    db?: Prisma.TransactionClient,
  ) {
    const year = new Date().getFullYear();

    const controlNumber = await this.controlNumberService.getNextNumber(
      // companyId,
      'HR_ER_CASE',
      year,
      db,
    );

    // const caseCode = `ER-${companyAbbreviation}-${year}-${String(controlNumber).padStart(4, '0')}`;
    const caseCode = `ER-${year}-${String(controlNumber).padStart(4, '0')}`;

    return {
      controlNumber,
      caseCode,
    };
  }

  async getDisciplinaryCases(dto: ErCasePaginationDto, user: RequestUser) {
    const { search, sortBy, order, page, perPage } = dto;

    await this.assertHrAccess(user.id);

    const skip = (page - 1) * perPage;

    const whereCondition: Prisma.HrErCaseWhereInput = {};

    if (search?.trim()) {
      whereCondition.OR = [
        {
          case_code: {
            contains: search.trim(),
            mode: 'insensitive',
          },
        },
        // {
        //   incident_location: {
        //     contains: search.trim(),
        //     mode: 'insensitive',
        //   },
        // },
        {
          assigned_location: {
            contains: search.trim(),
            mode: 'insensitive',
          },
        },
        {
          incident_narrative: {
            contains: search.trim(),
            mode: 'insensitive',
          },
        },
      ];
    }

    const allowSortFields = ['id', 'created_at', 'updated_at'];

    const safeSortBy = allowSortFields.includes(sortBy) ? sortBy : 'created_at';

    const [total, disciplinaryCases] = await this.prisma.$transaction([
      this.prisma.hrErCase.count({
        where: {
          ...whereCondition,
        },
      }),
      this.prisma.hrErCase.findMany({
        where: {
          ...whereCondition,
        },
        include: {
          intake: true,
          parties: {
            include: {
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
                  vessel: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
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
                  hire_date: true,
                  salary: true,
                  pay_frequency: true,
                  employment_status: {
                    select: {
                      id: true,
                      code: true,
                    },
                  },
                  employee_type: true,
                  employment_type: true,
                  monthly_equivalent_salary: true,
                  other_employee_data: true,
                },
              },
              nte: true,
              explanation: true,
              hearings: true,
              decision: true,
              stage_logs: true,
              offenses: {
                select: {
                  id: true,
                  party_id: true,
                  offense: {
                    select: {
                      id: true,
                      type_of_offense: true,
                      description: true,
                    },
                  },
                },
              },
              violations: {
                select: {
                  id: true,
                  party_id: true,
                  violation: {
                    select: {
                      id: true,
                      section: true,
                      behavior: true,
                      category: true,
                      article: {
                        select: {
                          id: true,
                          title: true,
                        },
                      },
                    },
                  },
                },
              },
              actions: true,
            },
          },
          attachments: true,
        },
        skip,
        take: perPage,
        orderBy: {
          [safeSortBy]: order,
        },
      }),
    ]);

    const locationIds = [
      ...new Set(
        disciplinaryCases
          .map((item) => item.incident_location_id)
          .filter(Boolean),
      ),
    ];

    const locations = await this.prisma.workAssignment.findMany({
      where: {
        id: {
          in: locationIds,
        },
      },
    });

    const locationMap = new Map(
      locations.map((location) => [
        `${location.type}:${location.id}`,
        location,
      ]),
    );

    const casesWithLocation = disciplinaryCases.map((item) => ({
      ...item,
      incident_location: item.incident_location_id
        ? (locationMap.get(
            `${item.incident_location_type}:${item.incident_location_id}`,
          ) ?? null)
        : null,
    }));

    // if (disciplinaryCases.length === 0) {
    //   throw new NotFoundException('No displicary cases found.');
    // }

    return {
      status: 'success',
      message: 'Here is the list  of Disciplinary Cases',
      count: total,
      page,
      perPage,
      disciplinaryCases: casesWithLocation,
    };
  }

  async getDisciplinaryCase(disciplinaryCaseId: string, user: RequestUser) {
    await this.assertHrAccess(user.id);

    const disciplinaryCase = await this.prisma.hrErCase.findUnique({
      where: { id: disciplinaryCaseId },
      include: {
        intake: true,
        parties: {
          include: {
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
                vessel: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
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
                hire_date: true,
                salary: true,
                pay_frequency: true,
                employment_status: {
                  select: {
                    id: true,
                    code: true,
                  },
                },
                employee_type: true,
                employment_type: true,
                monthly_equivalent_salary: true,
                other_employee_data: true,
              },
            },
            nte: {
              include: {
                approvals: {
                  include: {
                    reviewer: {
                      select: {
                        employee: {
                          select: {
                            id: true,
                            employee_id: true,
                            person: {
                              select: {
                                first_name: true,
                                middle_name: true,
                                last_name: true,
                                contact_no: true,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            explanation: true,
            hearings: true,
            decision: true,
            stage_logs: true,
            offenses: {
              select: {
                id: true,
                party_id: true,
                offense: {
                  select: {
                    id: true,
                    type_of_offense: true,
                    description: true,
                  },
                },
              },
            },
            violations: {
              select: {
                id: true,
                party_id: true,
                violation: {
                  select: {
                    id: true,
                    section: true,
                    behavior: true,
                    category: true,
                    article: {
                      select: {
                        id: true,
                        title: true,
                      },
                    },
                  },
                },
              },
            },
            actions: true,
          },
        },
        activity_logs: true,
        attachments: true,
      },
    });

    if (!disciplinaryCase) {
      throw new NotFoundException('Disciplinary Case not found.');
    }

    const location = disciplinaryCase.incident_location_id
      ? await this.prisma.workAssignment.findFirst({
          where: {
            id: disciplinaryCase.incident_location_id,
          },
        })
      : null;

    return {
      status: 'success',
      message: 'Here is the Disciplinary Case',
      disciplinaryCase: {
        ...disciplinaryCase,
        incident_location: location,
      },
    };
  }

  // To view the status of the Case e.g "10 days Overdue"
  async getCaseDetail(caseId: string, user: RequestUser) {
    await this.assertHrAccess(user.id);

    const kase = await this.prisma.hrErCase.findUniqueOrThrow({
      where: { id: caseId },
      include: {
        parties: {
          include: {
            nte: true,
            explanation: true,
            hearings: true,
            decision: true,
            stage_logs: true,
            // offenses: true,
            // violations: true,
            // actions: true,
          },
        },
      },
    });

    const partiesWithTiming = kase.parties.map((party) => ({
      ...party,
      timing: party.stage ? getStageTiming(party, SLA_DAYS[party.stage]) : null,
    }));

    return { ...kase, parties: partiesWithTiming };
  }

  async createCase(dto: CreateCaseDto, user: RequestUser) {
    await this.assertHrAccess(user.id);

    // Validate business rules before starting the transaction
    for (const p of dto.parties) {
      if (p.action) {
        // Preventive suspension is respondent + major only
        if (
          p.role !== HrErCasePartyRole.respondent ||
          p.level !== HrErCaseLevel.major
        ) {
          throw new BadRequestException(
            'Preventive suspension is only available for major respondents.',
          );
        }

        // Validate suspension date range
        const start = new Date(p.action.effectivity_start);
        const end = new Date(p.action.effectivity_end);

        if (start >= end) {
          throw new BadRequestException(
            'Preventive suspension effectivity end must be later than the start date.',
          );
        }
      }
    }

    return this.prisma.$transaction(async (tx) => {
      // const company = dto.company_id
      //   ? await tx.company.findUniqueOrThrow({
      //       where: { id: dto.company_id },
      //     })
      //   : null;

      const { controlNumber, caseCode } = await this.generate(tx);

      // Intake is optional
      const intake = dto.intake_id
        ? await tx.hrErCaseIntake.findUnique({
            where: {
              id: dto.intake_id,
            },
            include: {
              case: true,
            },
          })
        : null;

      // Only validate intake if intake_id was provided
      if (dto.intake_id && !intake) {
        throw new NotFoundException('Case intake not found.');
      }

      if (intake?.case) {
        throw new ConflictException(
          `This intake has already been converted to case`,
        );
      }

      const locationType = await this.prisma.workAssignment.findFirst({
        where: { id: dto.incident_location_id },
      });

      if (!locationType?.type) {
        throw new Error('Incident location type is required');
      }

      try {
        const disciplinaryCaseReport = await tx.hrErCase.create({
          data: {
            intake_id: dto.intake_id,
            // company_id: dto.company_id ?? null,
            control_number: controlNumber,
            case_code: caseCode,
            incident_location_id: dto.incident_location_id,
            incident_location_type: locationType.type,
            assigned_location: dto.assigned_location,
            type: intake?.type,
            subject: intake?.subject,
            incident_date: new Date(dto.incident_date),
            report_date: new Date(dto.report_date),
            incident_narrative: dto.incident_narrative,
            created_by: user.id,
            parties: {
              create: dto.parties.map((p) => ({
                employee: { connect: { id: p.employee_id } },
                role: p.role,
                remarks: p.remarks,
                createdBy: { connect: { id: user.id } },

                // Stage tracking applies to all case parties
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
                    offense: {
                      connect: {
                        id: offense_id,
                      },
                    },
                  })),
                },

                violations: {
                  create: (p.violation_ids ?? []).map((violation_id) => ({
                    violation: {
                      connect: {
                        id: violation_id,
                      },
                    },
                  })),
                },

                ...(p.action && {
                  actions: {
                    create: {
                      action_type: p.action.action_type,
                      effectivity_start: new Date(p.action.effectivity_start),
                      effectivity_end: new Date(p.action.effectivity_end),
                      remarks: p.action.remarks,
                      createdBy: {
                        connect: {
                          id: user.id,
                        },
                      },
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

        // Only update intake when this case came from an intake
        if (intake) {
          await this.prisma.hrErCaseIntake.update({
            where: { id: dto.intake_id },
            data: {
              status: HrErIntakeStatus.processed,
              updated_by: user.id,
            },
          });
        }

        return {
          status: 'success',
          message: 'Disciplinary Case successfully created',
          disciplinaryCaseReport,
        };
      } catch (err) {
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === 'P2002'
        ) {
          throw new ConflictException(
            'This intake has already been converted to a case.',
          );
        }
        throw err;
      }
    });
  }

  async updateCase(
    disciplinaryCaseId: string,
    dto: UpdateCaseDto,
    user: RequestUser,
  ) {
    await this.assertHrAccess(user.id);

    return this.prisma.$transaction(async (tx) => {
      // const company = dto.company_id
      //   ? await tx.company.findUniqueOrThrow({
      //       where: { id: dto.company_id },
      //     })
      //   : null;

      const { controlNumber, caseCode } = await this.generate(tx);

      const existingDisciplinaryCase = await tx.hrErCase.findUnique({
        where: { id: disciplinaryCaseId },
      });

      if (!existingDisciplinaryCase) {
        throw new NotFoundException('Disciplinary Case does not exist.');
      }

      const location = await this.prisma.workAssignment.findFirst({
        where: {
          id: dto.incident_location_id,
        },
      });

      if (!location) {
        throw new BadRequestException('Invalid incident location');
      }

      const updateDisciplinaryCaseReport = await tx.hrErCase.update({
        where: { id: disciplinaryCaseId },
        data: {
          // company_id: dto.company_id ?? existingDisciplinaryCase.company_id,
          control_number:
            controlNumber ?? existingDisciplinaryCase.control_number,
          case_code: caseCode ?? existingDisciplinaryCase.case_code,
          incident_location_id:
            dto.incident_location_id ??
            existingDisciplinaryCase.incident_location_id,
          incident_location_type:
            location.type ?? existingDisciplinaryCase.incident_location_type,
          assigned_location:
            dto.assigned_location ?? existingDisciplinaryCase.assigned_location,
          incident_date: dto.incident_date
            ? new Date(dto.incident_date)
            : existingDisciplinaryCase.incident_date,
          report_date: dto.report_date
            ? new Date(dto.report_date)
            : existingDisciplinaryCase.report_date,
          incident_narrative:
            dto.incident_narrative ??
            existingDisciplinaryCase.incident_narrative,
          updated_by: user.id,
        },
      });

      return {
        status: 'success',
        message: 'Disciplinary Case successfully updated.',
        updateDisciplinaryCaseReport,
      };
    });
  }

  // async updateCasePartyDetails(partyId: string, user: RequestUser, dto: UpdateCasePartyDto) {
  //   await this.assertHrAccess(user.id);

  //   const existingParty = await this.prisma.hrErCaseParty.findUnique({
  //     where: { id: partyId },
  //     include: {
  //       actions: true,
  //     },
  //   });

  //   if (!existingParty) {
  //     throw new NotFoundException('Party does not exists.');
  //   }

  //   if (existingParty.role !== HrErCasePartyRole.respondent) {
  //     if (
  //       dto.level !== undefined ||
  //       dto.offense_ids !== undefined ||
  //       dto.violation_ids !== undefined ||
  //       dto.action !== undefined
  //     ) {
  //       throw new BadRequestException(
  //         'Level, offenses, violations, and actions are only available for respondents.',
  //       );
  //     }
  //   }

  //   if (dto.action) {
  //     if (existingParty.role !== HrErCasePartyRole.respondent) {
  //       throw new BadRequestException(
  //         'Preventive suspension is only available for respondents.',
  //       );
  //     }

  //     const level = dto.level ?? existingParty.level;

  //     if (level !== HrErCaseLevel.major) {
  //       throw new BadRequestException(
  //         'Preventive suspension is only available for major respondents.',
  //       );
  //     }

  //     const start = new Date(dto.action.effectivity_start);
  //     const end = new Date(dto.action.effectivity_end);

  //     if (start >= end) {
  //       throw new BadRequestException(
  //         'Preventive suspension effectivity end must be later than the start date.',
  //       );
  //     }
  //   }

  //   const partyData: Prisma.HrErCasePartyUpdateInput = {
  //     updatedBy: {
  //       connect: {
  //         id: user.id,
  //       },
  //     },
  //   };

  //   if (dto.level !== undefined) {
  //     partyData.level = dto.level;
  //   }

  //   if (dto.remarks !== undefined) {
  //     partyData.remarks = dto.remarks;
  //   }

  //   return this.prisma.$transaction(async(tx)  => {
  //     if (dto.offense_ids !== undefined) {
  //       await tx.hrErCasePartyOffense.deleteMany({
  //         where: {
  //           party_id: partyId,
  //         },
  //       });

  //       if (dto.offense_ids.length > 0) {
  //         await tx.hrErCasePartyOffense.createMany({
  //           data: dto.offense_ids.map((offense_id) => ({
  //             party_id: partyId,
  //             offense_id,
  //           })),
  //           skipDuplicates: true,
  //         });
  //       }
  //     }

  //     if (dto.violation_ids !== undefined) {
  //       await tx.hrErCasePartyViolation.deleteMany({
  //         where: {
  //           party_id: partyId,
  //         },
  //       });

  //       if (dto.violation_ids.length > 0) {
  //         await tx.hrErCasePartyViolation.createMany({
  //           data: dto.violation_ids.map((violation_id) => ({
  //             party_id: partyId,
  //             violation_id,
  //           })),
  //           skipDuplicates: true,
  //         });
  //       }
  //     }

  //     if (dto.action) {
  //       await tx.hrErCasePartyAction.upsert({
  //         where: {
  //           party_id: partyId,
  //         },
  //         create: {
  //           party: {
  //             connect: {
  //               id: partyId,
  //             },
  //           },
  //           action_type: dto.action.action_type,
  //           effectivity_start: new Date(
  //             dto.action.effectivity_start,
  //           ),
  //           effectivity_end: new Date(
  //             dto.action.effectivity_end,
  //           ),
  //           remarks: dto.action.remarks,
  //           createdBy: {
  //             connect: {
  //               id: user.id,
  //             },
  //           },
  //         },
  //         update: {
  //           action_type: dto.action.action_type,
  //           effectivity_start: new Date(
  //             dto.action.effectivity_start,
  //           ),
  //           effectivity_end: new Date(
  //             dto.action.effectivity_end,
  //           ),
  //           remarks: dto.action.remarks,
  //           updatedBy: {
  //             connect: {
  //               id: user.id,
  //             },
  //           },
  //         },
  //       });
  //     }
  //   })
  // }

  async updateCasePartyDetails(
    partyId: string,
    user: RequestUser,
    dto: UpdateCasePartyDto,
  ) {
    await this.assertHrAccess(user.id);

    const existingParty = await this.prisma.hrErCaseParty.findUnique({
      where: { id: partyId },
      include: {
        actions: true,
        offenses: true,
        violations: true,
      },
    });

    if (!existingParty) {
      throw new NotFoundException('Party does not exist.');
    }

    // Respondent-only validation
    if (existingParty.role !== HrErCasePartyRole.respondent) {
      if (
        dto.level !== undefined ||
        dto.offense_ids !== undefined ||
        dto.violation_ids !== undefined ||
        dto.action !== undefined
      ) {
        throw new BadRequestException(
          'Level, offenses, violations, and actions are only available for respondents.',
        );
      }
    }

    // Validate action only if action is included in the payload
    if (dto.action !== undefined) {
      if (existingParty.role !== HrErCasePartyRole.respondent) {
        throw new BadRequestException(
          'Preventive suspension is only available for respondents.',
        );
      }

      const level = dto.level ?? existingParty.level;

      if (level !== HrErCaseLevel.major) {
        throw new BadRequestException(
          'Preventive suspension is only available for major respondents.',
        );
      }

      // Since action fields can now be optional,
      // use the existing values when omitted.
      const existingAction = existingParty.actions[0];

      const start = dto.action.effectivity_start
        ? new Date(dto.action.effectivity_start)
        : existingAction?.effectivity_start;

      const end = dto.action.effectivity_end
        ? new Date(dto.action.effectivity_end)
        : existingAction?.effectivity_end;

      if (start && end && start >= end) {
        throw new BadRequestException(
          'Preventive suspension effectivity end must be later than the start date.',
        );
      }
    }

    return this.prisma.$transaction(async (tx) => {
      // Update party fields
      const partyData: Prisma.HrErCasePartyUpdateInput = {
        updatedBy: {
          connect: {
            id: user.id,
          },
        },
      };

      // Only update if included in request
      if (dto.level !== undefined) {
        partyData.level = dto.level;
      }

      // Allows:
      // omitted -> keep existing
      // string -> update
      // null -> clear
      if (dto.remarks !== undefined) {
        partyData.remarks = dto.remarks;
      }

      const updatedParty = await tx.hrErCaseParty.update({
        where: {
          id: partyId,
        },
        data: partyData,
      });

      // Update offenses only if included

      if (dto.offense_ids !== undefined) {
        await tx.hrErCasePartyOffense.deleteMany({
          where: {
            party_id: partyId,
          },
        });

        if (dto.offense_ids.length > 0) {
          await tx.hrErCasePartyOffense.createMany({
            data: dto.offense_ids.map((offense_id) => ({
              party_id: partyId,
              offense_id,
            })),
            skipDuplicates: true,
          });
        }
      }

      // Update violations only if included

      if (dto.violation_ids !== undefined) {
        await tx.hrErCasePartyViolation.deleteMany({
          where: {
            party_id: partyId,
          },
        });

        if (dto.violation_ids.length > 0) {
          await tx.hrErCasePartyViolation.createMany({
            data: dto.violation_ids.map((violation_id) => ({
              party_id: partyId,
              violation_id,
            })),
            skipDuplicates: true,
          });
        }
      }

      // Update action only if included

      if (dto.action !== undefined) {
        const existingAction = existingParty.actions[0];

        const actionType =
          dto.action.action_type ?? existingAction?.action_type;

        const effectivityStart = dto.action.effectivity_start
          ? new Date(dto.action.effectivity_start)
          : existingAction?.effectivity_start;

        const effectivityEnd = dto.action.effectivity_end
          ? new Date(dto.action.effectivity_end)
          : existingAction?.effectivity_end;

        if (!actionType || !effectivityStart || !effectivityEnd) {
          throw new BadRequestException(
            'Action type, effectivity start, and effectivity end are required when creating an action.',
          );
        }

        await tx.hrErCasePartyAction.upsert({
          where: {
            party_id: partyId,
          },

          create: {
            party: {
              connect: {
                id: partyId,
              },
            },
            action_type: actionType,
            effectivity_start: effectivityStart,
            effectivity_end: effectivityEnd,
            remarks: dto.action.remarks,

            createdBy: {
              connect: {
                id: user.id,
              },
            },
          },

          update: {
            action_type: actionType,
            effectivity_start: effectivityStart,
            effectivity_end: effectivityEnd,

            // Only update remarks if it was included
            ...(dto.action.remarks !== undefined && {
              remarks: dto.action.remarks,
            }),

            updatedBy: {
              connect: {
                id: user.id,
              },
            },
          },
        });
      }

      return updatedParty;

      // Return updated party
      // return tx.hrErCaseParty.findUnique({
      //   where: {
      //     id: partyId,
      //   },
      //   include: {
      //     offenses: true,
      //     violations: true,
      //     actions: true,
      //   },
      // });
    });
  }

  async advanceAllEligible(caseId: string, user: RequestUser) {
    await this.assertHrAccess(user.id);

    return this.prisma.$transaction(async (tx) => {
      // const parties = await tx.hrErCaseParty.findMany({
      //     where: { case_id: caseId, role: 'respondent', stage: { not: 'case_closed' } },
      //     include: { nte: true, explanation: true, hearings: true, decision: true },
      // });

      const parties = await tx.hrErCaseParty.findMany({
        where: {
          case_id: caseId,
          role: 'respondent',
          // stage: { not: null, notIn: ['case_closed'] },
          // Temp remove notIn: case_closed stage filter
          stage: { not: null },
        },
        include: {
          nte: true,
          explanation: true,
          hearings: true,
          decision: true,
        },
      });

      if (parties.length === 0) {
        throw new BadRequestException(
          'No respondent found for this disciplinary case.',
        );
      }

      // Do not allow advance-stage to be used from
      // Notice of Decision or Case Closed.
      const hasFinalStageParty = parties.some(
        (party) =>
          // party.stage === HrErCaseStage.notice_of_decision ||
          party.stage === HrErCaseStage.case_closed,
      );

      if (hasFinalStageParty) {
        throw new BadRequestException(
          'This case cannot be advanced using the advance-stage API. ' +
            'Use the appropriate Case Close action',
        );
      }

      const advanced: string[] = [];
      const skipped: { partyId: string; reason: string }[] = [];

      for (const party of parties) {
        const { eligible, reason } = this.checkPartyEligibility(party);

        if (!eligible) {
          skipped.push({ partyId: party.id, reason: reason! });
          await tx.hrErCaseActivityLog.create({
            data: {
              case_id: caseId,
              party_id: party.id,
              actor_id: user.id,
              action: 'stage_advance_skipped',
              metadata: { reason },
            },
          });
          continue; // left behind — not included in the next stage, exactly as your PM described
        }

        if (!party.stage) {
          // shouldn't happen given the query filter above, but keeps TS (and runtime) honest
          skipped.push({
            partyId: party.id,
            reason: 'Party has no stage set.',
          });
          continue;
        }

        const currentStage = party.stage;
        const currentIndex = STAGE_ORDER.indexOf(currentStage);
        const next = STAGE_ORDER[currentIndex + 1];

        if (!next) {
          skipped.push({
            partyId: party.id,
            reason: 'Party is already at the final stage.',
          });
          continue;
        }

        const now = new Date();

        // Exit current stage
        await tx.hrErCaseStageLog.updateMany({
          where: { party_id: party.id, stage: currentStage, exited_at: null },
          data: { exited_at: now },
        });
        await tx.hrErCaseStageLog.create({
          data: { party_id: party.id, stage: next, sla_days: SLA_DAYS[next] },
        });
        await tx.hrErCaseParty.update({
          where: { id: party.id },
          data: { stage: next, stage_started_at: now },
        });
        await tx.hrErCaseActivityLog.create({
          data: {
            case_id: caseId,
            party_id: party.id,
            actor_id: user.id,
            action: `${next}_entered`,
          },
        });

        advanced.push(party.id);
      }

      await this.recomputeCaseRollup(tx, caseId);
      return {
        status: 'success',
        message: 'Eligible parties advanced successfully.',
        advanced,
        skipped,
      };
    });
  }

  async markNoResponse(partyId: string, user: RequestUser) {
    await this.assertHrAccess(user.id);

    return this.prisma.$transaction(async (tx) => {
      const party = await tx.hrErCaseParty.findUniqueOrThrow({
        where: { id: partyId },
      });

      if (party.stage === HrErCaseStage.written_explanation) {
        await tx.hrErCaseExplanation.upsert({
          where: { party_id: partyId },
          create: {
            party_id: partyId,
            status: HrErExplanationStatus.no_response,
          },
          update: { status: HrErExplanationStatus.no_response },
        });
      } else if (party.stage === HrErCaseStage.administrative_hearing) {
        await tx.hrErCaseHearing.updateMany({
          where: { party_id: partyId, status: HrErHearingStatus.scheduled },
          data: { status: HrErHearingStatus.no_show },
        });
      } else {
        throw new BadRequestException(
          `No-response marking isn't applicable at stage "${party.stage}".`,
        );
      }

      // await tx.hrErCaseStageLog.update({
      //   where: { party_id: partyId },
      //   data: {
      //     u
      //   }
      // })

      await tx.hrErCaseActivityLog.create({
        data: {
          case_id: party.case_id,
          party_id: partyId,
          actor_id: user.id,
          action: `${party.stage}_no_response_marked`,
        },
      });
    });
  }
}
