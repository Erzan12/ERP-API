import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { RequestUser } from 'src/utils/types/request-user.interface';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(requestUser: RequestUser, id: string) {
    // const payload = this.jwtService.verify(token)

    // if (payload.userUUID !== id) {
    //   throw new UnauthorizedException('Invalid token for this user')
    // }

    if (requestUser.id !== id) {
      throw new UnauthorizedException('You cannot access this user');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        employee: {
          include: {
            department: true,
            division: true,
            company: true,
            employment_status: true,
            position: true,
          },
        },
        user_roles: {
          include: {
            role: true,
            user_permissions: {
              include: {
                role_permission: {
                  include: {
                    sub_module: true,
                    sub_module_permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || user.stat !== 1) {
      // You can throw an Unauthorized or NotFound exception
      throw new UnauthorizedException('User not found or invalid token');
    }

    const employee = user.employee;

    return {
      status: 'success',
      message: 'User is validated successfully',
      data: {
        id: user.id,
        email: user.email,
        department: employee.department.name,
        company: employee.company.name,
        division: employee.division.name,
        position: employee.position.name,
        security_clearance_level: user.security_clearance_level ?? 0,
        roles: user.user_roles.map((ur) => ({
          id: ur.role?.id ?? 0,
          role_name: ur.role?.name ?? 'Unknown Role',
          // module: {
          //   id: ur.role.module?.id,
          //   name: ur.role.module?.name,
          // },
          permissions: ur.user_permissions.map((up) => ({
            action: up.role_permission?.action ?? 'unknown',
            // status: true, // if you have a field for it, use it
            permission: {
              sub_module_name:
                up.role_permission?.sub_module?.name ?? 'unknown', // sub_module is the subject and action is the permission, action is read,update,delete,create and submodule is Mastertables, Dashboard etc
            },
          })),
        })),
      },
    };
  }
}
