import {
  BadRequestException,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';

import { PaginationDto } from 'src/utils/dtos/pagination.dto';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';

import { RequestUser } from 'src/utils/types/request-user.interface';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  //query single company
  async getCompany(companyId: string, user: RequestUser) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      include: {
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
    });

    if (!company) {
      throw new NotFoundException('Company not found or is inactive.');
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
      message: 'Here is the Company.',
      company,
    };
  }

  //query all company available
  async getCompanies(user: RequestUser, dto: PaginationDto) {
    const { search, sortBy, order, page, perPage } = dto;

    //PAGINATION AREA
    const skip = (page - 1) * perPage;

    const whereCondition: Prisma.CompanyWhereInput = {
      is_active: true,
    };

    const stringFields = [
      'name',
      'abbreviation',
      'address',
      'company_tin',
      'fax_no',
      'telephone_no',
    ] as const;

    if (search) {
      //handle int and boolean search
      const orConditions: Prisma.CompanyWhereInput[] = [];

      // whereConditions = {
      //   OR: companyFields.map((field) => ({
      //     [field]: {
      //       contains: search,
      //       mode: 'insensitive',
      //     },
      //   })),
      // };

      // string search
      orConditions.push(
        ...stringFields.map((field) => ({
          [field]: {
            contains: search,
            mode: 'insensitive',
          },
        })),
      );

      //boolean search
      // if ( search === 'true' || search === 'false' ) {
      //   orConditions.push({
      //     is_top_20000: search === 'true',
      //   })
      // }

      // number search
      if (!isNaN(Number(search))) {
        orConditions.push({
          is_top_20000: Number(search),
        });
      }

      //boolean search
      if (search === 'true' || search === 'false') {
        orConditions.push({
          is_active: search === 'true',
        });
      }

      whereCondition.OR = orConditions;
    }

    const allowSortFeilds = [
      'id',
      'created_at',
      'updated_at',
      'name',
      'abbreviation',
    ];
    // if (!allowSortFeilds.includes(sortBy)) {
    //   sortBy;
    // }
    const safeSortBy = allowSortFeilds.includes(sortBy) ? sortBy : 'created_at';

    const [total, companies] = await this.prisma.$transaction([
      this.prisma.company.count({
        where: {
          ...whereCondition,
        },
      }),
      this.prisma.company.findMany({
        where: {
          ...whereCondition,
        },
        include: {
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

    // if (companies.length === 0) {
    //   throw new BadRequestException('No available companies found.');
    // }

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
      message: 'Here are the list of Companies.',
      count: total,
      page,
      perPage,
      // totalPages: Math.ceil( total / perPage),
      companies,
    };
  }

  async createCompany(createCompanyDto: CreateCompanyDto, user: RequestUser) {
    const {
      name,
      address,
      telephone_no,
      fax_no,
      company_tin,
      is_top_20000,
      abbreviation,
    } = createCompanyDto;

    const existingCompany = await this.prisma.company.findFirst({
      where: {
        name: createCompanyDto.name,
      },
    });

    if (existingCompany) {
      throw new ConflictException('Company already exist!');
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

    const isAdmin = requestUser.user_roles.some(
      (role) =>
        // role.role_id === 'b1118e05-6377-4e64-a677-14f9b9226fdd' &&
        role.role_name === 'Administrator' || 'Super Administrator',
    );

    if (!isAdmin) {
      throw new ForbiddenException('User is not allowed to view Companies');
    }

    const company = await this.prisma.company.create({
      data: {
        name,
        address,
        telephone_no,
        fax_no,
        company_tin,
        abbreviation,
        is_top_20000,
        created_by: user.id,
      },
    });

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPosition = requestUser.employee.position.name;

    return {
      status: 'success',
      message: `${company.name} company has been createad successfully!`,
      // created_by: {
      //   id: requestUser.id,
      //   name: userName,
      //   position: userPos,
      // },
      company,
      created_by_user: `${userName} - ${userPosition}`,
    };
  }

  async updateCompany(
    companyId: string,
    updateCompanyDto: UpdateCompanyDto,
    user: RequestUser,
  ) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: {
        name: true,
        is_active: true,
      },
    });

    if (!company) {
      throw new NotFoundException('Company does not exist or inactive!');
    }

    const updatedCompany = await this.prisma.company.update({
      where: { id: companyId },
      data: {
        name: updateCompanyDto.name ?? undefined,
        address: updateCompanyDto.address ?? undefined,
        telephone_no: updateCompanyDto.telephone_no ?? undefined,
        fax_no: updateCompanyDto.fax_no ?? undefined,
        company_tin: updateCompanyDto.company_tin ?? undefined,
        is_top_20000: updateCompanyDto.is_top_20000 ?? undefined,
        abbreviation: updateCompanyDto.abbreviation ?? undefined,
        is_active: updateCompanyDto.is_active ?? undefined,
        updated_by: user.id,
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
      throw new ForbiddenException('User is not allowed to view Companies');
    }

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPosition = requestUser.employee.position.name;

    return {
      status: 'success',
      message: `${updatedCompany.name} company has been updated successfully!`,
      // updated_by: {
      //   id: requestUser.id,
      //   name: userName,
      //   position: userPos,
      // },
      updatedCompany,
      updated_by_user: `${userName} - ${userPosition}`,
    };
  }
}
