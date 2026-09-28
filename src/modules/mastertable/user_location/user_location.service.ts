import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateUserLocationDto,
  UpdateUserLocationDto,
} from './dto/user-location.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserLocationService {
  constructor(private prisma: PrismaService) {}

  //query all available user locations
  async getUserLocations(user: RequestUser, dto: PaginationDto) {
    const { search, sortBy, order, page, perPage } = dto;

    const skip = (page - 1) * perPage;

    const whereCondition: Prisma.UserLocationWhereInput = {
      is_active: true,
    };

    const stringFields = [
      'location_name',
      'address_line_1',
      'address_line_2',
      'city',
      'province',
      'country',
    ] as const;

    if (search) {
      //handle init and boolean search
      const orConditions: Prisma.UserLocationWhereInput[] = [];

      //string search
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
      //     stat or isActive: search === 'true',
      //   })
      // }

      whereCondition.OR = orConditions;
    }

    const allowSortFeilds = [
      'id',
      'created_at',
      'updated_at',
      'location_name',
      'province',
      'city',
    ];
    // if (allowSortFeilds.includes(sortBy)) {
    //   sortBy;
    // }
    const safeSortBy = allowSortFeilds.includes(sortBy) ? sortBy : 'created_at';

    const [total, userLocations] = await this.prisma.$transaction([
      this.prisma.userLocation.count({
        where: {
          ...whereCondition,
        },
      }),
      this.prisma.userLocation.findMany({
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

    // if (userLocations.length === 0) {
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
      message: 'Here are the list of User Locations.',
      count: total,
      page,
      perPage,
      // totalPages: Math.ceil( total / perPage ),
      userLocations,
    };
  }

  //query a user location
  async getUserLocation(userLocationId: string, user: RequestUser) {
    const user_location = await this.prisma.userLocation.findUnique({
      where: { id: userLocationId },
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

    if (!user_location) {
      throw new BadRequestException('User Location not found');
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
      message: 'Here is the User Location.',
      user_location,
    };
  }

  //create a user location
  async createUserLocation(
    createUserLocationDto: CreateUserLocationDto,
    user: RequestUser,
  ) {
    const {
      location_name,
      address_line_1,
      address_line_2,
      city,
      province,
      country,
    } = createUserLocationDto;

    const existingUserLocation = await this.prisma.userLocation.findFirst({
      where: {
        location_name: createUserLocationDto.location_name,
      },
    });
    if (existingUserLocation) {
      throw new BadRequestException('User Location already exists!');
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
        role.role_name === 'Administrator',
    );

    if (!isAdmin) {
      throw new ForbiddenException(
        'User is not allowed to add new User Location.',
      );
    }

    console.log('Current user role', isAdmin);

    const userLocation = await this.prisma.userLocation.create({
      data: {
        location_name,
        address_line_1,
        address_line_2,
        city,
        province,
        country,
        created_by: user.id,
      },
    });

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPosition = requestUser.employee.position.name;

    return {
      status: 'success',
      message: `${userLocation.location_name} User Location has been created successfully!`,
      userLocation,
      created_by_user: `${userName} - ${userPosition}`,
    };
  }

  async updateUserLocation(
    userLocationId: string,
    updateUserLocationDto: UpdateUserLocationDto,
    user: RequestUser,
  ) {
    const userLocation = await this.prisma.userLocation.findUnique({
      where: { id: userLocationId },
    });

    if (!userLocation) {
      throw new NotFoundException('User location does not exist');
    }

    const updateUserLocation = await this.prisma.userLocation.update({
      where: { id: userLocationId },
      data: {
        location_name: updateUserLocationDto.location_name ?? undefined,
        address_line_1: updateUserLocationDto.address_line_1 ?? undefined,
        address_line_2: updateUserLocationDto.address_line_2 ?? undefined,
        city: updateUserLocationDto.city ?? undefined,
        province: updateUserLocationDto.province ?? undefined,
        country: updateUserLocationDto.country ?? undefined,
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
      throw new NotFoundException('User does not exist');
    }

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPosition = requestUser.employee.position.name;

    const isAdmin = requestUser.user_roles.some(
      (role) =>
        // role.role_id === 'b1118e05-6377-4e64-a677-14f9b9226fdd' &&
        role.role_name === 'Administrator',
    );

    if (!isAdmin) {
      throw new ForbiddenException(
        'User is not allowed to update User Location.',
      );
    }

    return {
      status: 'success',
      message: `${userLocation.location_name} User Location has been updated successfully!`,
      updateUserLocation,
      updated_by: `${userName} - ${userPosition}`,
    };
  }
}
