import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreatePersonDto } from '../person/dto/create-person.dto';
import { RequestUser } from '../../Components/types/request-user.interface';
import { GetEmployeeDto } from './dto/get-employee.dto';
import { CivilStatus, Gender } from '../../Components/decorators/global.enums.decorator';
import { CreateEmployeeWithDetailsDto } from './dto/create-employee-with-details.dto';

@Injectable()
export class EmployeeService {
    constructor (private prisma: PrismaService) {}
    async createEmployee(createEmployeeWithDetails: CreateEmployeeWithDetailsDto, user) {
        return await this.prisma.$transaction(async (prisma) => {
            const { gender, civil_status } = createEmployeeWithDetails.person;

            if (!Object.values(Gender).includes(gender as Gender)) {
            throw new ForbiddenException('Error! Please use male or female');
            }

            if (!Object.values(CivilStatus).includes(civil_status as CivilStatus)) {
            throw new ForbiddenException('Error! Please use single, married, separated, or widowed');
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
                throw new BadRequestException('This person is already employed in the company.');
            }

            //if they exist but not employed yet, you can reuse `person.id` below
            }
            const person = existingPerson ?? await prisma.person.create({
            data: {
                first_name: createEmployeeWithDetails.person.first_name,
                middle_name: createEmployeeWithDetails.person.middle_name,
                last_name: createEmployeeWithDetails.person.last_name,
                date_of_birth: new Date(createEmployeeWithDetails.person.date_of_birth),
                gender,
                civil_status,
                email: createEmployeeWithDetails.person.email,
            },
            });

            const hireDate = new Date(createEmployeeWithDetails.employee.hire_date);
            const generatedEmpID = await this.createUniqueEmpID(companyId, hireDate);

            // double check this person isn't already employed
            const employeeCheck = await prisma.employee.findFirst({
            where: {
                person_id: person.id,
                company_id: companyId,
            },
            });

            if (employeeCheck) {
            throw new BadRequestException('Employee already exists for this person in this company.');
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
                employment_status_id: createEmployeeWithDetails.employee.employment_status_id,
                monthly_equivalent_salary: createEmployeeWithDetails.employee.monthly_equivalent_salary,
                archive_date: createEmployeeWithDetails.employee.archive_date,
                other_employee_data: createEmployeeWithDetails.employee.other_employee_data,
                corporate_rank_id: createEmployeeWithDetails.employee.corporate_rank_id,
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
            const userPos = requestUser.employee.position.name;

            return {
                status: 'success',
                message: 'Employee created',
                employee,
                created_by: {
                    id: requestUser.id,
                    name: userName,
                    position: userPos,
                },
            };
        });
    }

    async createUniqueEmpID ( company_id: number, hire_date: Date ): Promise<string> {
        //fetch company abbreviation
        const company = await this.prisma.company.findUnique({
            where: { id: company_id },
            select: { abbreviation: true },
        });
        
        if (!company || !company.abbreviation) {
            throw new BadRequestException('Company not found or missing abbreviation');
        }

        //exclude 20 in year
        const year = hire_date.getFullYear().toString().slice(2); // "25"
        const month = String(hire_date.getMonth() + 1).padStart(2, '0'); // "07"
        const day = String(hire_date.getDate()).padStart(2, '0'); // "29"
        const hireDateStr = `${year}${month}${day}`; // "250729"

        const existingCount = await this.prisma.employee.count({
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
    async getEmployeeMasterlist(user: RequestUser) {
        // const hrViewEmployee = [ 'Human Resources' ].includes(user.role.name);

        const hrViewEmployee = user.roles.some(role => role.name === 'Human Resources');


        const viewEmployee = await this.prisma.employee.findMany({
            where: hrViewEmployee ? {} : { id: user.id },
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
                company: {
                    select: {
                        name: true
                    }
                },
                //to include designation in employee schema
                //to include group in employee schema
                department: {
                    select:{
                        name: true,
                    }
                },
                //to include division in employee schema
                position: {
                    select: {
                        name: true,
                    }
                },
                employment_status: true,
            },
        });

        return {
            status: 'success',
            message: hrViewEmployee ? 'Employee Masterlists' : 'Employees',
            data: {
                employee_masterlist: viewEmployee
            },
        };
    }

    async getEmployee(getEmployeeDto: GetEmployeeDto, user: RequestUser) {

        const getEmp = await this.prisma.employee.findUnique({
            where: { id: getEmployeeDto.employee_id},
            include: {
                person: true,
            }
        })
        const getPersonDetails = await this.prisma.person.findFirst({
            where: { id: getEmp?.person_id },
            select: {
                
            }
        })
    }
}
