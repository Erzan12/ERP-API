import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import {
  CreateErCaseArticleDto,
  UpdateErCaseArticleDto,
} from './dto/er-case-articles.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { ErCaseArticlePaginationDto } from 'src/utils/dtos/er-related-pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ErCaseArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  async getArticles(user: RequestUser, dto: ErCaseArticlePaginationDto) {
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

    const whereCondition: Prisma.HrErCaseArticleWhereInput = {
      is_active: true,
    };

    // if (dto.status) {
    //     whereCondition.is_active = dto.status
    // }

    if (search) {
      const orConditions: Prisma.HrErCaseArticleWhereInput[] = [];

      orConditions.push({
        title: {
          contains: search,
          mode: 'insensitive',
        },
      });

      whereCondition.OR = orConditions;
    }

    const allowSortFields = ['id', 'created_at', 'updated_at'];

    const safeSortBy = allowSortFields.includes(sortBy) ? sortBy : 'created_at';

    const [total, erCaseArticles] = await this.prisma.$transaction([
      this.prisma.hrErCaseArticle.count({
        where: {
          ...whereCondition,
        },
      }),
      this.prisma.hrErCaseArticle.findMany({
        where: {
          ...whereCondition,
        },
        include: {
          hr_er_case_violations: true,
        },
        skip,
        take: perPage,
        orderBy: {
          [safeSortBy]: order,
        },
      }),
    ]);

    // const erCaseArticles = await this.prisma.hrErCaseArticle.findMany({
    //     where: { is_active: true },
    //     include: {
    //         hr_er_case_violations: true,
    //     },
    // });

    if (erCaseArticles.length === 0) {
      throw new BadRequestException(
        'No Employee Relation Case Articles found.',
      );
    }

    return {
      status: 'success',
      message: 'Here is the list of Employee Relation Case Articles',
      count: total,
      page,
      perPage,
      erCaseArticles,
    };
  }

  async getArticle(erCaseArticleId: string, user: RequestUser) {
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

    const erCaseArticle = await this.prisma.hrErCaseArticle.findUnique({
      where: { id: erCaseArticleId, is_active: true },
      include: {
        hr_er_case_violations: true,
      },
    });

    if (!erCaseArticle || erCaseArticle.is_active === false) {
      throw new NotFoundException(
        'Employee Relation Case Article does not exist or is inactive',
      );
    }

    return {
      status: 'success',
      message: 'Here is the Employee Relation Case Article',
      erCaseArticle,
    };
  }

  async createArticle(dto: CreateErCaseArticleDto, user: RequestUser) {
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

    const existingErCaseArticle = await this.prisma.hrErCaseArticle.findFirst({
      where: { title: dto.title },
    });

    if (existingErCaseArticle) {
      throw new ConflictException(
        'Employee Relation Case Article already exists.',
      );
    }

    const erCaseArticle = await this.prisma.hrErCaseArticle.create({
      data: {
        title: dto.title,
        created_by: user.id,
      },
    });

    return {
      status: 'success',
      message: `Employee Relation ${erCaseArticle.title} has been created`,
      erCaseArticle,
    };
  }

  async updateArticle(
    erCaseArticleId: string,
    dto: UpdateErCaseArticleDto,
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

    const erCaseArticle = await this.prisma.hrErCaseArticle.findUnique({
      where: { id: erCaseArticleId },
    });

    if (!erCaseArticle) {
      throw new NotFoundException(
        'Employee Relation Case Article does not exist',
      );
    }

    const updateErCaseArticle = await this.prisma.hrErCaseArticle.update({
      where: { id: erCaseArticleId },
      data: {
        title: dto.title ?? erCaseArticle.title,
        is_active: dto.is_active ?? erCaseArticle.is_active,
        updated_by: user.id,
      },
    });

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPosition = requestUser.employee.position.name;

    return {
      status: 'success',
      message: `${updateErCaseArticle.title} Article has been updated successfully`,
      updateErCaseArticle,
      updated_by: `${userName} - ${userPosition}`,
    };
  }
}
