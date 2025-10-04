import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret-key',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    
    console.log('Correct payload:', payload);         // Should now show { sub: 3, ... }
    console.log('payload.sub:', payload.sub);         // Should now show 3

    // const user = await this.prisma.user.findUnique({
    //   where: { id: payload.sub },
    //   include: {
    //     user_roles: {
    //       include: {
    //       //   role: {
    //           // include: {
    //             role_permission: {
    //               include: {
    //                 // permission: true,
    //                 sub_module_permission: true
    //               },
    //             },
    //         //   },
    //         // },
    //         module: true,
    //       },
    //     },
    //     // module: true,
    //   },
    // });
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        user_roles: {
          include: {
            role_permission: {
              include: {
                sub_module_permission: {
                  include: {
                    added_sub_mod_permission: true,
                  },
                },
              },
            },
            module: true,
          },
        },
      },
    });

    if (!user || !user.is_active || !user.user_roles) {
      throw new UnauthorizedException('Invalid or inactive user');
    }
 //returns only the necessary user details needed for auth and role and permission
    return {
      id: user.id,
      email: user.email,
      roles: user.user_roles.map((ur) => ({
        //replaced with direct role permission
        // id: ur.role_id,
        // name: ur.role.name,
        //role permission is combined role and the permission for that role with submodule
        id: ur.role_permission_id,
        name: ur.role_permission.role_name,
        //handle multi module per user
        module: {
          id: ur.module.id,
          name: ur.module.name,
        },
      permission: ur.role_permission.map((rp) => ({
          action: rp.action,
          permission: { name: rp.permission.name },
          // status: rp.status,
        })),
      })),
    };
  }
}
