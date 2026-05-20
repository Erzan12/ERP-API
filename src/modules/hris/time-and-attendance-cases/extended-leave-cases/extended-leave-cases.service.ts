import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { CreateExtendedLeaveRequestWithDetailsDto } from './dto/extended-leave-request.dto';
import { WORKFLOW_ENTITY } from 'src/utils/constants/workflow-entity.constants';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExtendedLeaveCasesService {
    constructor(private readonly prisma: PrismaService) {}

    async getExtendedLeaves(user: RequestUser) {
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

        const extendedLeaves = await this.prisma.hrExtendedLeaveRequest.findMany({
            where: {
                hr_leave_request: {
                    is_active: true,
                },
            },
            include: {
                hr_leave_request: true,
            },
        })

        return {
            status: 'success',
            message: 'List of Extended Leave Request',
            extendedLeaves
        }
    }

    async getExtendedLeave(user: RequestUser, extendedHrLeaveRequestId: string) {
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

        const extendedLeave = await this.prisma.hrExtendedLeaveRequest.findUnique({
            where: { 
                id: extendedHrLeaveRequestId, 
                hr_leave_request: {
                    is_active: true,
                }, 
            },
            include: {
                hr_leave_request: true,
            },
        });

        return {
            status: 'success',
            message: 'Here is the Extended Leave Request',
            extendedLeave
        }
    }

    async createExtendedLeaveRequest(user: RequestUser, extendedHrLeaveRequestId: string, dto: CreateExtendedLeaveRequestWithDetailsDto) {
        const { extended_leave_request, extended_leave_dates } = dto;

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
                // const existingLeaveRequest = await this.prisma.hrExtendedLeaveRequest.findUnique({
                //     where: { 
                //         id: extendedHrLeaveRequestId, 
                //         hr_leave_request: {
                //             is_active: true,
                //         }, 
                //     }
                // })

                // if (!existingLeaveRequest) {
                //     throw new NotFoundException ("Leave Request does not exist")
                // }

                // query first the leave request to connect
                const leaveRequest = await this.prisma.hrLeaveRequest.findFirst({
                    where: {
                        id: extended_leave_request.leave_request_id,
                        status: 'processed', // or LeaveRequestStatus.processed
                        is_active: true,
                    },
                    select: {
                        id: true,
                        employee_id: true,
                    },
                });

                if (!leaveRequest) {
                    throw new BadRequestException(
                        'Leave request must be processed before extension can be created',
                    );
                }

                const extendedLeaveRequest = await this.prisma.hrExtendedLeaveRequest.create({
                    data: {
                        leave_request_id: extended_leave_request.leave_request_id,
                        reliever_id: extended_leave_request.reliever_id,
                        extension_date_from: new Date(extended_leave_request.extension_date_from),
                        extension_date_to: new Date(extended_leave_request.extension_date_to),
                        return_date: extended_leave_request.return_date || null,
                        extended_leave_request_status: extended_leave_request.extended_leave_request_status,
                        reason_for_extension: extended_leave_request.reason_for_extension,
                        contact_no_while_on_leave: extended_leave_request.contact_number,
                        address_while_on_leave: extended_leave_request.address_on_leave,
                        hr_leave_dates: {
                            create: extended_leave_dates.map(d => ({
                                leave_date: new Date(d.leave_date),
                                employee: {
                                    connect: { id: leaveRequest.employee_id }
                                },
                                hr_leave_request: {
                                    connect: {
                                        id: leaveRequest.id,
                                    },
                                },
                                leave_compensation: d.leave_compensation,
                                fraction: d.fraction ?? 1.0,
                            })),
                        }
                    },
                    include: {
                        hr_leave_dates: true,
                        reliever: true,
                    }
                });

                const [verifierUser, approverUser, currentUser] = await Promise.all([
                    tx.user.findUnique({
                        where: {
                            id: extended_leave_request.verifier_id
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
                                        }
                                    }
                                }
                            }
                        }
                    }),

                    tx.user.findUnique({
                        where: {
                            id: extended_leave_request.approver_id
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
                                        }
                                    }
                                }
                            }
                        }
                    }),

                    tx.user.findUnique({
                        where: {
                            id: requestUser.id
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
                                        }
                                    }
                                }
                            }
                        }
                    })
                ]);

                // build names
                const verifierName = verifierUser
                    ? [
                        verifierUser.employee?.person?.first_name,
                        verifierUser.employee?.person?.middle_name,
                        verifierUser.employee?.person?.last_name,
                    ]
                        .filter(Boolean)
                        .join(" ")
                    : "";
                
                const approverName = approverUser
                    ? [
                        approverUser.employee?.person?.first_name,
                        approverUser.employee?.person?.middle_name,
                        approverUser.employee?.person?.last_name,
                    ]
                        .filter(Boolean)
                        .join(" ")
                    : "";

                const creatorName = currentUser
                    ? [
                        currentUser.employee?.person?.first_name,
                        currentUser.employee?.person?.middle_name,
                        currentUser.employee?.person?.last_name,
                    ]
                        .filter(Boolean)
                        .join(" ")
                    : "";

                // ADD WORKFLOW ACTION
                await tx.workflowAction.createMany({
                    data: [
                        { 
                            actionable_type: WORKFLOW_ENTITY.EXTENDED_LEAVE_REQUEST,
                            actionable_id: extendedLeaveRequest.id,
                            action: "creation",
                            acted_by: requestUser.id,
                            acted_at: new Date(),
                            metadata: {
                                title: "Extended Leave Request created",
                                message: "You have created a new Extended Leave Request",
                                user: creatorName,
                                role: "creator",
                            }
                        },
                        {
                            actionable_type: WORKFLOW_ENTITY.EXTENDED_LEAVE_REQUEST,
                            actionable_id: extendedLeaveRequest.id,
                            action: "verification",
                            acted_by: extended_leave_request.verifier_id,
                            metadata: {
                                title: "Verify Extended Leave Request",
                                message: "You have a new Verify Request",
                                user: verifierName,
                                role: "verifier",
                            },
                            acted_at: null,
                        },
                        {
                            actionable_type: WORKFLOW_ENTITY.EXTENDED_LEAVE_REQUEST,
                            actionable_id: extendedLeaveRequest.id,
                            action: "approval",
                            acted_by: extended_leave_request.approver_id,
                            metadata: {
                                title: "Approve Leave Request",
                                message: "You have a new Approval Request",
                                user: approverName,
                                role: "approver",
                            },
                            acted_at: null,
                        }
                    ]  
                });

                const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
                const userPosition = requestUser.employee.position.name;

                return {
                    status: 'success',
                    message: 'Extended Leave Request Createad',
                    extendedLeaveRequest,
                    created_by: `${userName} - ${userPosition}`,
                };
            } catch (e) {
                throw e;
            }
        })
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

        const whereCondition: Prisma.HrExtendedLeaveRequestWhereInput = {
            is_active: true,
            // ...(is_active === true)
        };

            // Execute queries
        const [counts] = await Promise.all([
            this.prisma.hrExtendedLeaveRequest.groupBy({
                by: ['extended_leave_request_status'],
                where: whereCondition, // This is {} if filter is empty, meaning "Fetch All"
                _count: { _all: true },
            }),
            this.prisma.hrExtendedLeaveRequest.count({
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
        const statusKey = item.extended_leave_request_status.toLowerCase();

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
            message: 'Here is the status count for Extended Leave Requests',
            result,
        };
    }

    async submitExtendedLeave(extendedHrLeaveRequestId: string, user: RequestUser) {
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
                const submitExtendedLeave = await tx.hrExtendedLeaveRequest.update({
                    where: { id: extendedHrLeaveRequestId, extended_leave_request_status: "draft" },
                    data: {
                        extended_leave_request_status: "for_verification"
                    }
                });

                await tx.workflowAction.create({
                    data: {
                        actionable_type: WORKFLOW_ENTITY.EXTENDED_LEAVE_REQUEST,
                        actionable_id: extendedHrLeaveRequestId,
                        action: "submission",
                        acted_by: user.id
                    }
                });

                const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
                const userPostion = requestUser.employee.position.name;

                return {
                    status: 'status',
                    message: 'Extended Leave Submitted',
                    submitExtendedLeave,
                    submitted_by: `${userName} - ${userPostion}`,
                };
            } catch (e) {
                throw e;
            }
        })
    }

    async verifyExtendedLeave(extendedHrLeaveRequestId: string, user: RequestUser) {
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
                // validate extended leave status
                const  leave = await tx.hrLeaveRequest.findUnique({
                    where: { id: extendedHrLeaveRequestId }
                });

                if (leave?.status !== "for_verification") {
                    throw new BadRequestException("Invalid! status must be: for_verification");
                }

                const verifyExtendedLeave = await tx.hrExtendedLeaveRequest.update({
                    where: { id: extendedHrLeaveRequestId, extended_leave_request_status: "for_verification" },
                    data: {
                        extended_leave_request_status: "for_approval",
                        updated_by: requestUser.id
                    }
                });

                await tx.workflowAction.create({
                    data: {
                        actionable_type: WORKFLOW_ENTITY.EXTENDED_LEAVE_REQUEST,
                        actionable_id: extendedHrLeaveRequestId,
                        action: "verification",
                        acted_by: requestUser.id
                    }
                });

                const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
                const userPosition = requestUser.employee.position.name;

                return {
                    status: 'success',
                    message: 'Extended Leave Request Verified',
                    verifyExtendedLeave,
                    verified_by: `${userName} - ${userPosition}`
                };
            } catch (e) {
                throw e;
            }
        })
    }

    async approveExtendedLeave(extendedHrLeaveRequestId: string, user: RequestUser) {
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
                const approveExtendedLeave = await tx.hrExtendedLeaveRequest.update({
                    where: { id: extendedHrLeaveRequestId, extended_leave_request_status: "for_approval"},
                    data: {
                        extended_leave_request_status: "for_approval",
                        updated_by: requestUser.id,
                    }
                });

                await tx.workflowAction.create({
                    data: {
                        actionable_type: WORKFLOW_ENTITY.EXTENDED_LEAVE_REQUEST,
                        actionable_id: extendedHrLeaveRequestId,
                        action: 'approval',
                        acted_by: requestUser.id
                    }
                });

                const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
                const userPosition = requestUser.employee.position.name;

                return {
                    status: 'success',
                    message: 'Extended Leave Request Approved',
                    approveExtendedLeave,
                    approved_by: `${userName} - ${userPosition}`,
                };
            } catch (e) {
                throw e;
            }
        })
    }

    async processExtendedLeave(extendedHrLeaveRequestId: string, user: RequestUser) {
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
                const processExtendedLeave = await tx.hrLeaveRequest.update({
                    where: { id: extendedHrLeaveRequestId, status: "for_processing" },
                    data: {
                        status: 'processed',
                        updated_by: requestUser.id
                    }
                });

                await tx.workflowAction.create({
                    data: {
                        actionable_type: WORKFLOW_ENTITY.LEAVE_REQUEST,
                        actionable_id: extendedHrLeaveRequestId,
                        action: 'processing',
                        acted_by: requestUser.id
                    }
                });

                const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
                const userPosition = requestUser.employee.position.name;

                return {
                    status: 'success',
                    message: 'Extended Leave Request Processed',
                    processExtendedLeave,
                    processed_by: `${userName} - ${userPosition}`,
                };
                
            } catch (e) {
                throw e;
            }
        })
    }

    async rejectExtendedLeave(extendedHrLeaveRequestId: string, user: RequestUser) {
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
                const leave = await tx.hrExtendedLeaveRequest.findUnique({
                    where: { id: extendedHrLeaveRequestId }
                });

                if (!leave) {
                    throw new NotFoundException("Leave Request does not exist");
                }

                const allowedStatuses = ["for_verification", "for_approval", "for_processing"];

                if (!allowedStatuses.includes(leave.extended_leave_request_status)) {
                    throw new BadRequestException("Invalid! status must be: for_verification, for_approval or for_processing");
                }

                const rejectExtendedLeave = await tx.hrExtendedLeaveRequest.updateMany({
                    where: {
                        id: extendedHrLeaveRequestId,
                        extended_leave_request_status: { in: ["for_verification", "for_processing", "for_approval"]}
                    },
                    data: {
                        extended_leave_request_status: 'rejected',
                        updated_by: requestUser.id
                    }
                });

                if (rejectExtendedLeave.count === 0) {
                    throw new BadRequestException("Update failed due to invalid status");
                }

                await tx.workflowAction.create({
                    data: {
                        actionable_type: WORKFLOW_ENTITY.EXTENDED_LEAVE_REQUEST,
                        actionable_id: extendedHrLeaveRequestId,
                        action: 'rejection',
                        acted_by: requestUser.id
                    }
                });

                const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
                const userPosition = requestUser.employee.position.name;

                return {
                    status: 'success',
                    message: 'Extended Leave Request Rejected',
                    rejectExtendedLeave,
                    rejected_by: `${userName} - ${userPosition}`,
                };
            } catch (e) {
                if (e instanceof BadRequestException) {
                    throw e; // keep your validation errors
                }
            }
        })
    }

    async cancelExtendedLeave(extendedHrLeaveRequestId: string, user: RequestUser) {
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
                const cancelExtendedLeave = await tx.hrExtendedLeaveRequest.updateManyAndReturn({
                    where: {
                        id: extendedHrLeaveRequestId,
                        OR: [
                            { extended_leave_request_status: 'draft' },
                            { extended_leave_request_status: 'for_verification' },
                            { extended_leave_request_status: 'for_approval' },
                            { extended_leave_request_status: 'processed' },
                        ]
                    },
                    data: {
                        extended_leave_request_status: 'cancelled',
                        updated_by: requestUser.id
                    }
                });

                await tx.workflowAction.create({
                    data: {
                        actionable_type: WORKFLOW_ENTITY.EXTENDED_LEAVE_REQUEST,
                        actionable_id: extendedHrLeaveRequestId,
                        action: 'cancellation',
                        acted_by: requestUser.id
                    }
                });

                const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
                const userPosition = requestUser.employee.position.name;

                return {
                    status: 'success',
                    message: 'Extended Leave Request',
                    cancelExtendedLeave,
                    cancelled_by: `${userName} - ${userPosition}`,
                }
            } catch (e) {
                throw e;
            }
        })
    }
}
