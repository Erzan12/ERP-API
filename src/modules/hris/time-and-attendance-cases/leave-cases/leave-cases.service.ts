import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { LeaveCompensation, Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { CreateLeaveRequestWithDetailsDto, UpdateLeaveRequestWithDetailsDto, UpdateRecordLeaveDatesDto } from './dto/leave-case.dto';
import { WORKFLOW_ENTITY } from 'src/utils/constants/workflow-entity.constants';
import { LeaveRequestPaginationDto } from 'src/utils/dtos/leave-request-pagination.dto';

@Injectable()
export class LeaveCasesService {
    constructor (private readonly prisma: PrismaService) {}

    async getLeaveCase(leaveRequestId: string, user: RequestUser) {
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
            const leaveRequest = await this.prisma.hrLeaveRequest.findUnique({
                where: { id: leaveRequestId, is_active: true },
                include: {
                    category: {
                        select: {
                            id: true,
                            category_name: true,
                        }
                    },
                    hr_leave_dates: true,
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
                    },
                    reliever: {
                        select: {
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
                },
            });

            if (!leaveRequest) {
                throw new NotFoundException ("Leave Request not found")
            }

            const workflowActions = await this.prisma.workflowAction.findMany({
                where: {
                    actionable_type: WORKFLOW_ENTITY.LEAVE_REQUEST,
                    actionable_id: leaveRequest.id,
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

            const verifier = workflowActions.find(
                a => a.action === "verification"
            );

            const approver = workflowActions.find(
                a => a.action === "approval"
            );

            const leave = {
                ...leaveRequest,
                verifier: verifier?.acted_by_user ?? null,
                approver: approver?.acted_by_user ?? null,
            };

            return {
                status: 'success',
                message: 'Here is the Leave Request',
                leaveRequest: leave
            }
        } catch (e) {
            if (e instanceof NotFoundException) {
                throw e;
            }
        }
    }

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
                    category: {
                        select: {
                            id: true,
                            category_name: true,
                        }
                    },
                    hr_leave_dates: true,
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
                    },
                    reliever: {
                        select: {
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
                },
                skip,
                take: perPage,
                orderBy: {
                    [safeSortBy]: order,
                },
            }),
        ]);

        const leaveIds = leaves.map(l => l.id);

        const workflowActions = await this.prisma.workflowAction.findMany({
            where: {
                actionable_type: WORKFLOW_ENTITY.LEAVE_REQUEST,
                actionable_id: {
                    in: leaveIds
                },
                action: {
                    in: ["verification", "approval"]
                }
            },
            include: {
                acted_by_user: {
                    select: {
                        id: true,
                        employee:{
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

        const formattedLeaves = leaves.map(leave => {
            const verifier = workflowActions.find(a =>
                a.actionable_id === leave.id &&
                a.action === "verification"
            );
            const approver = workflowActions.find(a =>
                a.actionable_id === leave.id &&
                a.action === "approval"
            );
            return {
                ...leave,
                verifier: verifier?.acted_by_user ?? null,
                approver: approver?.acted_by_user ?? null,
            };
        });

        return {
            status: 'success',
            message: 'List of Leave Cases',
            count: total,
            page,
            perPage,
            leaves: formattedLeaves
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
                        leave_category_id: leave_request.leave_category_id,
                        date_from: new Date(leave_request.date_from),
                        date_to: new Date(leave_request.date_to),
                        reason: leave_request.reason,
                        contact_number: leave_request.contact_number,
                        address_on_leave: leave_request.address_on_leave,
                        no_of_days: no_of_days,
                        reliever_id: leave_request.reliever_id,
                        // verifier_id: leave_request.verifier_id,
                        // approver_id: leave_request.approver_id,
                        // verifier_id: verifier
                        // created_by: requestUser.id,
                        hr_leave_dates: {
                            create: leave_dates.map(d => ({
                                leave_date: new Date(d.leave_date),
                                employee: {
                                    connect: { id: leave_request.employee_id }
                                },
                                leave_compensation: d.leave_compensation,
                                fraction: d.fraction ?? 1.0,
                            })),
                        }
                    },
                    include: {
                        hr_leave_dates: true,
                        reliever: true,
                        employee: true,
                    }
                });

                //query users first
                const [verifierUser, approverUser, currentUser] = await Promise.all([
                    tx.user.findUnique({
                        where: {
                            id: leave_request.verifier_id
                        },
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
                    }),

                    tx.user.findUnique({
                        where: {
                            id: leave_request.approver_id
                        },
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
                                            last_name: true
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
                            actionable_type: WORKFLOW_ENTITY.LEAVE_REQUEST,
                            actionable_id: leaveRequest.id,
                            action: "creation",
                            acted_by: requestUser.id,
                            acted_at: new Date(),
                            metadata: {
                                title: "Leave Request created",
                                message: "You have created a new Leave Request",
                                user: creatorName,
                                role: "creator",
                            }
                        },
                        {
                            actionable_type: WORKFLOW_ENTITY.LEAVE_REQUEST,
                            actionable_id: leaveRequest.id,
                            action: "verification",
                            acted_by: leave_request.verifier_id,
                            metadata: {
                                title: "Verify Leave Request",
                                message: "You have a new Verify Request",
                                user: verifierName,
                                role: "verifier",
                            },
                            acted_at: null,
                        },
                        {
                            actionable_type: WORKFLOW_ENTITY.LEAVE_REQUEST,
                            actionable_id: leaveRequest.id,
                            action: "approval",
                            acted_by: leave_request.approver_id,
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
                    message: 'Leave Request Createad',
                    leaveRequest,
                    created_by: `${userName} - ${userPosition}`,
                };
            } catch (e) {
                throw e;
            }
        });
    }

    async updateLeaveCase(user: RequestUser, leaveCaseId: string, dto: UpdateLeaveRequestWithDetailsDto) {
        const { update_leave_request, update_leave_dates } = dto;

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
            // 1. Verify the main leave request exists and can be edited
            const existingLeaveCase = await tx.hrLeaveRequest.findUnique({
                where: { 
                    id: leaveCaseId, 
                    is_active: true, 
                    status: "draft" 
                }
            });

            if (!existingLeaveCase) {
                throw new NotFoundException("Leave Case does not exist, is inactive, or is no longer a draft");
            }

            // 2. Process your leave dates list
            if (update_leave_dates && update_leave_dates.length > 0) {
                for (const d of update_leave_dates) {

                    if (d.id) {
                        // UPDATE an existing row using its specific record ID
                        await tx.hrLeaveDates.update({
                            where: { id: d.id },
                            data: {
                                leave_date: d.leave_date ? new Date(d.leave_date) : undefined,
                                leave_compensation: d.leave_compensation,
                                fraction: d.fraction,
                            }
                        });
                    } else {
                        // CREATE a new row because no record ID was provided
                        // This explicitly ensures leave_date is provided, satisfying TypeScript!
                        if (!d.leave_date) {
                            throw new BadRequestException("leave_date is required for new date entries");
                        }
                        if (!d.leave_compensation) {
                            throw new BadRequestException("leave_compensation is required for new date entries");
                        }

                        await tx.hrLeaveDates.create({
                            data: {
                                hr_leave_request_id: leaveCaseId,
                                employee_id: existingLeaveCase.employee_id,
                                leave_date: new Date(d.leave_date),
                                leave_compensation: d.leave_compensation,
                                fraction: d.fraction ?? 1.0,
                            }
                        });
                    }
                }
            }

            // 3. Dynamically fetch ALL active rows for this case from DB to get the true total
            const allCurrentDates = await tx.hrLeaveDates.findMany({
                where: { hr_leave_request_id: leaveCaseId }
            });

            const total_no_of_days = allCurrentDates.reduce(
                (sum, item) => sum + (item.fraction ?? 1.0),
                0
            );

            // 2. WORKFLOW LOGIC: Fetch current pending workflow routing lines
            const pendingWorkflowActions = await tx.workflowAction.findMany({
                where: {
                    actionable_type: WORKFLOW_ENTITY.LEAVE_REQUEST,
                    actionable_id: leaveCaseId,
                    action: { in: ["verification", "approval"] }, // Match your exact WorkflowActionType enum values
                    acted_at: null // Ensures we only look at uncompleted steps
                }
            });

            const currentVerificationStep = pendingWorkflowActions.find(a => a.action === "verification");
            const currentApprovalStep = pendingWorkflowActions.find(a => a.action === "approval");


            // 3. Handle Verifier Update/Patch
            if (update_leave_request.verifier_id) {
                // Fetch name from User table (since WorkflowAction.acted_by maps to User)
                const targetUser = await tx.user.findUnique({ 
                    where: { id: update_leave_request.verifier_id },
                    include: {
                        employee: {
                            select: {
                                person: {
                                    select: {
                                        first_name: true,
                                        last_name: true,
                                    }
                                }
                            }   
                        }
                    }
                });
                const verifierName = targetUser ? `${targetUser.employee.person.first_name ?? ''} ${targetUser.employee.person.last_name ?? ''}`.trim() : "Unknown User";

                if (currentVerificationStep) {
                    // If assigned verifier changed, update the row
                    if (currentVerificationStep.acted_by !== update_leave_request.verifier_id) {
                        await tx.workflowAction.update({
                            where: { id: currentVerificationStep.id },
                            data: {
                                acted_by: update_leave_request.verifier_id,
                                metadata: {
                                    title: "Verify Leave Request",
                                    message: "You have a new Verify Request",
                                    user: verifierName,
                                    role: "verifier",
                                }
                            }
                        });
                    }
                } else {
                    // Edge case safety net: If it didn't exist for some reason, create it
                    await tx.workflowAction.create({
                        data: {
                            actionable_type: WORKFLOW_ENTITY.LEAVE_REQUEST,
                            actionable_id: leaveCaseId,
                            action: "verification",
                            acted_by: update_leave_request.verifier_id,
                            acted_at: null,
                            metadata: {
                                title: "Verify Leave Request",
                                message: "You have a new Verify Request",
                                user: verifierName,
                                role: "verifier",
                            }
                        }
                    });
                }
            }

            // 4. Handle Approver Update/Patch
            if (update_leave_request.approver_id) {
                const targetUser = await tx.user.findUnique({ 
                    where: { id: update_leave_request.approver_id },
                    include: {
                        employee: {
                            select: {
                                person: {
                                    select: {
                                        first_name: true,
                                        last_name: true,
                                    }
                                }
                            }
                        }
                    }
                });
                const approverName = targetUser ? `${targetUser.employee.person.first_name ?? ''} ${targetUser.employee.person.last_name ?? ''}`.trim() : "Unknown User";

                if (currentApprovalStep) {
                    // If assigned approver changed, update the row
                    if (currentApprovalStep.acted_by !== update_leave_request.approver_id) {
                        await tx.workflowAction.update({
                            where: { id: currentApprovalStep.id },
                            data: {
                                acted_by: update_leave_request.approver_id,
                                metadata: {
                                    title: "Approve Leave Request",
                                    message: "You have a new Approval Request",
                                    user: approverName,
                                    role: "approver",
                                }
                            }
                        });
                    }
                } else {
                    // Edge case safety net: Create if missing
                    await tx.workflowAction.create({
                        data: {
                            actionable_type: WORKFLOW_ENTITY.LEAVE_REQUEST,
                            actionable_id: leaveCaseId,
                            action: "approval",
                            acted_by: update_leave_request.approver_id,
                            acted_at: null,
                            metadata: {
                                title: "Approve Leave Request",
                                message: "You have a new Approval Request",
                                user: approverName,
                                role: "approver",
                            }
                        }
                    });
                }
            }

            // 5. Update the parent master Leave Request (IDs REMOVED FROM HERE)
            const updatedLeaveCase = await tx.hrLeaveRequest.update({
                where: { id: leaveCaseId },
                data: {
                    leave_category_id: update_leave_request.leave_category_id ?? undefined,
                    date_from: update_leave_request.date_from ? new Date(update_leave_request.date_from) : undefined,
                    date_to: update_leave_request.date_to ? new Date(update_leave_request.date_to) : undefined,
                    reason: update_leave_request.reason ?? undefined,
                    contact_number: update_leave_request.contact_number ?? undefined,
                    address_on_leave: update_leave_request.address_on_leave ?? undefined,
                    no_of_days: total_no_of_days, 
                    reliever_id: update_leave_request.reliever_id ?? undefined,
                    // Note: verifier_id and approver_id are omitted completely because they don't exist here!
                },
            });

            // 3. Optional: Log the "update" action itself for history trail
            await tx.workflowAction.create({
                data: {
                    actionable_type: WORKFLOW_ENTITY.LEAVE_REQUEST,
                    actionable_id: leaveCaseId,
                    action: "update",
                    acted_by: requestUser.id, // The person performing the edit
                    acted_at: new Date(),
                    metadata: {
                        title: "Leave Request updated",
                        message: "Leave Request draft details were modified",
                        user: `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`, // Adjust based on your RequestUser object
                        role: "creator",
                    }
                }
            });

            return {
                status: 'success',
                message: 'Leave Request updated successfully',
                updatedLeaveCase
            };
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
            this.prisma.hrLeaveRequest.count({
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
        message: 'Here is the status count for Leave Requests',
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
            try {
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
                        action: "submission",
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
            } catch (e) {
                throw e;
            }
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
            try {
                const leave = await tx.hrLeaveRequest.findUnique({
                    where: { id: hrLeaveRequestId }
                });

                if (leave?.status !== "for_verification") {
                    throw new BadRequestException("Invalid! status must be: for_verification");
                }

                const verifyLeave = await tx.hrLeaveRequest.update({
                    where: { id: hrLeaveRequestId, status: "for_verification" },
                    data: {
                        status: "for_approval",
                        // verifier_id: requestUser.id,
                        updated_by: requestUser.id
                    }
                });

                // if(verifyLeave.status != 'for_verification') {
                //     throw new BadRequestException('Leave request cannot be verify it needs to be submitted first')
                // }

                await tx.workflowAction.create({
                    data: {
                        actionable_type: WORKFLOW_ENTITY.LEAVE_REQUEST,
                        actionable_id: hrLeaveRequestId,
                        action: "verification",
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
            } catch (e) {
                throw e;
            }
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
                        // approver_id: requestUser.id,
                        updated_by: requestUser.id
                    }
                })

                await tx.workflowAction.create({
                    data: {
                        actionable_type: WORKFLOW_ENTITY.LEAVE_REQUEST,
                        actionable_id: hrLeaveRequestId,
                        action: 'approval',
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
                // if (e instanceof BadRequestException) {
                //     throw e; // keep your validation errors
                // }
                // if (e.code === 'P2002') {
                //     throw new BadRequestException('Duplicate entry');
                // }
                throw e;
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
                        action: 'processing',
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
                // throw new Error ('Invalid status for processing leave request')
                throw e;
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
                const leave = await tx.hrLeaveRequest.findUnique({
                    where: { id: hrLeaveRequestId }
                });

                if (!leave) {
                    throw new NotFoundException("Leave Request does not exist");
                }

                const allowedStatuses = ["for_verification", "for_approval", "for_processing"];

                if (!allowedStatuses.includes(leave.status)) {
                    throw new BadRequestException("Invalid! status must be: for_verification, for_approval or for_processing");
                }

                const rejectLeave = await tx.hrLeaveRequest.updateMany({
                    where: { 
                        id: hrLeaveRequestId, 
                        status: { in: ["for_verification", "for_processing", "for_approval"]}
                    },
                    data: {
                        status: 'rejected',
                        updated_by: requestUser.id
                    }
                });

                if (rejectLeave.count === 0) {
                    throw new BadRequestException("Update failed due to invalid status");
                }

                await tx.workflowAction.create({
                    data: {
                        actionable_type: WORKFLOW_ENTITY.LEAVE_REQUEST,
                        actionable_id: hrLeaveRequestId,
                        action: 'rejection',
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
                if (e instanceof BadRequestException) {
                    throw e; // keep your validation errors
                }
                // throw new Error('Invalid status for rejection');
                // throw e;
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
                        action: 'cancellation',
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
                // throw new Error ('Invalid status for cancellation')
                throw e;
            }
        })
    }
}
