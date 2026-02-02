import { Injectable } from '@nestjs/common';
import { RequestUser } from 'src/components/types/request-user.interface';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getAdminDashboardStats(user: RequestUser) {
    const totalUsers = await this.prisma.user.count();
    const activeUsers = await this.prisma.user.count({ where: { stat: 1 } });
    const inActiceUsers = await this.prisma.user.count({ where: { stat: 0 } });

    const roles = await this.prisma.role.findMany({
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    const rolesSummary = roles.map((role) => ({
      role: role.name,
      total_users: role._count.users,
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
