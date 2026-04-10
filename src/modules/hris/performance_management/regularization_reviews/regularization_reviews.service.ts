import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { calculateDueDate } from 'src/utils/helpers/calculate-due-date.helper';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { CreateEvaluationDto } from './dto/evaluation.dto';

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

        // Query the Materialized View
        const employees = await this.prisma.regularizationEligibility.findMany({
            include: {
                employee: {
                    include: {
                        evaluations_received: true,
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

    async createEvaluation(dto: CreateEvaluationDto, user: RequestUser) {
        const employee = await this.prisma.employee.findUnique({
            where: { id: dto.employee_id },
        });

        if (!employee) {
            throw new BadRequestException('Employee not found');
        }

        const dueDate =
            dto.due_date
            ? new Date(dto.due_date)
            : calculateDueDate(employee.hire_date, dto.stage);

        // optional: prevent duplicates
        const existing = await this.prisma.employeeEvaluation.findFirst({
            where: {
            employee_id: dto.employee_id,
            stage: dto.stage,
            },
        });

        if (existing) {
            throw new BadRequestException('Evaluation already exists for this stage');
        }

        return this.prisma.employeeEvaluation.create({
            data: {
            employee_id: dto.employee_id,
            evaluator_id: dto.evaluator_id,
            stage: dto.stage,
            due_date: dueDate,
            probation_date: dto.probation_date,
            regularization_date: dto.regularization_date,
            created_by: user.id,
            },
        });
    }
}
