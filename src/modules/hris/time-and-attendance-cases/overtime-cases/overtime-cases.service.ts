import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { WORKFLOW_ENTITY } from 'src/utils/constants/workflow-entity.constants';
import { OvertimeCasesPaginationDto } from 'src/utils/dtos/overtime-cases-pagination.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';

@Injectable()
export class OvertimeCasesService {

    constructor (private readonly prisma: PrismaService) {}

    async getOvertimeCase(user: RequestUser, overtimeRequestId: string,) {
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
    
        const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
        const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));
    
        if (!canView) {
            throw new ForbiddenException('You are not authorized to perform this action');
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
                                    last_name: true
                                }
                            },
                            position: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            },
                            department: {
                                select: {
                                    id: true,
                                    name: true,
                                }
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
                                }
                            }
                        }
                    }
                }
            });

            if (!overtimeRequest) {
                throw new NotFoundException ("Overtime Request not found")
            }

            const workflowActions = await this.prisma.workflowAction.findMany({
                where: {
                    actionable_type: WORKFLOW_ENTITY.OVERTIME_REQUEST,
                    actionable_id: overtimeRequest.id,
                    action: {
                        in: ["verification", "approval"]
                    }
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
                                            last_name: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            const verifier = workflowActions.find(
                a => a.action === "verification"
            );

            const approver = workflowActions.find(
                a => a.action === "approval"
            )

            const overtime = {
                ...overtimeRequest,
                verifier: verifier?.acted_by_user ?? null,
                approver: approver?.acted_by_user ?? null,
            };

            return {
                status: 'success',
                message: 'Here is the Overtime Request',
                overtimeRequest: overtime
            }
        } catch (e) {
            if (e instanceof NotFoundException) {
                throw e;
            }
        }
    }

    async getOvertimeCases(user: RequestUser, dto: OvertimeCasesPaginationDto) {
        const { search, status, sortBy, order, page, perPage } = dto;
        
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
    
        const allowedRoles = ['Administrator', 'Super Administrator', 'HR Manager', 'HR Clerk', 'HR Staff'];
        const canView = requestUser?.user_roles.some(role => allowedRoles.includes(role.role_name));
    
        if (!canView) {
            throw new ForbiddenException('You are not authorized to perform this action');
        }

        const skip = (page - 1) * perPage;

        const whereCondition: Prisma.HrOvertimeRequestWhereInput = {
            is_active: true
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

        const allowSortFields = [
            'created_by'
        ]

        const safeSortBy = allowSortFields.includes(sortBy) ? sortBy: 'created_at';

        const [total, overtimes] = await this.prisma.$transaction([
            this.prisma.hrOvertimeRequest.count({
                where: {
                    ...whereCondition,
                    ...whereConditions
                }
            }),
            this.prisma.hrOvertimeRequest.findMany({
                where: {
                    ...whereCondition,
                    ...whereConditions
                },
                skip,
                take: perPage,
                orderBy: {
                    [safeSortBy]: order,
                },
            }),
        ]);

        const overtimeIds = overtimes.map(l => l.id);

        const workflowActions = await this.prisma.workflowAction.findMany({
            where: {
                actionable_type: WORKFLOW_ENTITY.OVERTIME_REQUEST,
                actionable_id: {
                    in: overtimeIds
                },
                action: {
                    in: ["verification", "approval"]
                }
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
                                        last_name: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        const formattedOvertimes = overtimes.map(overtime => {
            const verifier = workflowActions.find(a =>
                a.actionable_id === overtime.id &&
                a.action === "verification"
            );
            const approver = workflowActions.find(a =>
                a.actionable_id === overtime.id &&
                a.action === "approval"
            );
            return {
                ...overtime,
                verifier: verifier?.acted_by_user ?? null,
                approver: approver?.acted_by_user ?? null,
            }
        });

        return {
            status: 'success',
            message: 'List of Overtime Cases',
            count: total,
            page,
            perPage,
            overtimes: formattedOvertimes
        }
    }

    // async createOvertimeCase(user: Request, dto: ) {

    // }
}
