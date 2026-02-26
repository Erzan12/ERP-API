import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserLocationDto } from './dto/create-user-location.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { UpdateUserLocationDto } from './dto/update-user-location.dto';

@Injectable()
export class UserLocationService {
  constructor(private prisma: PrismaService) {}

  //query all available user locations
  async getUserLocations(user: RequestUser) {
    const user_location = await this.prisma.userLocation.findMany();
    if (!user_location) {
      throw new BadRequestException('No avaiable User Locations found');
    }
    return {
      status: 'success',
      message: 'Here are the list of User Locations.',
      data: {
        user_location,
      },
    };
  }

  //query a user location
  async getUserLocation(id: string, user: RequestUser) {
    const user_location = await this.prisma.userLocation.findUnique({
      where: { id },
    });
    if (!user_location) {
      throw new BadRequestException('User Location not found');
    }
    return {
      status: 'success',
      message: 'Here is the User Location.',
      data: {
        user_location,
      },
    };
  }

  //create a user location
  async createUserLocation(
    createUserLocationDto: CreateUserLocationDto,
    user: RequestUser,
  ) {
    const { location_name, address } = createUserLocationDto;

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

    const createUserLocation = await this.prisma.userLocation.create({
      data: {
        location_name: location_name,
        address: address,
      },
    });

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPosition = requestUser.employee.position.name;

    return {
      status: 'success',
      message: `${createUserLocation.location_name} User Location has been created successfully!`,
      created_by: {
        id: requestUser.id,
        name: userName,
        position: userPosition,
      },
      user_location_id: createUserLocation.id,
      user_location_name: createUserLocation.location_name,
    };
  }

  async updateUserLocation(
    id: string,
    updateUserLocationDto: UpdateUserLocationDto,
    user: RequestUser,
  ) {
    const { location_name, address, stat } = updateUserLocationDto;

    const userLocation = await this.prisma.userLocation.findUnique({
      where: { id: id },
    });

    if (!userLocation) {
      throw new NotFoundException('User location does not exist');
    }

    const updateUserLocation = await this.prisma.userLocation.update({
      where: { id },
      data: {
        location_name,
        address,
        stat,
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
      updated_by: {
        id: requestUser.id,
        name: userName,
        position: userPosition,
      },
      updateUserLocation,
    };
  }
}
