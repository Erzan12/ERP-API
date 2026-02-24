import {
  BadRequestException,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  //query single company
  async getCompany(id: string, user: RequestUser) {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new BadRequestException('Company not found.');
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
        'User is not allowed to view a Company',
      );
    }

    return {
      status: 'success',
      message: 'Here is the Company.',
      company,
    };
  }

  //query all company available
  async getCompanies(user: RequestUser) {
    const company = await this.prisma.company.findMany();

    if (!company) {
      throw new BadRequestException('No available companies found.');
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
        'User is not allowed to view Companies',
      );
    }

    return {
      status: 'success',
      message: 'Here are the list of Companies.',
      company,
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
      stat,
    } = createCompanyDto;

    const existingCompany = await this.prisma.company.findFirst({
      where: {
        name: createCompanyDto.name,
      }
    })

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
      throw new ForbiddenException(
        'User is not allowed to view Companies',
      );
    }

    const createCompany = await this.prisma.company.create({
      data: {
        name,
        address,
        telephone_no,
        fax_no,
        company_tin,
        abbreviation,
        is_top_20000,
        stat,
      },
    });

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPos = requestUser.employee.position.name;

    return {
      status: 'success',
      message: `${createCompany.name} Company has been createad successfully!`,
      created_by: {
        id: requestUser.id,
        name: userName,
        position: userPos,
      },
      company_id: createCompany.id,
      company_name: createCompany.name,
    };
  }

  async updateCompany(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
    user: RequestUser,
  ) {
    const {
      name,
      address,
      telephone_no,
      fax_no,
      company_tin,
      is_top_20000,
      abbreviation,
      stat,
    } = updateCompanyDto;

    const company = await this.prisma.company.findUnique({
      where: { id },
      select: {
        name: true,
        stat: true,
      },
    });

    if (!company || company.stat === 0) {
      throw new NotFoundException('Company does not exist or inactive!');
    }

    const updateCompany = await this.prisma.company.update({
      where: { id },
      data: {
        name,
        address,
        telephone_no,
        fax_no,
        company_tin,
        is_top_20000,
        abbreviation,
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
      throw new BadRequestException(`User does not exist.`);
    }

    const isAdmin = requestUser.user_roles.some(
      (role) =>
        // role.role_id === 'b1118e05-6377-4e64-a677-14f9b9226fdd' &&
        role.role_name === 'Administrator' || 'Super Administrator',
    );

    if (!isAdmin) {
      throw new ForbiddenException(
        'User is not allowed to view Companies',
      );
    }

    const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    const userPos = requestUser.employee.position.name;

    return {
      status: 'success',
      message: `${updateCompany.name} Company has been updated successfully!`,
      updated_by: {
        id: requestUser.id,
        name: userName,
        position: userPos,
      },
      company_id: updateCompany.id,
      company_name: updateCompany.name,
    };
  }
}
