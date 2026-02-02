import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { permission } from 'process';
import { RequestUser } from 'src/components/types/request-user.interface';
import { PrismaService } from 'src/config/prisma/prisma.service';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(private prisma: PrismaService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: process.env.JWT_SECRET || 'secret-key',
//       passReqToCallback: true,
//     });
//   }

//   async validate(req: Request, payload: any) {

//     console.log('Correct payload:', payload);         // Should now show { sub: 3, ... }
//     console.log('payload.sub:', payload.sub);         // Should now show 3

//     // const user = await this.prisma.user.findUnique({
//     //   where: { id: payload.sub },
//     //   include: {
//     //     user_roles: {
//     //       include: {
//     //       //   role: {
//     //           // include: {
//     //             role_permission: {
//     //               include: {
//     //                 // permission: true,
//     //                 sub_module_permission: true
//     //               },
//     //             },
//     //         //   },
//     //         // },
//     //         module: true,
//     //       },
//     //     },
//     //     // module: true,
//     //   },
//     // });
//     const user = await this.prisma.user.findUnique({
//       where: { id: payload.sub },
//       include: {
//         user_roles: {
//           include: {
//             role_permission: {
//               include: {
//                 sub_module_permission: {
//                   include: {
//                     added_sub_mod_permission: true,
//                   },
//                 },
//               },
//             },
//             // module: true,
//           },
//         },
//       },
//     });

//     if (!user || !user.is_active || !user.user_roles) {
//       throw new UnauthorizedException('Invalid or inactive user');
//     }
//  //returns only the necessary user details needed for auth and role and permission
//     // return {
//     //   id: user.id,
//     //   email: user.email,
//     //   roles: user.user_roles.map((ur) => ({
//     //     //replaced with direct role permission
//     //     // id: ur.role_id,
//     //     // name: ur.role.name,
//     //     //role permission is combined role and the permission for that role with submodule
//     //     id: ur.role_permission_id,
//     //     name: ur.role_permission.role_name,
//     //     //handle multi module per user
//     //     module: {
//     //       id: ur.module.id,
//     //       name: ur.module.name,
//     //     },
//     //   // permission: ur.role_permission.map((rp) => ({
//     //   //     action: rp.action,
//     //   //     permission: { name: rp.sub_module_permission_id.id },
//     //   //     // status: rp.status,
//     //   //   })),
//     //   // })),
//     //   // user has only one role_permission per user_role
//     //   permission: [{
//     //       action: ur.role_permission.action,
//     //       permission: {
//     //         name: ur.role_permission.sub_module_permission?.added_sub_mod_permission?.action,
//     //       },
//     //     }],
//     //   })),
//     //   // user have multiple role permissions
//     //   // permission: ur.role_permissions.map((rp) => ({
//     //   //   action: rp.action,
//     //   //   permission: {
//     //   //     name: rp.sub_module_permission?.added_sub_mod_permission?.action,
//     //   //   },
//     //   // })),
//     // };
//     //revamped method of return without module
//     return {
//       id: user.id,
//       email: user.email,
//       roles: user.user_roles.map((ur) => ({
//         id: ur.role_permission_id,
//         name: ur.role_permission.role_name,
//         permissions: [{
//           action: ur.role_permission.action,
//           permission: {
//             name: ur.role_permission.sub_module_permission?.added_sub_mod_permission?.action,
//           },
//         }],
//       })),
//     };
//   }
// }

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<RequestUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        user_roles: {
          include: {
            role: true,
            // {
            //   include: {
            //     module: true,
            //   },
            // },
            // role_permission: {
            //   include: {
            //     sub_module: true,
            //     sub_module_permission: true,
            //   },
            // },
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

    // move to auth service for login check
    // const requestUser: RequestUser = {
    //   id: user.id,
    //   email: user.email,
    //   security_clearance_level: user.security_clearance_level ?? 0,
    //   roles: user.user_roles.map((ur) => ({
    //     id: ur.role?.id ?? 0,
    //     name: ur.role?.name ?? 'Unkown Role',
    //     // module: {
    //     //   id: ur.role.module?.id,
    //     //   name: ur.role.module?.name,
    //     // },
    //     permissions: ur.user_permissions.map((up) => ({
    //       action: up.role_permission?.action ?? 'unknown',
    //       // status: true, // if you have a field for it, use it
    //       permission: {
    //         name: up.role_permission?.sub_module?.name ?? 'unknown', // sub_module is the subject and action is the permission, action is read,update,delete,create and submodule is Mastertables, Dashboard etc
    //       },
    //     })),
    //   })),
    // };

    // return requestUser; // This becomes `request.user` in controllers and guards

    return {
      id: user.id,
      email: user.email,
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
