import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import {
  CreateErCaseTypesOfOffenseDto,
  UpdateErCaseTypesOfOffenseDto,
} from './dto/types-of-offense.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';

@Injectable()
export class ErCaseTypesOfOffenseService {
  constructor(private readonly prisma: PrismaService) {}

  async getTypeOfOffense(erCaseTypeOfOffenseId: string, user: RequestUser) {
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

    const erCaseTypeOfOffense =
      await this.prisma.hrErCaseTypeOfOffense.findUnique({
        where: { id: erCaseTypeOfOffenseId, is_active: true },
      });

    if (!erCaseTypeOfOffense || erCaseTypeOfOffense.is_active === false) {
      throw new BadRequestException(
        'Employee Relation Type of Offense does not exist or is inactive',
      );
    }

    return {
      status: 'success',
      message: 'Here is the Employee Relation Type of Offense',
      erCaseTypeOfOffense,
    };
  }

  async getTypeOfOffenses(user: RequestUser) {
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

    const erCaseTypeOfOffenses =
      await this.prisma.hrErCaseTypeOfOffense.findMany();

    if (erCaseTypeOfOffenses.length === 0) {
      throw new NotFoundException('No Type of Offenses yet added.');
    }

    return {
      status: 'success',
      message: 'Here is the list of Type of Offenses',
      erCaseTypeOfOffenses,
    };
  }

  async createTypeOfOffense(
    dto: CreateErCaseTypesOfOffenseDto,
    user: RequestUser,
  ) {
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

    const existingTypeOfOffense =
      await this.prisma.hrErCaseTypeOfOffense.findFirst({
        where: { type_of_offense: dto.type_of_offense, is_active: true },
      });

    if (existingTypeOfOffense) {
      throw new ConflictException('Type of Offense already existed.');
    }

    const typeOfOffense = await this.prisma.hrErCaseTypeOfOffense.create({
      data: {
        type_of_offense: dto.type_of_offense,
        description: dto.description,
        created_by: user.id,
      },
    });

    return {
      status: 'success',
      message:
        'Employee Relations Type of Offense has been created successfully',
      typeOfOffense,
    };
  }

  async updateTypeOfOffense(
    erCaseTypeOfOffenseId: string,
    dto: UpdateErCaseTypesOfOffenseDto,
    user: RequestUser,
  ) {
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

    const erCaseTypeOfOffense =
      await this.prisma.hrErCaseTypeOfOffense.findUnique({
        where: { id: erCaseTypeOfOffenseId },
      });

    if (!erCaseTypeOfOffense) {
      throw new BadRequestException(
        'Employee Relation Type of Offense does not exist or is inactive',
      );
    }

    const updateErCaseTypeOffense =
      await this.prisma.hrErCaseTypeOfOffense.update({
        where: { id: erCaseTypeOfOffenseId },
        data: {
          type_of_offense:
            dto.type_of_offense ?? erCaseTypeOfOffense.type_of_offense,
          description: dto.description ?? erCaseTypeOfOffense.description,
          is_active: dto.is_active,
          updated_by: user.id,
        },
      });

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPosition = requestUser.employee.position.name;

    return {
      status: 'success',
      message:
        'Employee Relation Case Type of Offense has been updated successfully',
      updateErCaseTypeOffense,
      updated_by: `${userName} - ${userPosition}`,
    };
  }
}
