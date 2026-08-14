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
  CreateErCaseViolationDto,
  UpdateErCaseViolationDto,
} from './dto/er-case-violations.dto';
import { ErCaseViolationPaginationDto } from 'src/utils/dtos/er-case-pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ErCaseViolationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getViolations(user: RequestUser, dto: ErCaseViolationPaginationDto) {
    const { search, sortBy, order, page, perPage } = dto;

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

    const skip = (page - 1) * perPage;

    const whereCondition: Prisma.HrErCaseViolationWhereInput = {
      is_active: true,
    };

    const articleField = ['title'];

    let whereConditions: Prisma.HrErCaseViolationWhereInput = {};

    if (search) {
      whereConditions = {
        OR: [
          ...articleField.map((field) => ({
            article: {
              [field]: {
                contains: search,
                mode: 'insensitive',
              },
            },
          })),
          {
            behavior: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            category: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      };
    }

    const allowSortFields = [
      'id',
      'article_id',
      'section',
      'behavior',
      'category',
      'created_at',
      'updated_at',
    ];

    const safeSortBy = allowSortFields.includes(sortBy) ? sortBy : 'created_at';

    const [total, erCaseViolations] = await this.prisma.$transaction([
      this.prisma.hrErCaseViolation.count({
        where: {
          ...whereCondition,
          ...whereConditions,
        },
      }),
      this.prisma.hrErCaseViolation.findMany({
        where: {
          ...whereCondition,
          ...whereConditions,
        },
        include: {
          article: {
            select: {
              id: true,
              title: true,
              is_active: true,
            },
          },
          createdBy: {
            select: {
              person: {
                select: {
                  first_name: true,
                  middle_name: true,
                  last_name: true,
                },
              },
            },
          },
          updatedBy: {
            select: {
              person: {
                select: {
                  first_name: true,
                  middle_name: true,
                  last_name: true,
                },
              },
            },
          },
        },
        skip,
        take: perPage,
        orderBy: {
          [safeSortBy]: order,
        },
      }),
    ]);

    // if (erCaseViolations.length === 0) {
    //     throw new NotFoundException('No Employee Relation Case Violations found.');
    // }

    return {
      status: 'success',
      message: 'Here is the list of Employee Relation Case Violations',
      count: total,
      page,
      perPage,
      erCaseViolations,
    };
  }

  async getViolation(erCaseViolationId: string, user: RequestUser) {
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

    const erCaseViolation = await this.prisma.hrErCaseViolation.findUnique({
      where: { id: erCaseViolationId, is_active: true },
    });

    if (!erCaseViolation || erCaseViolation.is_active === false) {
      throw new NotFoundException(
        'Employee Relation Case Violation does not exist.',
      );
    }

    return {
      status: 'success',
      message: 'Here is the Employee Relation Case Violation',
      erCaseViolation,
    };
  }

  async createViolation(dto: CreateErCaseViolationDto, user: RequestUser) {
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

    const existingViolation = await this.prisma.hrErCaseViolation.findFirst({
      where: { behavior: dto.behavior },
    });

    if (existingViolation) {
      throw new ConflictException(
        'Employee Relation Case Violation already exists.',
      );
    }

    const existingArticle = await this.prisma.hrErCaseArticle.findUnique({
      where: { id: dto.article_id },
    });

    if (!existingArticle) {
      throw new NotFoundException(
        'Employee Relation Case Article does not exist',
      );
    }

    const erCaseViolation = await this.prisma.hrErCaseViolation.create({
      data: {
        article_id: dto.article_id,
        section: dto.section,
        behavior: dto.behavior,
        category: dto.category,
        created_by: user.id,
      },
    });

    return {
      status: 'success',
      message: 'Employee Relation Case Violation successfully created',
      erCaseViolation,
    };
  }

  async updateViolation(
    erCaseViolationId: string,
    dto: UpdateErCaseViolationDto,
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

    const erCaseViolation = await this.prisma.hrErCaseViolation.findUnique({
      where: { id: erCaseViolationId },
    });

    if (!erCaseViolation) {
      throw new NotFoundException(
        'Employee Relation Case Violation does not exist',
      );
    }

    const updateErCaseViolation = await this.prisma.hrErCaseViolation.update({
      where: { id: erCaseViolationId },
      data: {
        article_id: dto.article_id ?? erCaseViolation.article_id,
        section: dto.section ?? erCaseViolation.section,
        behavior: dto.behavior ?? erCaseViolation.behavior,
        category: dto.category ?? erCaseViolation.category,
        updated_by: user.id,
      },
    });

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPosition = requestUser.employee.position.name;

    return {
      status: 'success',
      message: 'Employee Relation Case Violation has been updated successfully',
      updateErCaseViolation,
      updated_by: `${userName} - ${userPosition}`,
    };
  }
}
