import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { AcknowledgeEvaluationDto, SubmitEvaluationDto } from './dto/performance_evaluation.dto';
import { Request } from 'express';
import { WORKFLOW_ENTITY } from 'src/utils/constants/workflow-entity.constants';

@Injectable()
export class PerformanceEvaluationService {
    constructor (private readonly prisma: PrismaService) {}

    async getMyEvaluations(user: RequestUser) {

        const requestUser = await this.prisma.user.findUnique({
            where: { id: user.id },
                select: {
                    employee: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        const myEvaluations = await this.prisma.hrEmployeeEvaluation.findMany({
            where: {
                employee_id: requestUser?.employee?.id,
            },
        });

        return {
            status: 'success',
            message: 'List of evaluations I received',
            myEvaluations,
        };
    }

    async getToBeEvaluated(user: RequestUser) {
        const requestUser = await this.prisma.user.findUnique({
            where: { id: user.id },
                select: {
                    employee: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        const toBeEvaluated = await this.prisma.hrEmployeeEvaluation.findMany({
            where: {
                evaluator_id: requestUser?.employee?.id,
                evaluated_on: null
            },
        });

        return {
            status: 'success',
            message: 'List of Employees I will evaluate',
            toBeEvaluated,
        };
    }

    async getDoneEvaluated(user: RequestUser) {
        // Authorization Check
        const requestUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: { 
                user_roles: true, 
                employee: true,
            }
        });

        if (!requestUser || !requestUser.employee) {
            throw new BadRequestException(`User does not exist.`);
        }

        const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
        const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));

        if (!canView) {
            throw new ForbiddenException('You are not authorized to perform this action');
        }

        const doneEvaluated = await this.prisma.hrEmployeeEvaluation.findMany({
            where: { evaluator_id: requestUser.employee.id , evaluated_on: { not: null } }
        })

        if (!doneEvaluated.length) {
            throw new NotFoundException('No evaluations done yet')
        }

        return {
            status: 'success',
            message: 'List of completed/submitted evaluations',
            doneEvaluated
        };
    }

    async submit(evaluationId: string, user: RequestUser, dto: SubmitEvaluationDto) {
        
        // Authorization Check
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

        if (!requestUser || !requestUser.employee) {
            throw new BadRequestException(`User does not exist.`);
        }

        const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
        const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));

        if (!canView) {
            throw new ForbiddenException('You are not authorized to perform this action');
        }
        
        const existingEvaluation = await this.prisma.hrEmployeeEvaluation.findFirst({
            where: { id: evaluationId }
        })

        if (!existingEvaluation) {
            throw new NotFoundException('Evaluation not found or does not exist')
        }

        return this.prisma.$transaction(async (tx) => {
            try {
                // Delete old details (if re-submitting)
                await tx.hrPerformanceEvaluationDetails.deleteMany({
                    where: { evaluation_id: evaluationId },
                });

                // Insert new details
                await tx.hrPerformanceEvaluationDetails.createMany({
                        data: dto.details.map(d => ({
                        evaluation_id: evaluationId,
                        competency_id: d.competency_id,
                        rating: d.rating,
                        remarks: d.remarks,
                    })),
                });

                // Compute overall rating
                const map = {
                    unsatisfactory: 1,
                    needs_improvement: 2,
                    meets_expectations: 3,
                    exceed_expectations: 4,
                    exceptional: 5,
                };

                const scores = dto.details.map(d => map[d.rating]);
                const overall = Math.round(
                    scores.reduce((a, b) => a + b, 0) / scores.length
                );

                // Update evaluation
                const submitEvaluation = await tx.hrEmployeeEvaluation.update({
                    where: { id: evaluationId },
                    data: {
                        status: "for_acknowledgment",
                        overall_rating: overall,
                        decision: dto.decision,
                        comments: dto.comments,
                        evaluated_on: new Date(),
                        updated_by: user.id,
                        completed_at: new Date(),
                        // status: 'evaluated',
                    },
                });

                await tx.workflowAction.create({
                    data: {
                        actionable_type: WORKFLOW_ENTITY.EMPLOYEE_EVALUATION,
                        actionable_id: evaluationId,
                        action: "submit",
                        acted_by: requestUser.id
                    }
                })

                const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
                const userPosition = requestUser.employee.position.name;

                return {
                    status: 'success',
                    message: 'Employee Evaluation Verified',
                    submitEvaluation,
                    verified_by: `${userName} - ${userPosition}`,
                };
            } catch (e) {
                throw e;
            }
        });        
    }

    async acknowledge(user: RequestUser, evaluationId: string, dto: AcknowledgeEvaluationDto) {
        // Authorization Check
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

        if (!requestUser || !requestUser.employee || !requestUser.employee.id) {
            throw new BadRequestException(`User does not exist.`);
        }

        const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
        const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));

        if (!canView) {
            throw new ForbiddenException('You are not authorized to perform this action');
        }

        return this.prisma.$transaction(async (tx) => {
            try {
                const acknowledgeEvaluation = await tx.hrEmployeeEvaluation.update({
                    where: { 
                        id: evaluationId, 
                        employee_id: requestUser.employee.id , 
                        evaluated_on: { not: null }, 
                        type_of_evaluation: { not: null },
                        overall_rating: { not: null }
                    },
                    data: {
                        status: "for_verification",
                        response: dto.response,
                        acknowledged_on: new Date(),
                    }
                })

                if (!acknowledgeEvaluation) {
                    throw new NotFoundException('No evaluations done yet')
                }

                await tx.workflowAction.create({
                    data: {
                        actionable_type: WORKFLOW_ENTITY.EMPLOYEE_EVALUATION,
                        actionable_id: evaluationId,
                        action: "acknowledge",
                        acted_by: requestUser.id
                    }
                })

                const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
                const userPosition = requestUser.employee.position.name;

                return {
                    status: 'success',
                    message: 'Evaluation successfully acknowledge',
                    acknowledgeEvaluation,
                    acknowledge_by: `${userName} - ${userPosition}`,
                }
            } catch (e) {
                if (e instanceof NotFoundException) {
                    throw e; // keep your validation errors
                }
            }
        })
    }
}
