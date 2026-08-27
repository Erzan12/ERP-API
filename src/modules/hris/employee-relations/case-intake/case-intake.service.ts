import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { HrErIntakeType, Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CaseIntakePaginationDto } from 'src/utils/dtos/er-related-pagination.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';

@Injectable()
export class CaseIntakeService {
    constructor (private readonly prisma: PrismaService) {}

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

    async getIncidentReports(dto: CaseIntakePaginationDto, user: RequestUser) {
        const { search, sortBy, order, page, perPage } = dto;

        await this.assertHrAccess(user.id);

        const skip = (page - 1) * perPage;

        const whereCondition: Prisma.HrErCaseIntakeWhereInput = {
            type: HrErIntakeType.incident,
        };

        if (search?.trim()) {
            whereCondition.OR = [

            ];
        }

        const allowSortFields = ['id', 'created_at', 'updated_at'];

        const safeSortBy = allowSortFields.includes(sortBy) ? sortBy : 'created_at';

        const [total, incidentReports] = await this.prisma.$transaction([
            this.prisma.hrErCaseIntake.count({
                where: {
                    ...whereCondition,
                },
            }),
            this.prisma.hrErCaseIntake.findMany({
                where: {
                    ...whereCondition
                },
                include: {
                    createdBy: {
                        select: {
                            employee: true,
                            person: {
                                select: {
                                    first_name: true,
                                    middle_name: true,
                                    last_name: true,
                                },
                            },
                        },
                    },
                    case: true,
                    parties: true,
                    violations: true,
                    attachments: true,
                    offenses: true,
                },
                skip,
                take: perPage,
                orderBy: {
                    [safeSortBy]: order,
                },
            }),
        ]);

        const locationIds = incidentReports
            .map((report) => report.incident_location_id)
            .filter((id): id is string => !!id);

        const workAssignments = await this.prisma.workAssignment.findMany({
            where: {
                id: {
                    in: locationIds,
                },
            },
        });

        const workAssignmentMap = new Map(
            workAssignments.map((assignment) => [
                `${assignment.type}:${assignment.id}`,
                assignment,
            ]),
        );

        const incidentReportsWithLocation = incidentReports.map((report) => {
            const assignment = report.incident_location_id
                ? workAssignmentMap.get(
                    `${report.incident_location_type}:${report.incident_location_id}`,
                )
                : null;

            return {
                ...report,
                incidentLocation: assignment ?? null,
            };
        });

        // if (incidentReports.length === 0) {
        //     throw new NotFoundException('No incident reports found.');
        // }

        return {
            status: 'success',
            message: 'Here is the list of Incident Reports.',
            count: total,
            page,
            perPage,
            incidentReports: incidentReportsWithLocation,
        };
    }

    async getEmployeeReports(dto: CaseIntakePaginationDto, user: RequestUser) {
        const { search, sortBy, order, page, perPage } = dto;

        await this.assertHrAccess(user.id);

        const skip = (page - 1) * perPage;

        const whereCondition: Prisma.HrErCaseIntakeWhereInput = {
            type: HrErIntakeType.employee,
        };

        if (search?.trim()) {
            whereCondition.OR = [

            ];
        }

        const allowSortFields = ['id', 'created_at', 'updated_at'];

        const safeSortBy = allowSortFields.includes(sortBy) ? sortBy : 'created_at';

        const [total, employeeReports] = await this.prisma.$transaction([
            this.prisma.hrErCaseIntake.count({
                where: {
                    ...whereCondition,
                },
            }),
            this.prisma.hrErCaseIntake.findMany({
                where: {
                    ...whereCondition
                },
                include: {
                    createdBy: {
                        select: {
                            employee: true,
                            person: {
                                select: {
                                    first_name: true,
                                    middle_name: true,
                                    last_name: true,
                                },
                            },
                        },
                    },
                    case: true,
                    parties: true,
                    violations: true,
                    attachments: true,
                    offenses: true,
                },
                skip,
                take: perPage,
                orderBy: {
                    [safeSortBy]: order,
                },
            }),
        ]);

        // if (incidentReports.length === 0) {
        //     throw new NotFoundException('No incident reports found.');
        // }

        return {
            status: 'success',
            message: 'Here is the list of Employee Reports.',
            count: total,
            page,
            perPage,
            employeeReports,
        };
    }

    async getAuthFlaggedCases() {
        
    }
}
