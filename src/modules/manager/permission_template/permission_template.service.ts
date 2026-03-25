import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreatePermissionTemplateDto } from 'src/modules/manager/permission_template/dto/create-permission-template.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { AssignTemplateDto } from './dto/assign-template.dto';
import { UpdatePermissionTemplateDto } from './dto/update-permission-template.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class PermissionTemplateService {
  constructor(private prisma: PrismaService) {}

  //get permission template
  async getPermissionTemplates(user: RequestUser) {
    const existingPermTemplate =
      await this.prisma.permissionTemplate.findMany();

    if (existingPermTemplate.length === 0) {
      throw new BadRequestException(
        'No available permission templates available',
      );
    }

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

    const allowedRoles = [
      'Administrator',
      'Super Administrator',
      'HR Manager',
      'HR Clerk',
      'HR Staff',
    ];

    const canView = requestUser.user_roles.some((role) =>
      allowedRoles.includes(role.role_name),
    );

    if (!canView) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

    return {
      status: 'success',
      message: 'Here are the list of Permission Templates',
      data: {
        existingPermTemplate,
      },
    };
  }

  //get a permission template
  async getPermissionTemplate(id: string, user: RequestUser) {
    const permissionTemplate = await this.prisma.permissionTemplate.findUnique({
      where: { id },
    });

    if (!permissionTemplate) {
      throw new BadRequestException('Permission Template not found.');
    }

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

    const allowedRoles = [
      'Administrator',
      'Super Administrator',
      'HR Manager',
      'HR Clerk',
      'HR Staff',
    ];

    const canView = requestUser.user_roles.some((role) =>
      allowedRoles.includes(role.role_name),
    );

    if (!canView) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

    return {
      status: 'success',
      message: 'Here is the Permission Template',
      data: {
        permissionTemplate,
      },
    };
  }

  async createPermissionTemplate(
    dto: CreatePermissionTemplateDto,
    user: RequestUser,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const { name, department_id, position_id, role_permission_ids } = dto;

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

  //update existing permission template
  async updatePermissionTemplate(
    permissionTemplateId: string,
    dto: UpdatePermissionTemplateDto,
    user: RequestUser,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const { name, department_id, position_id, role_permission_ids } = dto;

      const existing = await tx.permissionTemplate.findUnique({
        where: { id: permissionTemplateId },
        include: {
          departments: true,
          role_permissions: true,
        },
      });

      if (!existing) {
        throw new BadRequestException('Permission template does not exist');
      }

      // Prevent duplicate names
      if (name && name !== existing.name) {
        const duplicate = await tx.permissionTemplate.findFirst({
          where: { name, NOT: { id: permissionTemplateId } },
        });

        if (duplicate) {
          throw new BadRequestException(
            'Permission template name already exists',
          );
        }
      }

      // 1. Update template base info
      const updatedTemplate = await tx.permissionTemplate.update({
        where: { id: permissionTemplateId },
        data: {
          name,
          department_id,
        },
      });

      // 2. Handle department/position record
      // Remove old dept/position associations
      await tx.permissionTemplateDepartment.deleteMany({
        where: { permission_template_id: permissionTemplateId },
      });

      //default the existing values of posId and deptId
      const departmentIdToUse =
        department_id ?? existing.departments[0]?.department_id;

      const positionIdToUse =
        position_id ?? existing.departments[0]?.position_id;

      const ptDept = await tx.permissionTemplateDepartment.create({
        data: {
          permission_template_id: permissionTemplateId,
          department_id: departmentIdToUse,
          position_id: positionIdToUse,
          user_id: user.id,
        },
      });

      // 3. Remove old role-permission relations
      await tx.permissionTemplateRolePermission.deleteMany({
        where: {
          permission_template_id: permissionTemplateId,
        },
      });

      // 4. Fetch rolePermission objects that match department + position
      const rolePermissions = await tx.rolePermission.findMany({
        where: {
          id: { in: role_permission_ids },
          department_id,
          ...(position_id && { position_id }),
        },
      });

      // 5. Create new mappings
      for (const rp of rolePermissions) {
        await tx.permissionTemplateRolePermission.create({
          data: {
            permission_template_id: permissionTemplateId,
            role_permission_id: rp.id,
            permission_template_department_id: ptDept.id,
          },
        });
      }

      return {
        message: 'Permission template updated',
        template_id: updatedTemplate.id,
        name: updatedTemplate.name,
      };
    });
  }

  async assignTemplateToUser(dto: AssignTemplateDto, user: RequestUser) {
    const { user_id, template_id } = dto;
    return this.prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { id: user_id },
        include: {
          employee: {
            select: {
              department_id: true,
              position_id: true,
            },
          },
          PermissionTemplateDepartment: true,
          user_roles: true,
        },
      });

      if (!existingUser || !existingUser.employee) {
        throw new BadRequestException('User or employee not found');
      }

      // Verify the template is valid for this department (and optionally position)
      const templateDept = await tx.permissionTemplateDepartment.findFirst({
        where: {
          permission_template_id: template_id,
          department_id: existingUser.employee.department_id,
          OR: [
            { position_id: existingUser.employee.position_id },
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
        throw new BadRequestException(
          'Template not valid for this department or position',
        );
      }

      const userRolesMap = new Map<string, UserRole>();

      for (const ptrp of templateDept.permission_template_role_permissions) {
        const rp = ptrp.role_permissions;
        const key = `${rp.role_id}-${rp.sub_module_id}`;

        let userRole = userRolesMap.get(key);

        if (!userRole) {
          const existing = await tx.userRole.findFirst({
            where: {
              user_id: user.id,
              role_id: rp.role_id,
            },
            include: { role: true },
          });

          if (existing) {
            userRole = existing;
          } else {
            userRole = await tx.userRole.create({
              data: {
                user_id: user.id,
                role_id: rp.role_id,
                role_name: rp.role_name,
                created_at: new Date(),
              },
              include: {
                role: true,
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

      if (
        !requestUser ||
        !requestUser.employee ||
        !requestUser.employee.person
      ) {
        throw new BadRequestException(`User does not exist.`);
      }

      const isAdmin = requestUser.user_roles.some(
        (role) =>
          role.role_name === 'Administrator' ||
          role.role_name === 'Super Administrator',
      );

      if (!isAdmin) {
        throw new ForbiddenException(
          'You are not allowed to perform this action',
        );
      }

      return {
        message: `Permissions from template '${template_id}' assigned to user`,
      };
    });
  }

  async getUserPermissionTemplate(
    userPermissionTemplateId: string,
    user: RequestUser,
  ) {
    const userWithEmployee = await this.prisma.user.findUnique({
      where: { id: userPermissionTemplateId },
      include: {
        employee: true,
      },
    });

    if (!userWithEmployee || !userWithEmployee.employee) {
      throw new BadRequestException('User or employee not found');
    }

    const { department_id, position_id } = userWithEmployee.employee;

    if (!department_id && !position_id) {
      throw new BadRequestException(
        'User has no department or position assigned',
      );
    }

    const userPermissionTemplate =
      await this.prisma.permissionTemplate.findMany({
        where: {
          department_id,
          departments: {
            some: {
              department_id,
              OR: [{ position_id }, { position_id: null }],
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
      message: 'Here is the Users Permission Template.',
      userPermissionTemplate,
    };
  }
}
