import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { computeStatus, getExpectedDueDate } from 'src/utils/helpers/calculate-date.helper';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { CreateEvaluationDto } from './dto/evaluation.dto';
import { startOfDay } from 'date-fns/startOfDay';
import { addMonths } from 'date-fns/addMonths';
import { isEqual } from 'date-fns/isEqual';
import { PREVIOUS_STAGE_MAP, STAGE_RULES } from 'src/utils/constants/evaluation.constants';
import { isAfter } from 'date-fns/isAfter';
import { EvaluationStage } from '@prisma/client';

@Injectable()
export class RegularizationReviewsService {
    constructor(private readonly prisma:PrismaService) {}

    async getForRegularization(user: RequestUser) {
        // Authorization Check
        const requestUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: { user_roles: true, employee: true }
        });

        const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
        const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));

        if (!canView) {
            throw new ForbiddenException('You are not authorized to perform this action');
        }

        await this.prisma.$executeRawUnsafe(
            `REFRESH MATERIALIZED VIEW "RegularizationEligibility"`
        );

        // Query the Materialized View
        const employees = await this.prisma.regularizationEligibility.findMany({
            include: {
                employee: {
                    include: {
                        evaluations_received: {
                            select: {
                                id: true,
                                employee_id: true,
                                evaluator_id: true,
                                stage: true,
                                // status: true,
                                probation_date: true,
                                regularization_date: true,
                                completed_at: true,
                            }
                        },
                        evaluations_given: true,
                        employment_history: {
                            where: { is_active: true },
                            take: 1,
                            orderBy: { effective_date: 'desc' }
                        }
                    }
                }
            }
        });

        return {
            status: 'success',
            message: 'List of Employees for Regularization',
            data: { employees }
        };
    }

    // async getForRegularization(user: RequestUser) {
    //     const today = new Date();

    //     const sixMonthsAgo = new Date();
    //     sixMonthsAgo.setMonth(today.getMonth() - 6);

    //     const employees = await this.prisma.employee.findMany({
    //         where: {
    //             hire_date: {
    //                 lte: today,
    //                 gte: sixMonthsAgo,
    //             },
    //             employment_status: {
    //                 code: 'PROBATIONARY',
    //             }
    //         },
    //         include: {
    //             employment_history: {
    //             where: {
    //                 is_active: true,
    //             },
    //             orderBy: {
    //                 effective_date: "desc",
    //             },
    //             take: 1,
    //             },
    //             evaluations_received: true,
    //             person: {
    //                 select: {
    //                     id: true,
    //                 }
    //             },
    //             position: {
    //                 select: {
    //                     id: true,
    //                 }
    //             },
    //             department: {
    //                 select: {
    //                     id: true,
    //                 }
    //             },
    //         },
    //     });

    //     const requestUser = await this.prisma.user.findUnique({
    //         where: { id: user.id },
    //         include: {
    //         employee: {
    //             include: {
    //             person: true,
    //             position: true,
    //             },
    //         },
    //         user_roles: true,
    //         },
    //     });
    
    //     if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
    //         throw new BadRequestException(`User does not exist.`);
    //     }
    
    //     const allowedRoles = [
    //         'Administrator',
    //         'Super Administrator',
    //         'HR Manager',
    //         'HR Clerk',
    //         'HR Staff',
    //     ];
    
    //     const canView = requestUser.user_roles.some((role) =>
    //         allowedRoles.includes(role.role_name),
    //     );
    
    //     if (!canView) {
    //         throw new ForbiddenException(
    //             'You are not authorized to perform this action',
    //         );
    //     }

    //     return {
    //         status: 'success',
    //         message: 'List of Employees for Regularization',
    //         data: {
    //             employees
    //         }
    //     }
    // }

    // async createEvaluation(dto: CreateEvaluationDto, user: RequestUser) {
    //     const employee = await this.prisma.employee.findUnique({
    //         where: { id: dto.employee_id },
    //     });

    //     if (!employee) {
    //         throw new BadRequestException('Employee not found');
    //     }

    //     const probationDate = startOfDay(new Date(dto.probation_date));
    //     const regularizationDate = startOfDay(new Date(dto.regularization_date));

    //     // BASE DATE (hire date)
    //     const baseDate = startOfDay(new Date(employee.hire_date));

    //     const expectedRegularization = addMonths(baseDate, 6);

    //     // Guard probation must equal base date
    //     if (!isEqual(probationDate, baseDate)) {
    //         throw new BadRequestException(
    //             'Probation date must match employee hire date'
    //         );
    //     }

    //     // Guard regularization must be exactly +6 months
    //     if (!isEqual(regularizationDate, expectedRegularization)) {
    //         throw new BadRequestException(
    //             'Regularization date must be exactly 6 months from hire date'
    //         );
    //     }

    //     const dueDate =
    //         dto.due_date
    //         ? new Date(dto.due_date)
    //         : calculateDueDate(employee.hire_date, dto.stage);

    //     // optional: prevent duplicates
    //     const existing = await this.prisma.employeeEvaluation.findFirst({
    //         where: {
    //         employee_id: dto.employee_id,
    //         stage: dto.stage,
    //         },
    //     });

    //     if (existing) {
    //         throw new BadRequestException('Evaluation already exists for this stage');
    //     }

    //     return this.prisma.employeeEvaluation.create({
    //         data: {
    //         employee_id: dto.employee_id,
    //         evaluator_id: dto.evaluator_id,
    //         stage: dto.stage,
    //         due_date: dueDate,
    //         probation_date: probationDate,
    //         regularization_date: regularizationDate,
    //         created_by: user.id,
    //         },
    //     });
    // }

    async createEvaluation(dto: CreateEvaluationDto, user: RequestUser) {
        const employee = await this.prisma.employee.findUnique({
            where: { id: dto.employee_id },
        });

        if (!employee) {
            throw new BadRequestException('Employee not found');
        }

        const hireDate = new Date(employee.hire_date);
        const now = new Date();

        // Enforce stage order
        const requiredPreviousStage = PREVIOUS_STAGE_MAP[dto.stage];

        if (requiredPreviousStage) {
            const previous = await this.prisma.employeeEvaluation.findFirst({
                where: {
                    employee_id: dto.employee_id,
                    stage: requiredPreviousStage as EvaluationStage,
                },
            });

            if (!previous) {
                throw new BadRequestException(
                    `You must complete ${requiredPreviousStage} first`
                );
            }

            if (!previous.completed_at) {
                throw new BadRequestException(
                    `${requiredPreviousStage} must be completed before proceeding`
                );
            }
        }

        // Block missing earlier evaluations
        for (const [stage, months] of Object.entries(STAGE_RULES)) {
            const due = addMonths(hireDate, months);

            if (isAfter(now, due)) {
            const existingEval = await this.prisma.employeeEvaluation.findFirst({
                where: {
                employee_id: dto.employee_id,
                stage: stage as any,
                },
            });

            if (!existingEval) {
                throw new BadRequestException(
                `Missing ${stage}. It is already overdue.`
                );
            }
            }
        }

        // Compute due date
        const expectedDueDate = getExpectedDueDate(hireDate, dto.stage);

        // Create evaluation (NO status saved)
        const evaluation = await this.prisma.employeeEvaluation.create({
            data: {
            employee_id: dto.employee_id,
            evaluator_id: dto.evaluator_id,
            stage: dto.stage,
            due_date: expectedDueDate,
            probation_date: new Date(dto.probation_date),
            regularization_date: new Date(dto.regularization_date),
            created_by: user.id,
            },
        });

        // Authorization Check
        const requestUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: { user_roles: true, employee: true }
        });

        const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
        const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));

        if (!canView) {
            throw new ForbiddenException('You are not authorized to perform this action');
        }

        // Return with computed status
        return {
            ...evaluation,
            status: computeStatus(evaluation),
        };
        }

    async getEvaluations(employeeId: string, user: RequestUser) {
        const evaluations = await this.prisma.employeeEvaluation.findMany({
            where: { employee_id: employeeId },
            orderBy: { created_at: 'asc' },
        });

        // Authorization Check
        const requestUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: { user_roles: true, employee: true }
        });

        const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
        const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));

        if (!canView) {
            throw new ForbiddenException('You are not authorized to perform this action');
        }

        return evaluations.map((evaluation) => ({
            ...evaluation,
            status: computeStatus(evaluation), // dynamic
        }));
    }
}
