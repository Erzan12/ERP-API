import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CreateIncidentReportDto } from './dto/create-incident-report.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { HrErIntakeStatus, HrErIntakeType } from '@prisma/client';

@Injectable()
export class IncidentReportService {
    constructor(private readonly prisma: PrismaService) {} 

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

    async createIncidentReport(dto: CreateIncidentReportDto, user: RequestUser) {
        await this.assertHrAccess(user.id);

        const location = await this.prisma.workAssignment.findFirst({
            where: {
                id: dto.incident_location_id,
            },
        });

        if (!location) {
            throw new BadRequestException(
                'Invalid incident location',
            );
        }

        const incidentReport = await this.prisma.hrErCaseIntake.create({
            data: {
                type: HrErIntakeType.incident,
                // incident_location: dto.incident_location,
                incident_location_id: dto.incident_location_id,
                incident_location_type: location.type,
                incident_date: new Date(dto.incident_date),
                incident_narrative: dto.incident_narrative,
                status: HrErIntakeStatus.pending_review,
                created_by: user.id,

                parties: {
                    create: dto.parties.map((p) => ({
                        employee: { 
                            connect: { 
                                id: p.employee_id 
                            }, 
                        },
                        role: p.role,
                    })),
                },

                offenses: {
                    create: dto.offense_ids.map((offense_id) => ({
                        offense: { 
                            connect: { 
                                id: offense_id 
                            }, 
                        },
                    })),
                },
            },
            include: {
                parties: { 
                    include: { 
                        employee: true 
                    }, 
                },
                offenses: { 
                    include: { 
                        offense: true 
                    }, 
                },
            },
        });

        return {
            status: 'success',
            message: 'Incident Report filed successfully',
            incidentReport,
        };
    }
}
