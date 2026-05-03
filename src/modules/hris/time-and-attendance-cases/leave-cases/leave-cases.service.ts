import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { CreateLeaveRequestWithDetailsDto } from './dto/leave-case.dto';
import { WORKFLOW_ENTITY } from 'src/utils/constants/workflow-entity.constant';
import { LeaveRequestPaginationDto } from 'src/utils/dtos/leave-request.dto';


@Injectable()
export class LeaveCasesService {
    constructor (private readonly prisma: PrismaService) {}

    async getLeaveCases(user: RequestUser, dto: LeaveRequestPaginationDto) {
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

        const whereCondition: Prisma.HrLeaveRequestWhereInput = {
            is_active: true
        }

        const whereConditions: Prisma.HrLeaveRequestWhereInput = {};

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

        const allowSortFeilds = [
            'created_by'
        ];

        const safeSortBy = allowSortFeilds.includes(sortBy) ? sortBy : 'created_at';

        const [total, leaves] = await this.prisma.$transaction([
            this.prisma.hrLeaveRequest.count({
                where: {
                    ...whereCondition,
                    ...whereConditions
                },
            }),
            this.prisma.hrLeaveRequest.findMany({
                where: {
                    ...whereCondition,
                    ...whereConditions
                },
                include: {
                    hr_leave_dates: true,
                },
                skip,
                take: perPage,
                orderBy: {
                    [safeSortBy]: order,
                },
            }),
        ]);

        return {
            status: 'success',
            message: 'List of Leave Cases',
            count: total,
            page,
            perPage,
            leaves
        }
    }

    async createLeaveCase(
        user: RequestUser,
        dto: CreateLeaveRequestWithDetailsDto
    ) {
        const { leave_request, leave_dates } = dto

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

        return this.prisma.$transaction(async (tx) => {
            try {
                if(leave_dates.length === 0) {
                    throw new BadRequestException("Leave dates cannot be empty");
                }

                const from = new Date(leave_request.date_from);
                const to = new Date(leave_request.date_to);

                const expectedDates: string[] = [];

                let current = new Date(from);
                while (current <= to) {
                    expectedDates.push(current.toISOString().split('T')[0]);
                    current.setDate(current.getDate() + 1);
                }

                const inputDates = leave_dates.map(d =>
                    new Date(d.leave_date).toISOString().split('T')[0]
                );

                if (expectedDates.length !== inputDates.length) {
                    throw new BadRequestException(
                        'Leave dates do not match the selected date range'
                    );
                }

                const missingDates = expectedDates.filter(d => !inputDates.includes(d));

                if (missingDates.length > 0) {
                    throw new BadRequestException(
                        `Missing leave dates: ${missingDates.join(', ')}`
                    );
                }

                const uniqueDates = new Set(
                    leave_dates.map(d => d.leave_date)
                );

                if (uniqueDates.size !== leave_dates.length) {
                    throw new BadRequestException("Duplicate leave dates detected");
                }

                const no_of_days = leave_dates.reduce(
                    (sum, d) => sum + (d.fraction ?? 1),
                    0
                );

                const conflict = await tx.hrLeaveDates.findFirst({
                    where: {
                        employee_id: leave_request.employee_id,
                        leave_date: {
                            in: leave_dates.map(d => new Date(d.leave_date))
                        },
                        hr_leave_request: {
                            status: {
                                notIn: ["cancelled", "rejected"]
                            }
                        }
                    }
                });

                if (conflict) {
                    throw new BadRequestException(
                        "Conflicting leave date exists (active request already exists)"
                    );
                }

                const leaveRequest = await tx.hrLeaveRequest.create({
                    data: {
                        employee_id: leave_request.employee_id,
                        date_from: new Date(leave_request.date_from),
                        date_to: new Date(leave_request.date_to),
                        reason: leave_request.reason,
                        contact_number: leave_request.contact_number,
                        address_on_leave: leave_request.address_on_leave,
                        no_of_days: no_of_days,
                        reliever_id: leave_request.reliever_id,
                        verifier_id: leave_request.verifier_id,
                        approver_id: leave_request.approver_id,
                        created_by: requestUser.id,

                        hr_leave_dates: {
                            create: leave_dates.map(d => ({
                                leave_date: new Date(d.leave_date),
                                employee: {
                                    connect: { id: leave_request.employee_id }
                                },
                                category: {
                                    connect: { id: d.leave_type }
                                },
                                fraction: d.fraction ?? 1.0,
                            })),
                        }
                    },
                    include: {
                        hr_leave_dates: true
                    }
                });

                if (leaveRequest.employee_id )

                // ADD WORKFLOW ACTION
                await tx.workflowAction.create({
                    data: {
                        actionable_type: WORKFLOW_ENTITY.LEAVE_REQUEST,
                        actionable_id: leaveRequest.id,
                        action: "created",
                        acted_by: requestUser.id
                    }
                });

                const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
                const userPosition = requestUser.employee.position.name;

                return {
                    status: 'success',
                    message: 'Leave Request Createad',
                    leaveRequest,
                    created_by: `${userName} - ${userPosition}`,
                };
            } catch (e) {
                if (e instanceof BadRequestException) {
                    throw e; // keep your validation errors
                }

                throw new Error ('Leave Request cannot be created')
            }
        });
    }

    async statusCount(user: RequestUser) {
        // Count per status and also if isActive is true or false
        // const { is_active } = dto;

        // const whereCondition: Prisma.ApplicantWhereInput = {
        //   ...(is_active !== undefined && { is_active }),
        // };

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

        const whereCondition: Prisma.HrLeaveRequestWhereInput = {
        is_active: true,
        // ...(is_active === true)
        };

        // Execute queries
        const [counts] = await Promise.all([
        this.prisma.hrLeaveRequest.groupBy({
            by: ['status'],
            where: whereCondition, // This is {} if filter is empty, meaning "Fetch All"
            _count: { _all: true },
        }),
        this.prisma.applicant.count({
            where: { is_active: true }, // We always want this count regardless of the filter
        }),
        ]);

        // Build the response object with defaults
        const result = {
        all: 0,
        draft: 0,
        for_verification: 0,
        for_approval: 0,
        for_processing: 0,
        processed: 0,
        cancelled: 0,
        rejected: 0,
        // isActive: totalActiveCount,
        };

        // Populate the result based on the DB response
        counts.forEach((item) => {
        const statusKey = item.status.toLowerCase();

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
        message: 'Here is the status count for applicants',
        result,
        };
    }

    async submitLeave(hrLeaveRequestId: string, user: RequestUser) {
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

        return this.prisma.$transaction(async (tx) => {

            const submitLeave = await tx.hrLeaveRequest.update({
                where: { id: hrLeaveRequestId, status: "draft" },
                data: {
                    status: "for_verification",
                    updated_by: requestUser.id
                }
            });

            await tx.workflowAction.create({
                data: {
                    actionable_type: WORKFLOW_ENTITY.LEAVE_REQUEST,
                    actionable_id: hrLeaveRequestId,
                    action: "submitted",
                    acted_by: user.id
                }
            });

            const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
            const userPosition = requestUser.employee.position.name;

            return {
                status: 'success',
                message: 'Leave Request Submitted',
                submitLeave,
                submitted_by: `${userName} - ${userPosition}`,
            };
        });
    }

    async verifyLeave(hrLeaveRequestId: string, user: RequestUser) {
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

        return this.prisma.$transaction(async (tx) => {

            const verifyLeave = await tx.hrLeaveRequest.update({
                where: { id: hrLeaveRequestId, status: "for_verification" },
                data: {
                    status: "for_approval",
                    verifier_id: requestUser.id,
                    updated_by: requestUser.id
                }
            });

            // if(verifyLeave.status != 'for_verification') {
            //     throw new BadRequestException('Leave request cannot be verify it needs to be submitted first')
            // }

            await tx.workflowAction.create({
                data: {
                    actionable_type: "LeaveRequest",
                    actionable_id: hrLeaveRequestId,
                    action: "verified",
                    acted_by: requestUser.id
                }
            });

            const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
            const userPosition = requestUser.employee.position.name;

            return {
                status: 'success',
                message: 'Leave Request Verified',
                verifyLeave,
                verified_by: `${userName} - ${userPosition}`,
            };
        });
    }
    
    async approveLeave(hrLeaveRequestId: string, user: RequestUser) {
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

        return this.prisma.$transaction(async(tx) => {
            try {
                const approveLeave = await tx.hrLeaveRequest.update({
                    where: { id: hrLeaveRequestId, status: "for_approval" },
                    data: {
                        status: "for_processing",
                        approver_id: requestUser.id,
                        updated_by: requestUser.id
                    }
                })

                await tx.workflowAction.create({
                    data: {
                        actionable_type: WORKFLOW_ENTITY.LEAVE_REQUEST,
                        actionable_id: hrLeaveRequestId,
                        action: 'approved',
                        acted_by: requestUser.id
                    }
                })

                const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
                const userPosition = requestUser.employee.position.name;

                return {
                    status: 'success',
                    message: 'Leave Request Approved',
                    approveLeave,
                    approved_by: `${userName} - ${userPosition}`,
                };
            } catch (e) {
                if (e instanceof BadRequestException) {
                    throw e; // keep your validation errors
                }
                // throw new Error ('Leave Request cannot be approved')
            }
            
        })
    }

    async processLeave(hrLeaveRequestId: string, user: RequestUser) {
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

        return this.prisma.$transaction(async(tx) => {
            try {
                const processLeave = await tx.hrLeaveRequest.update({
                    where: { id: hrLeaveRequestId, status: "for_processing" },
                    data: {
                        status: 'processed',
                        updated_by: requestUser.id                  
                    }
                })

                await tx.workflowAction.create({
                    data: {
                        actionable_type: WORKFLOW_ENTITY.LEAVE_REQUEST,
                        actionable_id: hrLeaveRequestId,
                        action: 'processed',
                        acted_by: requestUser.id
                    }
                })

                const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
                const userPosition = requestUser.employee.position.name;

                return {
                    status: 'success',
                    message: 'Leave Request Processed',
                    processLeave,
                    processed_by: `${userName} - ${userPosition}`,
                };
            } catch (e) {
                throw new Error ('Invalid status for processing leave request')
            }
        })
    }

    async rejectLeave(hrLeaveRequestId: string, user: RequestUser) {
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

        return this.prisma.$transaction(async(tx) => {
            // update many approach if try and catch does not really fit
            // const result = await this.prisma.hrLeaveRequest.updateMany({
            //     where: { 
            //         id: hrLeaveRequestId, 
            //         status: {
            //         in: ['for_verification', 'for_approval', 'for_processing']
            //         }
            //     },
            //     data: {
            //         status: 'rejected'
            //     }
            // });

            // if (result.count === 0) {
            //     throw new Error('Leave request cannot be rejected in its current status');
            // }

            try {
                const rejectLeave = await tx.hrLeaveRequest.update({
                    where: { 
                        id: hrLeaveRequestId, 
                        OR: [
                            { status: 'for_verification' },
                            { status: 'for_approval' },
                            { status: 'for_processing' }
                        ]
                    },
                    data: {
                        status: 'rejected',
                        updated_by: requestUser.id
                    }
                });

                await tx.workflowAction.create({
                    data: {
                        actionable_type: WORKFLOW_ENTITY.LEAVE_REQUEST,
                        actionable_id: hrLeaveRequestId,
                        action: 'reject',
                        acted_by: requestUser.id
                    }
                });

                const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
                const userPosition = requestUser.employee.position.name;

                return {
                    status: 'success',
                    message: 'Leave Request Rejected',
                    rejectLeave,
                    rejected_by: `${userName} - ${userPosition}`,
                };
            } catch (e) {
                // if (e instanceof BadRequestException) {
                //     throw e; // keep your validation errors
                // }
                throw new Error('Invalid status for rejection');
            }
        })
    }

    async cancelLeave(hrLeaveRequestId: string, user: RequestUser) {
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

        return this.prisma.$transaction(async(tx) => {
            try {
                const cancelLeave = await tx.hrLeaveRequest.update({
                    where: { 
                        id: hrLeaveRequestId,
                        OR: [
                            { status: 'draft' },
                            { status: 'for_verification' },
                            { status: 'for_approval' },
                            { status: 'processed' },
                        ]
                    },
                    data: {
                        status: 'cancelled',
                        updated_by: requestUser.id
                    }
                })

                await tx.workflowAction.create({
                    data: {
                        actionable_type: WORKFLOW_ENTITY.LEAVE_REQUEST,
                        actionable_id: hrLeaveRequestId,
                        action: 'cancel',
                        acted_by: requestUser.id
                    }
                })

                const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
                const userPosition = requestUser.employee.position.name;

                return {
                    status: 'success',
                    message: 'Leave Request Cancelled',
                    cancelLeave,
                    cancelled_by: `${userName} - ${userPosition}`,
                }
            } catch (e) {
                throw new Error ('Invalid status for cancellation')
            }
        })
    }
}
