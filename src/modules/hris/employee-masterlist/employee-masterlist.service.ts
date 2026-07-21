import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { RequestUser } from '../../../utils/types/request-user.interface';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';
import {
  CreateEmployeeWithDetailsDto,
  UpdateEmployeeWithDetailsDto,
} from './dto/employee-person.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { Gender, CivilStatus, Prisma, EmploymentHistoryType } from '@prisma/client';

@Injectable()
export class EmployeeMasterlistService {
  constructor(private prisma: PrismaService) {}

  async createEmployee(dto: CreateEmployeeWithDetailsDto, user: RequestUser) {
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
      'HR Recruiter',
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

    return await this.prisma.$transaction(async (tx) => {
      try {
        const { gender, civil_status } = dto.person;

        if (!Object.values(Gender).includes(gender)) {
          throw new ForbiddenException('Error! Please use male or female');
        }

        if (!Object.values(CivilStatus).includes(civil_status)) {
          throw new ForbiddenException(
            'Error! Please use single, married, separated, or widowed',
          );
        }

        const company = await tx.company.findUnique({
          where: { id: dto.employee.company_id },
        });
        if (!company) throw new BadRequestException('Invalid company_id');

        const department = await tx.department.findUnique({
          where: { id: dto.employee.department_id },
        });
        if (!department) throw new BadRequestException('Invalid department_id');

        const companyId = dto.employee.company_id;

        const existingPerson = await tx.person.findFirst({
          where: {
            email: dto.person.email,
          },
        });

        if (existingPerson) {
          //optionally, check if they're already employed
          const existingEmployee = await tx.employee.findFirst({
            where: {
              person_id: existingPerson.id,
              company_id: dto.employee.company_id,
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
          (await tx.person.create({
            data: {
              first_name: dto.person.first_name,
              middle_name: dto.person.middle_name,
              last_name: dto.person.last_name,
              date_of_birth: new Date(dto.person.date_of_birth),
              gender,
              civil_status,
              email: dto.person.email,
            },
          }));

        const hireDate = new Date(dto.employee.hire_date);
        const generatedEmpID = await this.createUniqueEmpID(
          tx,
          companyId,
          hireDate,
        );

        // double check this person isn't already employed
        const employeeCheck = await tx.employee.findFirst({
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

        const employee = await tx.employee.create({
          data: {
            person_id: person.id,
            employee_id: generatedEmpID,
            company_id: companyId,
            department_id: dto.employee.department_id,
            position_id: dto.employee.position_id,
            division_id: dto.employee.division_id,
            salary: dto.employee.salary,
            hire_date: hireDate,
            pay_frequency: dto.employee.pay_frequency,
            employment_status_id: dto.employee.employment_status_id,
            employment_type: dto.employee.employment_type,
            employee_type: dto.employee.employee_type,
            monthly_equivalent_salary: dto.employee.monthly_equivalent_salary,
            archive_date: dto.employee.archive_date,
            other_employee_data: dto.employee.other_employee_data,
            corporate_rank_id: dto.employee.corporate_rank_id,
            created_by: user.id ?? null,
          },
        });

        const histories = [
          {
            employee_id: employee.id,
            type: EmploymentHistoryType.company,
            current_id: employee.company_id,
            previous_id: null,
            effectivity_date: hireDate,
            created_by: user.id,
            remarks: 'Initial employment assignment',
          },
          {
            employee_id: employee.id,
            type: EmploymentHistoryType.department,
            current_id: employee.department_id,
            previous_id: null,
            effectivity_date: hireDate,
            created_by: user.id,
            remarks: 'Initial employment assignment',
          },
          {
            employee_id: employee.id,
            type: EmploymentHistoryType.position,
            current_id: employee.position_id ?? '',
            previous_id: null,
            effectivity_date: hireDate,
            created_by: user.id,
            remarks: 'Initial employment assignment',
          },
          {
            employee_id: employee.id,
            type: EmploymentHistoryType.division,
            current_id: employee.division_id,
            previous_id: null,
            effectivity_date: hireDate,
            created_by: user.id,
            remarks: 'Initial employment assignment',
          },
          {
            employee_id: employee.id,
            type: EmploymentHistoryType.vessel,
            current_id: employee.vessel_id ?? '',
            previous_id: null,
            effectivity_date: hireDate,
            created_by: user.id,
            remarks: 'Initial employment assignment',
          },
          {
            employee_id: employee.id,
            type: EmploymentHistoryType.employee_location,
            current_id: employee.user_location_id ?? '',
            previous_id: null,
            effectivity_date: hireDate,
            created_by: user.id,
            remarks: 'Initial employment assignment',
          },
          {
            employee_id: employee.id,
            type: EmploymentHistoryType.salary_grade,
            current_id: employee.salary_grade_id,
            previous_id: null,
            effectivity_date: hireDate,
            created_by: user.id,
            remarks: 'Initial employment assignment',
          },
          {
            employee_id: employee.id,
            type: EmploymentHistoryType.employment_status,
            current_id: employee.employment_status_id,
            previous_id: null,
            effectivity_date: hireDate,
            created_by: user.id,
            remarks: 'Initial employment assignment', 
          },
        ].filter(h => h.current_id);

        await tx.employmentHistory.createMany({
          data: histories,
        })

        const requestUser = await tx.user.findUnique({
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

        const userName = `${requestUser.employee.person?.first_name} ${requestUser.employee.person?.last_name}`;
        const userPosition = requestUser.employee.position?.name;

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
      'HR Recruiter',
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
          // to include division in employee schema
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
          vessel: {
            select: {
              name: true,
            }
          },
          user_location: {
            select: {
              location_name: true,
            }
          },
          // employment_history: {
          //   select: {
          //     current_id: true,
          //   }
          // },
          employment_type: true,
          employee_type: true,
          hire_date: true,
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

  async getEmployee(employeeId: string, user: RequestUser) {
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
      'HR Recruiter',
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
    // 1. Find the employee
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
      select: {
        id: true,
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        person: true,
        employee_id: true,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        position: {
          select: {
            id: true,
            name: true,
          },
        },
        division: {
          select: {
            id: true,
            name: true,
          },
        },
        employment_status: {
          select: {
            id: true,
            label: true,
          },
        },
        hire_date: true,
        salary: true,
        pay_frequency: true,
        employment_type: true,
        employee_type: true,
        monthly_equivalent_salary: true,
        archive_date: true,
        other_employee_data: true,
        corporate_rank_id: true,
        created_at: true,
        updated_at: true,
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

    return {
      status: 'success',
      message: 'Here is the Employee.',
      employee,
      // person: personDetails,
    };
  }

  async updateEmployee(
    employeeId: string,
    dto: UpdateEmployeeWithDetailsDto,
    user: RequestUser,
  ) {
    return await this.prisma.$transaction(async (prisma) => {
      const { person: UpdatePersonDto, employee: UpdateEmployeeDto } = dto;

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

      if (
        !requestUser ||
        !requestUser.employee ||
        !requestUser.employee.person
      ) {
        throw new BadRequestException(`User does not exist.`);
      }

      const allowedRoles = [
        'Administrator',
        'Super Administrator',
        'HR Administrator',
        'HR Recruiter',
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
      //1. check employee existence
      const employee = await prisma.employee.findUnique({
        where: { id: employeeId },
        include: { person: true },
      });

      if (!employee) {
        throw new BadRequestException('Employee not found.');
      }

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
              updated_by: user.id,
            },
          })
        : null;

      //4. update employee table
      const updatedEmployee = UpdateEmployeeDto
        ? await prisma.employee.update({
            where: { id: employeeId },
            data: {
              ...UpdateEmployeeDto,
              updated_by: user.id,
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

  async deleteEmployee(user: RequestUser, employeeId: string) {
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
      'HR Recruiter',
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

    const employee = await this.prisma.employee.delete({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException('Employee does not exist');
    }

    return {
      status: 'success',
      message: 'Employee has been deleted',
    };
  }
}

/**
 * Employment History SERVICE SECTION
 */

// export class EmploymentHistoryService {
//   constructor(private prisma: PrismaService) {}

//   async createEmploymentHistory(user: RequestUser, employeeId: string) {
//     const existingEmployee = await this.prisma.employee.findUnique({
//       where: { id: employeeId },
//       include: {
//         employment_history: true,
//         employment_status: true,
//       }
//     })

//     if (!existingEmployee) {
//       throw new NotFoundException("Employee not found")
//     }

//     const employmentHistory = await this.prisma.employmentHistory.
//   }
// }
