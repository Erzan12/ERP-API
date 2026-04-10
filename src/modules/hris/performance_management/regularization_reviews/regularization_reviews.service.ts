import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { RequestUser } from 'src/utils/types/request-user.interface';

@Injectable()
export class RegularizationReviewsService {
    constructor(private readonly prisma:PrismaService) {}

    async getForRegularization(user: RequestUser) {
        const today = new Date();

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(today.getMonth() - 6);

        const employees = await this.prisma.employee.findMany({
            where: {
                hire_date: {
                    lte: today,
                    gte: sixMonthsAgo,
                },
                employment_status: {
                    code: 'PROBATIONARY',
                }
            },
            include: {
                employment_history: {
                where: {
                    is_active: true,
                },
                orderBy: {
                    effective_date: "desc",
                },
                take: 1,
                },
                person: true,
                position: true,
                department: true,
            },
        });

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
    
        const allowedRoles = [
            'Administrator',
            'Super Administrator',
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

        return {
            status: 'success',
            message: 'List of Employees for Regularization',
            data: {
                employees
            }
        }
    }
}
