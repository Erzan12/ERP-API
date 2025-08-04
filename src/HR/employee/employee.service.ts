import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreatePersonDto } from '../person/dto/create-person.dto';
import { RequestUser } from '../../Components/types/request-user.interface';
import { GetEmployeeDto } from './dto/get-employee.dto';
import { CivilStatus, Gender } from '../../Components/decorators/global.enums.decorator';

@Injectable()
export class EmployeeService {
    constructor (private prisma: PrismaService) {}

    async createEmployee( createPersonDto: CreatePersonDto, createEmployeeDto: CreateEmployeeDto, user) {

        return await this.prisma.$transaction(async (prisma) => {
            // create the Person
            const person = await this.prisma.person.create({
                data : {
                    first_name: createPersonDto.first_name,
                    middle_name: createPersonDto.last_name,
                    last_name: createPersonDto.last_name,
                    date_of_birth: new Date(createPersonDto.date_of_birth),
                    gender: createPersonDto.gender,
                    civil_status: createPersonDto.civil_status,
                    // optionally add gender, nationality, etc. if available in DTO
                },
            });

            if (!Object.values(Gender).includes(person.gender as Gender)) {
            throw new ForbiddenException('Error! Please use male or female');
            }

            if (!Object.values(CivilStatus).includes(person.civil_status as CivilStatus)) {
            throw new ForbiddenException('Error! Please use single, married, separated, or widowed');
            }

            const company = await this.prisma.company.findUnique({
                where: { id: createEmployeeDto.company_id },
            });
            if (!company) {
                throw new BadRequestException('Invalid company_id');
            }

            const department = await this.prisma.department.findUnique({
                where: { id: createEmployeeDto.department_id },
            });
            if (!department) {
                throw new BadRequestException('Invalid department_id');
            }

            // const hireDate = createEmployeeDto.hire_date; BASIS FOR EMPLOYEE GENERATOR linking to createdUniqueEmpID async method
            const companyId = createEmployeeDto.company_id;
            const hireDate = new Date(createEmployeeDto.hire_date);
            const generatedEmpID = await this.createUniqueEmpID(companyId, hireDate );

            // create the Employee
            const employee = await this.prisma.employee.create({
                data : {
                    company_id: companyId,    // to be adjusted dto can be added if experiencing an error
                    person_id: person.id,
                    employee_id: generatedEmpID,    //format "LMVC-20250702-001" LMVC based on company_id.abbreviation - 20250702 date hired - 001 increment as how many employees got hired that day
                    department_id: createEmployeeDto.department_id,
                    hire_date: hireDate,
                    position_id: createEmployeeDto.position_id,
                    salary: createEmployeeDto.salary,
                    pay_frequency:  createEmployeeDto.pay_frequency,
                    employment_status_id: createEmployeeDto.employment_status_id,
                    monthly_equivalent_salary: createEmployeeDto.monthly_equivalent_salary,
                    corporate_rank_id: createEmployeeDto.corporate_rank_id,
                }
            });

            if(employee.employee_id) {
                throw new BadRequestException('Employee already exist!')
            }

            const requestUser = await this.prisma.user.findUnique({
                where: { id: user.id },
                include:{
                    employee: {
                        include: {
                            person: true,
                            position: true,
                        }
                    }
                }
            })

            if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
                throw new BadRequestException(`User does not exist.`);
            }

            const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
            const userPos = requestUser.employee.position.name;

            return { 
                status: 'success',
                message: 'Employee created', employee,
                created_by: {
                    id: requestUser.id,
                    name:userName,
                    position: userPos,
                },
            };
        }) 
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
