import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePermissionTemplateDto } from 'src/Manager/permission_template/dto/create-permission-template.dto';
import { RequestUser } from 'src/Components/types/request-user.interface';
import { AssignTemplateDto } from './dto/assign-template.dto';

@Injectable()
export class PermissionTemplateService {
  constructor (private prisma: PrismaService, ) {}

  //get permission template
  async listPermTemplate(user: RequestUser){
    const existingPermTemplate = await this.prisma.permissionTemplate.findMany()
    
    if (existingPermTemplate.length === 0 ) {
      throw new BadRequestException('No available permission templates available')
    }

    return {
      status: 'success',
      message: 'Here are the list of Permission Templates',
      data: {
        existingPermTemplate
      },
    };
  }

  async createPermissionTemplate(dto: CreatePermissionTemplateDto, user: RequestUser) {
    return this.prisma.$transaction(async (tx) => {
      const {
        name,
        department_id,
        position_id,
        role_permission_ids,
      } = dto;

      const existing = await tx.permissionTemplate.findFirst({
        where: { name },
      });
      if (existing) {
        throw new BadRequestException('Permission template already exists');
      }

      const template = await tx.permissionTemplate.create({
        data: {
          name,
          department_id,
        },
      });

      const ptDept = await tx.permissionTemplateDepartment.create({
        data: {
          permission_template_id: template.id,
          user_id: user.id,
          department_id,
          position_id,
        },
      });

      const rolePermissions = await tx.rolePermission.findMany({
        where: {
          id: { in: role_permission_ids },
          department_id,
          ...(position_id && { position_id }),
        },
      });

      for (const rp of rolePermissions) {
        await tx.permissionTemplateRolePermission.create({
          data: {
            permission_template_id: template.id,
            role_permission_id: rp.id,
            permission_template_department_id: ptDept.id,
          },
        });
      }

      return {
        message: 'Permission template created',
        template_id: template.id,
        name: template.name,
      };
    });
  }


    // async createPermissionTemplate(dto: CreatePermissionTemplateDto, user: RequestUser) {
    //   const { name, department_id, role_permission_ids } = dto;

    //   // Step 1: Create the permission template with one department
    //   const template = await this.prisma.permissionTemplate.create({
    //     data: {
    //       name,
    //       department: {
    //           create: {
    //           department_id: department_id,
    //           user_id: user.id,
    //         },
    //       }
    //       // departments: {
    //       //   create: {
    //       //     department_id: department_id,
    //       //     user_id: user.id,
    //       //   },
    //       // },
    //     },
    //     include: {
    //       departments: true, // we need the generated department ID
    //     },
    //   });

    //   const department = template.[0];

    //   // Step 2: Create role permissions tied to that department
    //   await this.prisma.permissionTemplateRolePermission.createMany({
    //     data: role_permission_ids.map(rpId => ({
    //       permission_template_id: template.id,
    //       role_permission_id: rpId,
    //       permission_template_department_id: department.id,
    //     })),
    //   });

    //   return {
    //     message: 'Template created successfully',
    //     template,
    //   };
    // }

    // async createPermissionTemplate(dto: CreatePermissionTemplateDto, user: RequestUser) {
    //     const { name, department_ids, role_permission_ids } = dto;

    //     // Step 1: Create the template
    //     const template = await this.prisma.permissionTemplate.create({
    //         data: {
    //             name,
    //         },
    //     });

    //     const templateDepartments = await this.prisma.permissionTemplateDepartment.createMany({
    //     data: department_ids.map(departmentId => ({
    //         permission_template_id: template.id,
    //         department_ids,
    //         user_id: user.id,
    //     })),
    //     skipDuplicates: true,
    //     });

    //     // Now fetch them back (because createMany doesn’t return the inserted rows)
    //     const departmentRecords = await this.prisma.permissionTemplateDepartment.findMany({
    //     where: {
    //         permission_template_id: template.id,
    //     },
    //     });

    // }

    // async assignPermissionTemplateToUser(userId: number, templateId: number) {
    //       const user = await this.prisma.user.findUnique({
    //         where: { id: userId },
    //         include: {
    //             employee: { include: { department: true, position: true } }
    //         }
    //     });

    //     if (!user || !user.employee) {
    //         throw new BadRequestException('User or employee record not found');
    //     }

    //     const templateDeps = await this.prisma.permissionTemplateDepartment.findMany({
    //         where: { permission_template_id: templateId },
    //         include: {
    //             permission_template_role_permissions: {
    //                 include: { role_permissions: true },
    //             },
    //         },
    //     });

    //     const matchingDep = templateDeps.find(dep => dep.department_id === user.employee.department_id);

    //     if (!matchingDep) {
    //         throw new BadRequestException(`No matching template for the user's department`);
    //     }

    //     const permissionsToAssign = matchingDep.permission_template_role_permissions.map(p => p.role_permission);

    //     const assignedPermissions = await this.addUserRolePermissions(
    //         userId,
    //         permissionsToAssign.map(rp => rp.id),
    //         { id: 0 } // asumming internal or system user 
    //     );

    //     return {
    //         message: 'Permissions assigned using template',
    //         template_id: templateId,
    //         assigned_roles: assignedPermissions.roles,
    //     }
    // }
    // async applyPermissionTemplateToUser(userId: number, permissionTemplateId: number) {
    // // Step 1: Get the user's employee record to access department/position
    // const user = await this.prisma.user.findUnique({
    //     where: { id: userId },
    //     include: {
    //     employee: true,
    //     },
    // });

    // if (!user || !user.employee) {
    //     throw new BadRequestException('User or employee data not found.');
    // }

    // const userDeptId = user.employee.department_id;
    // const userPosId = user.employee.position_id;

    // // Step 2: Load permission template with related role permissions
    // const template = await this.prisma.permissionTemplate.findUnique({
    //     where: { id: permissionTemplateId },
    //     include: {
    //     role_permissions: {
    //         include: {
    //         role_permissions: true,
    //         },
    //     },
    //     },
    // });

    // if (!template) {
    //     throw new BadRequestException('Permission template not found.');
    // }

    // // Step 3: Filter role permissions by user's department and position
    // const applicablePermissions = template.role_permissions
    //     .map(rp => rp.role_permissions)
    //     .filter(rp =>
    //     rp.department_id === userDeptId &&
    //     (rp.position_id === null || rp.position_id === userPosId)
    //     );

    // if (applicablePermissions.length === 0) {
    //     throw new BadRequestException('No applicable permissions found for this user.');
    // }

    // // Step 4: Create UserRole if not already existing
    // const userRoleMap = new Map<number, number>(); // Map<role_id, user_role_id>
    
    // for (const rp of applicablePermissions) {
    //     if (!userRoleMap.has(rp.role_id)) {
    //     const userRole = await this.prisma.userRole.upsert({
    //         where: {
    //         user_id_role_id: {
    //             user_id: user.id,
    //             role_id: rp.role_id,
    //         },
    //         },
    //         create: {
    //         user_id: user.id,
    //         role_id: rp.role_id,
    //         role_name: rp.role_name,
    //         },
    //         update: {}, // no update needed
    //     });

    //     userRoleMap.set(rp.role_id, userRole.id);
    //     }
    // }

    // // Step 5: Assign RolePermissions to user through UserPermission
    // const userPermissionsData = applicablePermissions.map(rp => ({
    //     action: rp.action,
    //     user_id: user.id,
    //     user_role_id: userRoleMap.get(rp.role_id)!,
    //     role_permission_id: rp.id,
    // }));

    // await this.prisma.userPermission.createMany({
    //     data: userPermissionsData,
    //     skipDuplicates: true, // prevent duplicate assignments
    // });

    // return {
    //     status: 'success',
    //     message: `Assigned ${userPermissionsData.length} permissions to user.`,
    // };
    // }
  async assignTemplateToUser(dto: AssignTemplateDto, manager: RequestUser) {
    const { user_id, template_id } = dto;
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: user_id },
        include: {
          employee: {
            select: {
              department_id: true,
              position_id: true,
            },
          },
          PermissionTemplateDepartment: true,
          roles: true
        },
      });

      if (!user || !user.employee) {
        throw new BadRequestException('User or employee not found');
      }

      // Verify the template is valid for this department (and optionally position)
      const templateDept = await tx.permissionTemplateDepartment.findFirst({
        where: {
          permission_template_id: template_id,
          department_id: user.employee.department_id,
          OR: [
            { position_id: user.employee.position_id },
            { position_id: null }, // fallback to template for all positions in dept
          ],
        },
        include: {
          permission_template_role_permissions: {
            include: { role_permissions: true },
          },
        },
      });

      if (!templateDept) {
        throw new BadRequestException('Template not valid for this department or position');
      }

      const userRolesMap = new Map<string, any>();

      for (const ptrp of templateDept.permission_template_role_permissions) {
        const rp = ptrp.role_permissions;
        const key = `${rp.role_id}-${rp.sub_module_id}`;

        let userRole = userRolesMap.get(key);

        if (!userRole) {
          userRole = await tx.userRole.findFirst({
            where: {
              user_id: user.id,
              role_id: rp.role_id,
            },
          });

          if (!userRole) {
            userRole = await tx.userRole.create({
              data: {
                user_id: user.id,
                role_id: rp.role_id,
                role_name: rp.role_name,
                created_at: new Date(),
              },
            });
          }

          userRolesMap.set(key, userRole);
        }

        const existingPermission = await tx.userPermission.findFirst({
          where: {
            user_id: user.id,
            user_role_id: userRole.id,
            role_permission_id: rp.id,
          },
        });

        if (!existingPermission) {
          await tx.userPermission.create({
            data: {
              user_id: user.id,
              user_role_id: userRole.id,
              role_permission_id: rp.id,
              action: rp.action,
            },
          });
        }
      }

      return {
        message: `Permissions from template '${template_id}' assigned to user`,
      };
    });
  }

  // async getPermissionTemplatesFor(departmentId: number, positionId?: number, user) {
  //   return this.prisma.permissionTemplate.findMany({
  //     where: {
  //       department_id: departmentId,
  //       departments: {
  //         some: {
  //           department_id: departmentId,
  //           OR: [
  //             { position_id: positionId },
  //             { position_id: null },
  //           ],
  //         },
  //       },
  //     },
  //     include: {
  //       departments: true,
  //       role_permissions: {
  //         include: {
  //           role_permissions: true,
  //         },
  //       },
  //     },
  //   });
  // }
  async getPermissionTemplatesFor(user: RequestUser) {
    const userWithEmployee = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        employee: true,
      },
    });

    if (!userWithEmployee || !userWithEmployee.employee) {
      throw new BadRequestException('User or employee not found');
    }

    const { department_id, position_id } = userWithEmployee.employee;

    if (!department_id && !position_id) {
      throw new BadRequestException('User has no department or position assigned');
    }

    return this.prisma.permissionTemplate.findMany({
      where: {
        department_id,
        departments: {
          some: {
            department_id,
            OR: [
              { position_id },
              { position_id: null },
            ],
          },
        },
      },
      include: {
        departments: true,
        role_permissions: {
          include: {
            role_permissions: true,
          },
        },
      },
    });
  }
} 
 

