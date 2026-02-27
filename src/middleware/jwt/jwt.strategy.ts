import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { Request }  from 'express';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }
    // super({
    //   // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    //   // secretOrKey: secret,

    //   jwtFromRequest: ExtractJwt.fromExtractors([
    //     (request: Request) => {
    //       return request?.cookies?.access-token;
    //     },
    //   ]),
    //   secretOrKey: secret,
    // });
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.['access-token'],
      ]),
      secretOrKey: secret,
    });
  }

  //to validate the user token when accessing apis if the user token is expired, missing or mispelled
  async validate(payload: any): Promise<RequestUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userUUID },
      include: {
        employee: true,
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

    if (payload.tokenVersion !== user.token_version) {
      throw new UnauthorizedException('Token has been invalidated');
    }

    const employee = user.employee;

    return {
      id: user.id,
      email: user.email,
      // username: user.username,
      department_id: employee.department_id,
      security_clearance_level: user.security_clearance_level ?? 0,
      roles: user.user_roles.map((ur) => ({
        id: ur.role?.id ?? 0,
        name: ur.role?.name ?? 'Unknown Role',
        permissions: ur.user_permissions.map((up) => ({
          action: up.role_permission?.action ?? 'unknown',
          permission: {
            name: up.role_permission?.sub_module?.name ?? 'unknown',
          },
        })),
      })),
    };
  }
}
