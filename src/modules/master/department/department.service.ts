import {
  Injectable,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-dept.dto';
import { UpdateDepartmentDto } from './dto/update-dept.dto';
import { RequestUser } from '../../../utils/types/request-user.interface';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class DepartmentService {
  constructor(private prisma: PrismaService) {}

  //query all available departments
  async getDepartments(user: RequestUser) {
    const departments = await this.prisma.department.findMany({
      include: {
        division: true,
      },
    });

    if (!departments) {
      throw new BadRequestException('No available departments found');
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
      throw new ForbiddenException('User is not allowed to view Departments');
    }

    return {
      status: 'success',
      message: 'Here are the list of Departments.',
      departments,
    };
  }

  //to add single query of department
  async getDepartment(id: string, user: RequestUser) {
    const department = await this.prisma.department.findUnique({
      where: { id },
    });

    if (!department || department.stat === 0) {
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
      throw new ForbiddenException('User is not allowed to view a Department');
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

    const isAdmin = requestUser.user_roles.some(
      (role) =>
        // role.role_id === 'b1118e05-6377-4e64-a677-14f9b9226fdd' &&
        role.role_name === 'Administrator' || 'Superadministrator',
    );

    if (!isAdmin) {
      throw new ForbiddenException(
        `User is not allowed to add new Department.`,
      );
    }

    const createDepartment = await this.prisma.department.create({
      data: {
        name: createDepartmentDto.name,
        division: {
          connect: { id: createDepartmentDto.division_id },
        },
      },
    });

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPos = requestUser.employee.position.name;

    return {
      status: 'success',
      message: `${createDepartment.name} Department has been created successfully!`,
      created_by: {
        id: requestUser.id,
        name: userName,
        position: userPos,
      },
      department_id: createDepartment.id,
      department_name: createDepartment.name,
    };
  }

  async updateDepartment(
    id: string,
    updateDepartmentDto: UpdateDepartmentDto,
    user: RequestUser,
  ) {
    const { department_name, sorting, division_id, stat } = updateDepartmentDto;

    const department = await this.prisma.department.findUnique({
      where: { id },
      select: {
        name: true,
        stat: true,
      },
    });

    if (!department || department.stat === 0) {
      throw new BadRequestException(
        'Department does not exist or is inactive!',
      );
    }

    const updateDept = await this.prisma.department.update({
      where: { id },
      data: {
        name: department_name,
        sorting,
        division_id,
        stat,
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
    const userPos = requestUser.employee.position.name;

    return {
      status: 'success',
      message: `${updateDept.name} Department has been updated successfully!`,
      updated_by: {
        id: requestUser.id,
        name: userName,
        position: userPos,
      },
      department_id: updateDept.id,
      department_name: updateDept.name,
    };
  }
}
