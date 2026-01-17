import { Injectable, ForbiddenException, ConflictException, BadRequestException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-dept.dto';
import { UpdateDepartmentDto } from './dto/update-dept.dto';
import { RequestUser } from '../../Components/types/request-user.interface';
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class DepartmentService {
    constructor(private prisma: PrismaService) {}

    //query all available departments
    async getAllDepartments(user: RequestUser) {
        const department = await this.prisma.department.findMany({
            include: {
                division: true,
            }
        })
        if(!department) {
            throw new BadRequestException('No available departments found');
        }
        return {
            status: 'success',
            message: 'Here are the list of Departments.',
            data: {
                department,
            }
        }
    }
    
    //to add single query of department
    async getDepartment(departmentId: number, user: RequestUser) {
        const department = await this.prisma.department.findUnique({
            where: { id: departmentId },
        });

        if (!department) {
            throw new BadRequestException('Department not found.');
        }

        return {
            status: 'success',
            message: 'Here is the Department',
            data: {
                department,
            }
        };
    }

    async createDepartment(createDepartmentDto: CreateDepartmentDto, user) {
        const { name, division_id, stat } = createDepartmentDto;
        
        const existingDepartment = await this.prisma.department.findFirst({
            where: {
                name: createDepartmentDto.name,
                division_id: createDepartmentDto.division_id,
            }
        });

        if(existingDepartment) {
            throw new BadRequestException('Department already exists!');
        }

        const requestUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: {
                employee: {
                    include: {
                        person: true,
                        position: true,
                    }
                },
                user_roles: true,
            }
        })

        if(!requestUser || !requestUser.employee || !requestUser.employee.person) {
            throw new BadRequestException(`User does not exist.`);
        }

        const isAdmin = requestUser.user_roles.some(
            role => role.role_id === 3 && role.role_name === 'Administrator'
        );

        if (!isAdmin) {
            throw new ForbiddenException(`User is not allowed to add new Department.`);
        }

        const createDepartment = await this.prisma.department.create({
            data: {
                name: createDepartmentDto.name,
                division: {
                connect: { id: createDepartmentDto.division_id }
                },
                stat: stat,
            }
        });

        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPos  = requestUser.employee.position.name;

        return {
            status: 'success',
            message: `${createDepartment.name} Department has been created successfully!`,
            created_by: {
                id: requestUser.id,
                name: userName,
                position: userPos,
            },
            department_id: createDepartment.id,
            department_name: createDepartment.name
        };
    }

    async updateDept(departmentId:number, updateDepartmentDto: UpdateDepartmentDto, user) {
        const { department_name, sorting,  division_id, stat } = updateDepartmentDto;

        const department = await this.prisma.department.findUnique({
            where: { id: departmentId },
            select: {
                name: true,
                stat: true,
            }
        });

        if(!department){
            throw new BadRequestException('Department does not exist!');
        }

        if(department.stat === 0) {
            throw new ForbiddenException(`${department.name} Department status is inactive!`);
        }

        const updateDept = await this.prisma.department.update({
            where: { id: departmentId },
            data: {
                name: department_name,  // assuming you want to change the name
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
                    }
                }
            }
        });

        if(!requestUser || !requestUser.employee || !requestUser.employee.person) {
            throw new BadRequestException(`User does not exist.`);
        }

        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPos = requestUser.employee.position.name;

        return {
            status: 'success',
            message: `${updateDept.name} Department has been updated successfully!`,
            updated_by: {
                id: requestUser.id,
                name: userName,
                position: userPos
            },
            data: {
                department_id: updateDept.id,
                department_name: updateDept.name
            },
        };
    }
}
