import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { CreateLeaveRequestWithDetailsDto } from './dto/leave-case.dto';
import { WORKFLOW_ENTITY } from 'src/utils/constants/workflow-entity.constants';

@Injectable()
export class LeaveCasesService {
    constructor (private readonly prisma: PrismaService) {}

    async getLeaveCases(user: RequestUser) {
        const leaves = await this.prisma.hrLeaveRequest.findMany()

        if (leaves.length === 0) {
            throw new NotFoundException('No Leave Cases found')
        }

        return {
            status: 'success',
            message: 'List of Leave Cases',
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

        const existingEmployee = await this.prisma.employee.findUnique({
            where: { id: leave_request.employee_id }
        })

        if (!existingEmployee) {
            throw new NotFoundException('Employee does not exist')
        }

        if(leave_dates.length === 0) {
            throw new BadRequestException("Leave dates cannot be empty");
        }

        const from = new Date(leave_request.date_from);
        const to = new Date(leave_request.date_to);

        for (const d of leave_dates) {
        const date = new Date(d.leave_date);

            if (date < from || date > to) {
                throw new BadRequestException(
                `Leave date ${d.leave_date} is outside range`
                );
            }
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

        return this.prisma.$transaction(async (tx) => {
            const leaveRequest = await this.prisma.hrLeaveRequest.create({
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
                    date_created: new Date(),

                    hr_leave_dates: {
                        create: leave_dates.map(d => ({
                            leave_date: new Date(d.leave_date),
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

            // ADD WORKFLOW ACTION
            await tx.workflowAction.create({
                data: {
                    actionable_type: WORKFLOW_ENTITY.LEAVE_REQUEST,
                    actionable_id: leaveRequest.id,
                    action: "draft",
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
        });
    }

    async submitLeave(hrLeaveRequestId: string, user: RequestUser) {
        return this.prisma.$transaction(async (tx) => {

            await tx.hrLeaveRequest.update({
                where: { id: hrLeaveRequestId },
                data: {
                    status: "for_verification",
                    date_verified: new Date()
                }
            });

            await tx.workflowAction.create({
                data: {
                    actionable_type: "LeaveRequest",
                    actionable_id: hrLeaveRequestId,
                    action: "submitted",
                    acted_by: user.id
                }
            });
        });
    }
}
