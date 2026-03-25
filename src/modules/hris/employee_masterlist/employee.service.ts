import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';

import {
  CivilStatus,
  Gender,
} from '../../../utils/decorators/global.enums.decorator';

import { RequestUser } from '../../../utils/types/request-user.interface';

import { PaginationDto } from 'src/utils/dtos/pagination.dto';
import {
  CreateEmployeeWithDetailsDto,
  UpdateEmployeeWithDetailsDto,
} from './dto/employee-person.dto';

import { PrismaService } from 'src/config/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async createEmployee(
    createEmployeeWithDetails: CreateEmployeeWithDetailsDto,
    user: RequestUser,
  ) {
    return await this.prisma.$transaction(async (prisma) => {
      try {
        const { gender, civil_status } = createEmployeeWithDetails.person;

        if (!Object.values(Gender).includes(gender)) {
          throw new ForbiddenException('Error! Please use male or female');
        }

        if (!Object.values(CivilStatus).includes(civil_status)) {
          throw new ForbiddenException(
            'Error! Please use single, married, separated, or widowed',
          );
        }

        const company = await prisma.company.findUnique({
          where: { id: createEmployeeWithDetails.employee.company_id },
        });
        if (!company) throw new BadRequestException('Invalid company_id');

        const department = await prisma.department.findUnique({
          where: { id: createEmployeeWithDetails.employee.department_id },
        });
        if (!department) throw new BadRequestException('Invalid department_id');

        const companyId = createEmployeeWithDetails.employee.company_id;

        const existingPerson = await prisma.person.findFirst({
          where: {
            email: createEmployeeWithDetails.person.email,
          },
        });

        if (existingPerson) {
          //optionally, check if they're already employed
          const existingEmployee = await prisma.employee.findFirst({
            where: {
              person_id: existingPerson.id,
              company_id: createEmployeeWithDetails.employee.company_id,
            },
          });

          if (existingEmployee) {
            throw new BadRequestException(
              'This person is already employed in the company.',
            );
          }

          //if they exist but not employed yet, you can reuse `person.id` below
        }
        const person =
          existingPerson ??
          (await prisma.person.create({
            data: {
              first_name: createEmployeeWithDetails.person.first_name,
              middle_name: createEmployeeWithDetails.person.middle_name,
              last_name: createEmployeeWithDetails.person.last_name,
              date_of_birth: new Date(
                createEmployeeWithDetails.person.date_of_birth,
              ),
              gender,
              civil_status,
              email: createEmployeeWithDetails.person.email,
            },
          }));

        const hireDate = new Date(createEmployeeWithDetails.employee.hire_date);
        const generatedEmpID = await this.createUniqueEmpID(
          prisma,
          companyId,
          hireDate,
        );

        // double check this person isn't already employed
        const employeeCheck = await prisma.employee.findFirst({
          where: {
            person_id: person.id,
            company_id: companyId,
          },
        });

        if (employeeCheck) {
          throw new BadRequestException(
            'Employee already exists for this person in this company.',
          );
        }

        const employee = await prisma.employee.create({
          data: {
            person_id: person.id,
            employee_id: generatedEmpID,
            company_id: companyId,
            department_id: createEmployeeWithDetails.employee.department_id,
            position_id: createEmployeeWithDetails.employee.position_id,
            division_id: createEmployeeWithDetails.employee.division_id,
            salary: createEmployeeWithDetails.employee.salary,
            hire_date: hireDate,
            pay_frequency: createEmployeeWithDetails.employee.pay_frequency,
            employment_status_id:
              createEmployeeWithDetails.employee.employment_status_id,
            monthly_equivalent_salary:
              createEmployeeWithDetails.employee.monthly_equivalent_salary,
            archive_date: createEmployeeWithDetails.employee.archive_date,
            other_employee_data:
              createEmployeeWithDetails.employee.other_employee_data,
            corporate_rank_id:
              createEmployeeWithDetails.employee.corporate_rank_id,
            created_by: user.id ?? null,
          },
        });

        const requestUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            employee: {
              include: {
                person: true,
                position: true,
              },
            },
          },
        });

        if (!requestUser?.employee?.person) {
          throw new BadRequestException(`User does not exist.`);
        }

        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPosition = requestUser.employee.position.name;

        return {
          status: 'success',
          message: 'Employee created',
          employee,
          created_by_user: `${userName} - ${userPosition}`,
        };
      } catch (error) {
        console.error('CREATE EMPLOYEE ERROR');
        console.error(
          'Message:',
          error instanceof Error ? error.message : String(error),
        );
        console.error('Stack:', error instanceof Error ? error.stack : 'N/A');
        console.error('Full error:', error);
        console.error('Transaction failed:', error);
        throw error;
      }
    });
  }

  //UNIQUE COMPANY EMPLOYEE ID FORMAT - ABISC-250710-001
  async createUniqueEmpID(
    prisma: Prisma.TransactionClient,
    company_id: string,
    hire_date: Date,
  ): Promise<string> {
    //fetch company abbreviation
    const company = await prisma.company.findUnique({
      where: { id: company_id },
      select: { abbreviation: true },
    });

    if (!company || !company.abbreviation) {
      throw new BadRequestException(
        'Company not found or missing abbreviation',
      );
    }

    //exclude 20 in year
    const year = hire_date.getFullYear().toString().slice(2); // "25"
    const month = String(hire_date.getMonth() + 1).padStart(2, '0'); // "07"
    const day = String(hire_date.getDate()).padStart(2, '0'); // "29"
    const hireDateStr = `${year}${month}${day}`; // "250729"

    const existingCount = await prisma.employee.count({
      where: {
        company_id: company_id,
        hire_date: hire_date,
      },
    });

    //generate the employee_id
    const suffix = String(existingCount + 1).padStart(3, '0'); // e.g. 001, 002
    const employeeID = `${company.abbreviation}-${hireDateStr}-${suffix}`;

    //log emp id generator
    console.log('Generated Employee ID:', employeeID); // debug only

    return employeeID;
  }

  //view employee masterlist
  //with pagination
  async getEmployees(
    user: RequestUser,
    dto: PaginationDto,
    // page = 1,
    // perPage = 10,
    // search?: string,
    // sortBy: string = 'id',
    // order: 'asc' | 'desc' = 'asc',
  ) {
    // const hrViewEmployee = [ 'Human Resources' ].includes(user.role.name);

    // const hrViewEmployee = user.roles.some(
    //   (role) => role.name === 'Human Resources',
    // );

    const { search, sortBy, order, page, perPage } = dto;

    // const canView = await this.prisma.userRole.findFirst({
    //   where: {
    //     user_id: user.id,
    //     role_name: {
    //       in: [
    //         'Administrator',
    //         'Super Administrator',
    //         'HR Manager',
    //         'HR Clerk',
    //         'HR Staff',
    //       ],
    //     },
    //   },
    // });

    // if (!canView) {
    //   throw new BadRequestException(
    //     'You are not allowed to view this sub module',
    //   );
    // }

    //PAGINATION AREA
    const skip = (page - 1) * perPage;

    const whereCondition: Prisma.EmployeeWhereInput = {
      employment_status: {
        //as long as its not terminated or resigned
        code: {
          notIn: [
            'TERMINATED', // TERMINATED
            'RESIGNED', // RESIGNED
          ],
        },
      },
    };

    //search query
    const personFields = ['first_name', 'last_name', 'email'];
    const employmentStatusFields = ['code', 'label'];
    const departmentFields = ['name'];
    const companyFields = ['name'];
    const divisionFields = ['name'];
    const positionFields = ['name'];

    let whereConditions: Prisma.EmployeeWhereInput = {};

    if (search) {
      whereConditions = {
        OR: [
          ...personFields.map((field) => ({
            person: {
              [field]: {
                contains: search,
                mode: 'insensitive',
              },
            },
          })),
          ...employmentStatusFields.map((field) => ({
            employment_status: {
              [field]: {
                contains: search,
                mode: 'insensitive',
              },
            },
          })),
          ...departmentFields.map((field) => ({
            department: {
              [field]: {
                contains: search,
                mode: 'insensitive',
              },
            },
          })),
          ...companyFields.map((field) => ({
            company: {
              [field]: {
                contains: search,
                mode: 'insensitive',
              },
            },
          })),
          ...divisionFields.map((field) => ({
            division: {
              [field]: {
                contains: search,
                mode: 'insensitive',
              },
            },
          })),
          ...positionFields.map((field) => ({
            position: {
              [field]: {
                contains: search,
                mode: 'insensitive',
              },
            },
          })),
          {
            employee_id: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      };
    }

    const allowSortFields = [
      'department_id',
      'company_id',
      'employee_id',
      'employment_status_id',
      'created_at',
      'updated_at',
    ];
    const safeSortBy = allowSortFields.includes(sortBy) ? sortBy : 'created_at';

    const [total, employees] = await this.prisma.$transaction([
      // where: hrViewEmployee ? {} : { id: user.id },
      this.prisma.employee.count({
        where: {
          ...whereCondition,
          ...whereConditions,
        },
      }),
      this.prisma.employee.findMany({
        where: {
          ...whereCondition,
          ...whereConditions,
        },
        select: {
          id: true,
          employee_id: true,
          person: {
            select: {
              first_name: true,
              middle_name: true,
              last_name: true,
            },
          },
          division: {
            select: {
              name: true,
            },
          },
          company: {
            select: {
              name: true,
            },
          },
          //to include designation in employee schema
          //to include group in employee schema
          department: {
            select: {
              name: true,
            },
          },
          //to include division in employee schema
          position: {
            select: {
              name: true,
            },
          },
          employment_status: {
            select: {
              label: true,
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
      message: 'Employees Masterlist',
      count: total,
      page,
      perPage,
      // totalPage: Math.ceil(total / perPage),
      employees,
    };
  }

  async getEmployee(id: string, user: RequestUser) {
    // 1. Find the employee
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        person: true, // fetch person details automatically
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

    if (!employee) {
      throw new BadRequestException('Employee not found.');
    }

    // 2. Optional: select specific person fields if you want
    // const personDetails = await this.prisma.person.findFirst({
    //   where: { id: employee.person_id },
    //   select: {
    //     first_name: true,
    //     last_name: true,
    //     middle_name: true,
    //     date_of_birth: true,
    //     gender: true,
    //     civil_status: true,
    //     email: true,
    //     contact_no: true,
    //   },
    // });

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
      message: 'Here is the Employee.',
      employee,
      // person: personDetails,
    };
  }

  async updateEmployee(
    id: string,
    updateEmployeeWithDetailsDto: UpdateEmployeeWithDetailsDto,
    user: RequestUser,
  ) {
    return await this.prisma.$transaction(async (prisma) => {
      //1. check employee existence
      const employee = await prisma.employee.findUnique({
        where: { id },
        include: { person: true },
      });

      if (!employee) {
        throw new BadRequestException('Employee not found.');
      }

      const { person: UpdatePersonDto, employee: UpdateEmployeeDto } =
        updateEmployeeWithDetailsDto;

      //2. validate enums only if provided
      if (UpdatePersonDto?.gender) {
        if (!Object.values(Gender).includes(UpdatePersonDto.gender)) {
          throw new BadRequestException('Invalid gender value.');
        }
      }

      if (UpdatePersonDto?.civil_status) {
        if (
          !Object.values(CivilStatus).includes(UpdatePersonDto.civil_status)
        ) {
          throw new BadRequestException('Invalid civil status vlue.');
        }
      }

      //3. update person table
      const updatedPerson = UpdatePersonDto
        ? await prisma.person.update({
            where: { id: employee.person_id },
            data: {
              ...UpdatePersonDto,
              updated_at: user.id ?? undefined,
            },
          })
        : null;

      //4. update employee table
      const updatedEmployee = UpdateEmployeeDto
        ? await prisma.employee.update({
            where: { id },
            data: {
              ...UpdateEmployeeDto,
              updated_at: user.id ?? undefined,
            },
          })
        : null;

      //5. return combined result
      return {
        employee: updatedEmployee,
        person: updatedPerson,
      };
    });
  }
}
