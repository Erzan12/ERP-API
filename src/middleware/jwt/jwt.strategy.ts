import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { Request } from 'express';
import { mapRolesToRequestUser } from 'src/utils/helpers/reusable-group-role-permisison.helper';
import { JwtPayload } from 'src/utils/types/interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // (request: Request) => request?.cookies?.['accessToken'],
        // (request: Request) =>
        //   (request as Request & { cookies: Record<string, string> })
        //     ?.cookies?.['accessToken']
        // },
        (request: Request): string | null => {
          return typeof request.cookies?.['accessToken'] === 'string'
            ? request.cookies['accessToken']
            : null;
        },
      ]),
      secretOrKey: secret,
    });
  }

  //to validate the user token when accessing apis if the user token is expired, missing or mispelled
  async validate(payload: JwtPayload): Promise<RequestUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userUUID },
      include: {
        employee: true,
        user_roles: {
          where: { is_active: true },
          include: {
            role: {
              include: {
                role_permissions: {
                  where: { is_active: true },
                  include: {
                    sub_module: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || user.is_active !== true) {
      throw new UnauthorizedException('User not found or invalid token');
    }

    if (payload.tokenVersion !== user.token_version) {
      throw new UnauthorizedException('Token has been invalidated');
    }

    return {
      id: user.id,
      email: user.email,
      department_id: user.employee.department_id,
      security_clearance_level: user.security_clearance_level ?? 0,
      roles: mapRolesToRequestUser(user.user_roles),
    };
  }
}
