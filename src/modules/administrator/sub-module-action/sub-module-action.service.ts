import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { RequestUser } from 'src/utils/types/request-user.interface';
import {
  CreateSubModuleActionDto,
  UpdateSubmoduleActionDto,
} from './dto/sub-module-action.dto';

@Injectable()
export class SubModuleActionService {
  constructor(private readonly prisma: PrismaService) {}

  async getSubModuleAction(subModulePermissionId: string, user: RequestUser) {
    // Auth check first
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
      'HR Administrator',
      'HR Manager',
      'HR Clerk',
      'HR Staff',
    ];
    const canView = requestUser?.user_roles.some((role) =>
      allowedRoles.includes(role.role_name),
    );

    if (!canView) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

    const subModuleAction = await this.prisma.subModuleAction.findUnique({
      where: { id: subModulePermissionId },
    });

    if (!subModuleAction) {
      throw new NotFoundException('Submodule Action does not exist');
    }

    return {
      status: 'success',
      message: 'Here is the Submodule Action',
      subModuleAction,
    };
  }

  async getSubModuleActions(user: RequestUser) {
    // Auth check first
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
      'HR Administrator',
      'HR Manager',
      'HR Clerk',
      'HR Staff',
    ];
    const canView = requestUser?.user_roles.some((role) =>
      allowedRoles.includes(role.role_name),
    );

    if (!canView) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

    const subModuleAction = await this.prisma.subModuleAction.findMany();

    if (subModuleAction.length === 0) {
      throw new NotFoundException(
        'No Submodule actions yet available or added',
      );
    }

    return {
      status: 'success',
      message: 'Here is the list of Submodule Actions available',
      subModuleAction,
    };
  }

  //add new submodule permission -> acts as inventory of all permisison/actions that can be assigned to a submodule
  async createSubModuleAction(
    dto: CreateSubModuleActionDto,
    user: RequestUser,
  ) {
    const { action } = dto;

    // Auth check first
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
      'HR Administrator',
      'HR Manager',
      'HR Clerk',
      'HR Staff',
    ];
    const canView = requestUser?.user_roles.some((role) =>
      allowedRoles.includes(role.role_name),
    );

    if (!canView) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

    const existingAction = await this.prisma.subModuleAction.findFirst({
      where: { action },
    });

    if (existingAction) {
      throw new ConflictException('Sub Module Action already exist!');
    }

    const slug = action
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    const subModuleAction = await this.prisma.subModuleAction.create({
      data: {
        action,
        slug,
        created_by: user.id,
      },
    });

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPos = requestUser.employee.position.name;

    return {
      status: 'success',
      message: `Added new Sub Module action successfully`,
      created_by: `${userName} - ${userPos}`,
      subModuleAction,
    };
  }

  async updateSubmoduleAction(
    dto: UpdateSubmoduleActionDto,
    user: RequestUser,
    subModuleActionId: string,
  ) {
    const { action, is_active } = dto;

    // Auth check first
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
      'HR Administrator',
      'HR Manager',
      'HR Clerk',
      'HR Staff',
    ];
    const canView = requestUser?.user_roles.some((role) =>
      allowedRoles.includes(role.role_name),
    );

    if (!canView) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

    const existingSubModulePermission =
      await this.prisma.subModuleAction.findFirst({
        where: { id: subModuleActionId },
      });

    if (!existingSubModulePermission) {
      throw new NotFoundException('Sub Module permission does not exist!');
    }

    // if (existingSubModulePermission.stat === 0) {
    //     throw new ForbiddenException(`${existingSubModulePermission.action} action status is inactive`);
    // }

    const slug = action
      ?.toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-0-]/g, '');

    const updateSubModulePermission = await this.prisma.subModuleAction.update({
      where: { id: subModuleActionId },
      data: {
        action,
        slug,
        is_active,
        updated_by: user.id,
      },
    });

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPos = requestUser.employee.position.name;

    return {
      status: 'success',
      message: `${existingSubModulePermission.action} action has been updated successfully!`,
      updated_by: {
        id: requestUser.id,
        name: userName,
        position: userPos,
      },
      data: {
        updateSubModulePermission,
      },
    };
  }

  async deleteSubmoduleAction(submoduleActionId: string, user: RequestUser) {
    // Auth check first
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
      'HR Administrator',
      'HR Manager',
      'HR Clerk',
      'HR Staff',
    ];
    const canView = requestUser?.user_roles.some((role) =>
      allowedRoles.includes(role.role_name),
    );

    if (!canView) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }
    
    const submoduleAction = await this.prisma.subModuleAction.delete({
      where: { id: submoduleActionId },
    });

    if (!submoduleAction) {
      throw new NotFoundException('Submodule Action does not exist');
    }

    return {
      status: 'success',
      message: 'Sub module action deleted successfully',
      submoduleAction,
    };
  }
}
