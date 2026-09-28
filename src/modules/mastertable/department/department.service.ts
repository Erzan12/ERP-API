import {
  Injectable,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';
import { RequestUser } from '../../../utils/types/request-user.interface';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DepartmentService {
  constructor(private prisma: PrismaService) {}

  //query all available departments
  async getDepartments(user: RequestUser, dto: PaginationDto) {
    const { search, sortBy, order, page, perPage } = dto;

    const skip = (page - 1) * perPage;

    const whereCondition: Prisma.DepartmentWhereInput = {
      is_active: true,
    };

    if (search) {
      //handle int and boolean search
      const orConditions: Prisma.DepartmentWhereInput[] = [];

      //string field search
      orConditions.push({
        name: {
          contains: search,
          mode: 'insensitive',
        },
      });

      // Division name (relation search)
      //scalable search if e.g in department table there is division_id PK and its UUID and youll be searching for name not the pk itself
      orConditions.push({
        division: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      });

      //boolean search
      if (search === 'true' || search === 'false') {
        orConditions.push({
          is_active: search === 'true',
        });
      }

      // number search
      if (!isNaN(Number(search))) {
        orConditions.push({
          sorting: Number(search),
        });
      }

      whereCondition.OR = orConditions;
    }

    const allowSortFeilds = [
      'id',
      'created_at',
      'updated_at',
      'name',
      'division_id',
      'sorting',
    ];
    // if (!allowSortFeilds.includes(sortBy)) {
    //   sortBy;
    // }
    const safeSortBy = allowSortFeilds.includes(sortBy) ? sortBy : 'created_at';

    const [total, departments] = await this.prisma.$transaction([
      this.prisma.department.count({
        where: {
          ...whereCondition,
        },
      }),
      this.prisma.department.findMany({
        where: {
          ...whereCondition,
        },
        include: {
          division: {
            select: {
              id: true,
              name: true,
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

    // if (departments.length === 0) {
    //   throw new BadRequestException('No available departments found.');
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
      message: 'Here are the list of Departments.',
      count: total,
      page,
      perPage,
      // totalPages: Math.ceil( total / perPage),
      departments,
    };
  }

  //to add single query of department
  async getDepartment(departmentId: string, user: RequestUser) {
    const department = await this.prisma.department.findUnique({
      where: { id: departmentId },
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

    if (!department) {
      throw new BadRequestException('Department not found or is inactive');
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
      throw new ForbiddenException('You are not allowed perform this action');
    }

    return {
      status: 'success',
      message: 'Here is the Department',
      department,
    };
  }

  async createDepartment(
    createDepartmentDto: CreateDepartmentDto,
    user: RequestUser,
  ) {
    const existingDepartment = await this.prisma.department.findFirst({
      where: {
        name: createDepartmentDto.name,
        division_id: createDepartmentDto.division_id,
      },
    });

    if (existingDepartment) {
      throw new ConflictException('Department already exists!');
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
      throw new ForbiddenException('You are not allowed to create department');
    }

    const department = await this.prisma.department.create({
      data: {
        name: createDepartmentDto.name,
        division: {
          connect: { id: createDepartmentDto.division_id },
        },
        createdBy: {
          connect: { id: user.id },
        },
      },
    });

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPosition = requestUser.employee.position.name;

    return {
      status: 'success',
      message: `${department.name} Department has been created successfully!`,
      // created_by: {
      //   id: requestUser.id,
      //   name: userName,
      //   position: userPos,
      // },
      department,
      created_by_user: `${userName} - ${userPosition}`,
    };
  }

  async updateDepartment(
    departmentId: string,
    updateDepartmentDto: UpdateDepartmentDto,
    user: RequestUser,
  ) {
    const department = await this.prisma.department.findUnique({
      where: { id: departmentId },
      select: {
        name: true,
        is_active: true,
      },
    });

    if (!department || department.is_active === false) {
      throw new BadRequestException(
        'Department does not exist or is inactive!',
      );
    }

    const updatedDepartment = await this.prisma.department.update({
      where: { id: departmentId },
      data: {
        name: updateDepartmentDto.name ?? undefined,
        sorting: updateDepartmentDto.sorting ?? undefined,
        division_id: updateDepartmentDto.division_id ?? undefined,
        is_active: updateDepartmentDto.is_active ?? undefined,
        updated_by: user.id,
        //will be added to department schema updated_by and updated_at fields
        // updated_by: user.id,           // optional: if you track who updated it
        // updated_at: new Date(),        // optional: if you track timestamps
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
      throw new ForbiddenException('User is not allowed to update Department');
    }

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPosition = requestUser.employee.position.name;

    return {
      status: 'success',
      message: `${updatedDepartment.name} Department has been updated successfully!`,
      // updated_by: {
      //   id: requestUser.id,
      //   name: userName,
      //   position: userPos,
      // },
      updatedDepartment,
      updated_by_user: `${userName} - ${userPosition}`,
    };
  }
}
