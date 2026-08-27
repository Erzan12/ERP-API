import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CreateEmployeeReportDto } from './dto/create-employee-report.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { HrErIntakeStatus, HrErIntakeType, Prisma } from '@prisma/client';
import { EmployeeReportPaginationDto } from 'src/utils/dtos/er-related-pagination.dto';

@Injectable()
export class EmployeeReportService {
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

    async getEmployeeReports(dto: EmployeeReportPaginationDto, user: RequestUser) {
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
    
    async createEmployeeReport(dto: CreateEmployeeReportDto, user: RequestUser) {
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

        const employeeReport = await this.prisma.hrErCaseIntake.create({
            data: {
                type: HrErIntakeType.employee,
                incident_location_id: dto.incident_location_id,
                incident_location_type: location.type,
                incident_date: new Date(dto.incident_date),
                incident_narrative: dto.incident_narrative,
                status: HrErIntakeStatus.pending_review,
                subject: dto.subject,
                created_by: user.id,

                parties: {
                    create: dto.parties.map((p) => ({
                        employee: {
                            connect: {
                                id: p.employee_id,
                            },
                        },
                        role: p.role,
                    })),
                },
            },
            include: {
                parties: {
                    include: {
                        employee: true,
                    },
                },
            },
        });

        return {
            status: 'success',
            message: 'Employee Report filed successfully',
            employeeReport,
        };
    }
}
