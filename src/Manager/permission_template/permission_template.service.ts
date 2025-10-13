import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePermissionTemplateDto } from 'src/Manager/permission_template/dto/create-permission-template.dto';
import { RequestUser } from 'src/Components/types/request-user.interface';

@Injectable()
export class PermissionTemplateService {
    constructor (private prisma: PrismaService, ) {}

    //get permission template

async createPermissionTemplate(dto: CreatePermissionTemplateDto, user: RequestUser) {
  const { name, department_id, role_permission_ids } = dto;

  // Step 1: Create the permission template with one department
  const template = await this.prisma.permissionTemplate.create({
    data: {
      name,
      department: {
                create: {
          department_id: department_id,
          user_id: user.id,
        },
      }
      // departments: {
      //   create: {
      //     department_id: department_id,
      //     user_id: user.id,
      //   },
      // },
    },
    include: {
      departments: true, // we need the generated department ID
    },
  });

  const department = template.departments[0];

  // Step 2: Create role permissions tied to that department
  await this.prisma.permissionTemplateRolePermission.createMany({
    data: role_permission_ids.map(rpId => ({
      permission_template_id: template.id,
      role_permission_id: rpId,
      permission_template_department_id: department.id,
    })),
  });

  return {
    message: 'Template created successfully',
    template,
  };
}

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
    async applyPermissionTemplateToUser(userId: number, permissionTemplateId: number) {
    // Step 1: Get the user's employee record to access department/position
    const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
        employee: true,
        },
    });

    if (!user || !user.employee) {
        throw new BadRequestException('User or employee data not found.');
    }

    const userDeptId = user.employee.department_id;
    const userPosId = user.employee.position_id;

    // Step 2: Load permission template with related role permissions
    const template = await this.prisma.permissionTemplate.findUnique({
        where: { id: permissionTemplateId },
        include: {
        role_permissions: {
            include: {
            role_permissions: true,
            },
        },
        },
    });

    if (!template) {
        throw new BadRequestException('Permission template not found.');
    }

    // Step 3: Filter role permissions by user's department and position
    const applicablePermissions = template.role_permissions
        .map(rp => rp.role_permissions)
        .filter(rp =>
        rp.department_id === userDeptId &&
        (rp.position_id === null || rp.position_id === userPosId)
        );

    if (applicablePermissions.length === 0) {
        throw new BadRequestException('No applicable permissions found for this user.');
    }

    // Step 4: Create UserRole if not already existing
    const userRoleMap = new Map<number, number>(); // Map<role_id, user_role_id>
    
    for (const rp of applicablePermissions) {
        if (!userRoleMap.has(rp.role_id)) {
        const userRole = await this.prisma.userRole.upsert({
            where: {
            user_id_role_id: {
                user_id: user.id,
                role_id: rp.role_id,
            },
            },
            create: {
            user_id: user.id,
            role_id: rp.role_id,
            role_name: rp.role_name,
            },
            update: {}, // no update needed
        });

        userRoleMap.set(rp.role_id, userRole.id);
        }
    }

    // Step 5: Assign RolePermissions to user through UserPermission
    const userPermissionsData = applicablePermissions.map(rp => ({
        action: rp.action,
        user_id: user.id,
        user_role_id: userRoleMap.get(rp.role_id)!,
        role_permission_id: rp.id,
    }));

    await this.prisma.userPermission.createMany({
        data: userPermissionsData,
        skipDuplicates: true, // prevent duplicate assignments
    });

    return {
        status: 'success',
        message: `Assigned ${userPermissionsData.length} permissions to user.`,
    };
    }

} 
 

