import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getAdminDashboardStats(user: RequestUser) {
    const totalUsers = await this.prisma.user.count();
    const activeUsers = await this.prisma.user.count({
      where: { is_active: true },
    });
    const inActiceUsers = await this.prisma.user.count({
      where: { is_active: false },
    });

    const roles = await this.prisma.role.findMany({
      include: {
        _count: {
          select: { user_roles: true },
        },
      },
    });

    const rolesSummary = roles.map((role) => ({
      role: role.name,
      total_users: role._count.user_roles,
    }));

    const onlineUsers = await this.prisma.user.findMany({
      where: {
        last_login: {
          gte: new Date(Date.now() - 1000 * 60 * 5), //last 5 minutes
        },
      },
      select: {
        id: true,
        username: true,
        last_login: true,
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

    const isAdmin = requestUser.user_roles.some(
      (role) =>
        // role.role_id === 'b1118e05-6377-4e64-a677-14f9b9226fdd' &&
        role.role_name === 'Administrator' || 'Super Administrator',
    );

    if (!isAdmin) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }

    return {
      status: 'success',
      message: 'Welcome to Administrator Dashboard',
      data: {
        total_users: totalUsers,
        active_users: activeUsers,
        inactive_users: inActiceUsers,
        classification_by_roles: rolesSummary,
        online_users: onlineUsers,
      },
    };
  }
}
