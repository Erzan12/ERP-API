import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { RequestUser } from 'src/utils/types/request-user.interface';

@Injectable()
export class OvertimeRateService {
    constructor(private prisma: PrismaService) {}

    async getOvertimeRates(user: RequestUser) {
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

        const overtimeRates = await this.prisma.hrOvertimeRate.findMany({
            include: {
                overtimeRequests: true,
            }
        })

        if(overtimeRates.length === 0) {
            throw new NotFoundException("No overtime rate is available")
        }

        return {
            status: 'success',
            message: 'List of overtime rates available',
            overtimeRates
        }
    }
}
