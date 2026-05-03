import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { computeEvaluationStatus, getExpectedDueDate } from 'src/utils/helpers/calculate-date.helper';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { CreateEvaluationDto } from './dto/evaluation.dto';
import { PREVIOUS_STAGE_MAP } from 'src/utils/constants/evaluation.constant';
import { Prisma } from '@prisma/client';
import { RegularizationReviewDto } from 'src/utils/dtos/regularization-pagination.dto';
import { EvaluationStage, EvaluationStatus } from '@prisma/client';
import { computeOverallStatus } from 'src/utils/helpers/compute-overall-status.helper';

@Injectable()
export class RegularizationReviewsService {
    constructor(private readonly prisma:PrismaService) {}

    async getForRegularization(user: RequestUser, dto: RegularizationReviewDto) {
        const { search, sortBy, order, page, perPage } = dto;

        const skip = (page - 1) * perPage;
        
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

        let whereCondition: Prisma.RegularizationEligibilityWhereInput = {};
        if (search) {
            whereCondition.OR = [
                { employee: { person: { first_name: { contains: search, mode: 'insensitive' } } } },
                { employee: { person: { last_name: { contains: search, mode: 'insensitive' } } } },
                { employee: { position: { name: { contains: search, mode: 'insensitive' } } } },
                { employee: { department: { name: { contains: search, mode: 'insensitive' } } } },
            ];
        }

        //  materialized view fast query but just snapshot needs to be refresh to get fresh data compared to normal view 
        // await this.prisma.$executeRawUnsafe(
        //     `REFRESH MATERIALIZED VIEW "RegularizationEligibility"`
        // );

        // Query the Materialized View
        // const employees = await this.prisma.regularizationEligibility.findMany({
        //     where: whereCondition,
        //     include: {
        //         employee: {
        //             include: {
        //                 evaluations_received: {
        //                     select: {
        //                         id: true,
        //                         employee_id: true,
        //                         evaluator_id: true,
        //                         stage: true,
        //                         // status: true,
        //                         probation_date: true,
        //                         regularization_date: true,
        //                         completed_at: true,
        //                     }
        //                 },
        //                 evaluations_given: true,
        //                 employment_history: {
        //                     where: { is_active: true },
        //                     take: 1,
        //                     orderBy: { effective_date: 'desc' }
        //                 }
        //             }
        //         }
        //     },
        //     orderBy: { [sortBy || 'created_at']: order || 'asc' },
        // });

        const sortMap = {
            employee_created_at: {
                employee: {
                    created_at: order || 'desc'
                }
            },
            hire_date: { hire_date: order || 'desc' },
        };

        const sortOrder =
            sortMap[sortBy as keyof typeof sortMap] ||
            sortMap.employee_created_at;

        const [total, employees] = await this.prisma.$transaction([
            this.prisma.regularizationEligibility.count({
                where: whereCondition,
            }),
            this.prisma.regularizationEligibility.findMany({
                where: whereCondition,
                include: {
                    employee: {
                        select: {
                            id: true,
                            company: {
                                select: {
                                    id: true,
                                    name: true,
                                }
                            },
                            person: {
                                select: {
                                    id: true,
                                    first_name: true,
                                    last_name: true,
                                }
                            },
                            employee_id: true,
                            department: {
                                select: {
                                    id: true,
                                    name: true,
                                }
                            },
                            position: {
                                select: {
                                    id: true,
                                    name: true,
                                }
                            },
                            division: {
                                select: {
                                    id: true,
                                    name: true,
                                }
                            },
                            employment_status: {
                                select: {
                                    id: true,
                                    label: true,
                                }
                            },
                            employee_type: true,
                            employment_type: true,
                            evaluations_received: {
                                select: {
                                    employee_id: true,
                                    evaluator: {
                                        select: {
                                            id: true,
                                            person: {
                                                select: {
                                                    first_name: true,
                                                    middle_name: true,
                                                    last_name: true,
                                                }
                                            }
                                        }
                                    },
                                    stage: true,
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
                            },
                            created_at: true,
                        },
                    }
                },
                skip,
                take: perPage,
                orderBy: sortOrder,
            })
        ]);

        return {
            status: 'success',
            message: 'List of Employees for Regularization',
            count: total,
            page,
            perPage,
            // totalPage: Math.ceil(total / perPage),
            employees
        };
    }

    async createEvaluation(dto: CreateEvaluationDto, user: RequestUser) {
        
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
            const previous = await this.prisma.hrEmployeeEvaluation.findFirst({
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
        // for (const [stage, months] of Object.entries(STAGE_RULES)) {
        //     // const due = addMonths(hireDate, months);

        //     if (isAfter(now)) {
        //     const existingEval = await this.prisma.employeeEvaluation.findFirst({
        //         where: {
        //         employee_id: dto.employee_id,
        //         stage: stage as any,
        //         },
        //     });

        //     if (!existingEval) {
        //         throw new BadRequestException(
        //         `Missing ${stage}. It is already overdue.`
        //         );
        //     }
        //     }
        // }

        // Compute due date
        const expectedDueDate = getExpectedDueDate(hireDate, dto.stage);

        // Create evaluation (NO status saved)
        const evaluation = await this.prisma.hrEmployeeEvaluation.create({
            data: {
                employee_id: dto.employee_id,
                evaluator_id: dto.evaluator_id,
                stage: dto.stage,
                type_of_evaluation: dto.type_of_evaluation,
                probation_date: new Date(dto.probation_date),
                regularization_date: new Date(dto.regularization_date),
                created_by: user.id,
            },
        });

        // Return with computed status
        return {
            ...evaluation,
            status: computeEvaluationStatus(evaluation),
        };
    }

    async getEmployeeEvaluations(employeeId: string, user: RequestUser) {
        const evaluations = await this.prisma.hrEmployeeEvaluation.findMany({
            where: { employee_id: employeeId },
            include: {
                employee: true, // required for hire date employee query
            },
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
            status: computeEvaluationStatus(evaluation), // dynamic
        }));
    }

    async getEvaluations(user: RequestUser, dto: RegularizationReviewDto) {
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

        // Prepare search conditions
        let whereCondition: Prisma.HrEmployeeEvaluationWhereInput = {};
        if (search) {
            // Exact match only
            // const stageEnumMatch = Object.values(EvaluationStage).find(v => v === search);
            // const statusEnumMatch = Object.values(EvaluationStatus).find(v => v === search);

            // Fuzzy search or as long as it matches input
            const stageMatches = Object.values(EvaluationStage).filter((v) =>
                v.toLowerCase().includes(search.toLowerCase())
            );

            const statusMatches = Object.values(EvaluationStatus).filter((v) =>
                v.toLowerCase().includes(search.toLowerCase())
            );

            whereCondition.OR = [
                { employee: { person: { first_name: { contains: search, mode: 'insensitive' } } } },
                { employee: { person: { last_name: { contains: search, mode: 'insensitive' } } } },
                { evaluator: { person: { first_name: { contains: search, mode: 'insensitive' } } } },
                { evaluator: { person: { last_name: { contains: search, mode: 'insensitive' } } } },
            ];

            // Exact match only
            // if (stageEnumMatch) whereCondition.OR.push({ stage: stageEnumMatch });
            // if (statusEnumMatch) whereCondition.OR.push({ status: statusEnumMatch });

            // Fuzzy search or as long as it matches input
            if (stageMatches.length > 0) {
                whereCondition.OR.push({
                    stage: {
                    in: stageMatches,
                    },
                });
            }

            if (statusMatches.length > 0) {
                whereCondition.OR.push({
                    status: {
                    in: statusMatches,
                    },
                });
            }
        }

        // Db fetch
        // If you must filter by a compted property (overall_status), 
        // you have to fetch more records or handle pagination in memory.
        const evaluations = await this.prisma.hrEmployeeEvaluation.findMany({
            where: whereCondition,
            include: {
                employee: { 
                    select: 
                    {   id: true, 
                        person: 
                        { select: 
                            {   
                                first_name: true, 
                                last_name: true 
                            } 
                        }, 
                        company: 
                        { select: 
                            { 
                                id: true, 
                                name: true,
                                abbreviation: true,
                            }
                        }, 
                        position: 
                        { select: 
                            { 
                                id: true, 
                                name: true 
                            },
                        }, 
                        department: 
                        { select: 
                            {
                                id: true, 
                                name: true,
                            }
                        }, 
                        employee_type: true,
                        employment_type: true 
                    }
                },
                evaluator: { select: { id: true, person: { select: { first_name: true, last_name: true } } } }
            },
            orderBy: { [sortBy || 'created_at']: order || 'asc' },
        });

        // In memory processing (grouping and computing)
        const grouped = new Map<string, any[]>();
        for (const evalItem of evaluations) {
            if (!grouped.has(evalItem.employee_id)) grouped.set(evalItem.employee_id, []);
            grouped.get(evalItem.employee_id)!.push(evalItem);
        }

        let processedResults = [];
        for (const [employeeId, evals] of grouped.entries()) {
            const overallStatus = computeOverallStatus(evals);
            for (const evaluation of evals) {
                processedResults.push({
                    ...evaluation,
                    stage_status: computeEvaluationStatus(evaluation),
                    overall_status: overallStatus,
                });
            }
        }

        // Filtering by computed stats
        if (status) {
            processedResults = processedResults.filter(e => e.overall_status === status);
        }

        // Manual Pagination (Since we filtered in memory)
        const total = processedResults.length;
        const skip = (page - 1) * perPage;
        const paginatedResults = processedResults.slice(skip, skip + perPage);

        return {
            status: 'success',
            message: 'List of evaluated employees',
            count: total,
            page,
            perPage,
            employeeEvaluations: paginatedResults,
        };
    }

    async statusCount(user: RequestUser) {

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

        const whereCondition: Prisma.HrEmployeeEvaluationWhereInput = {
            is_active: true,
        }

        const [counts] = await Promise.all([
            this.prisma.hrEmployeeEvaluation.groupBy({
                by: ['status'],
                where: whereCondition,
                _count: { _all: true },
            }),
            this.prisma.hrEmployeeEvaluation.count({
                where: { is_active: true }
            }),
        ]);

        const result = {
            // all: 0,
            for_evaluation: 0,
            for_verification: 0,
            for_approval: 0,
            for_acknowledgment: 0
        };

        counts.forEach((item) => {
            const statusKey = item.status.toLowerCase();

            if (Object.prototype.hasOwnProperty.call(result, statusKey)) {
                const key = statusKey as keyof typeof result;

                const countValue = item._count._all;
                result[key] = countValue;
                // result.all += countValue;
            }
        });

        return {
            status: 'success',
            message: 'Here is the status count for employee evaluation',
            result,
        };
    }
}
