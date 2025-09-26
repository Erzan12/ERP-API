import { Injectable, ForbiddenException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-dept.dto';
import { UpdateDepartmentDto } from './dto/update-dept.dto';
import { RequestUser } from '../../Components/types/request-user.interface';

@Injectable()
export class DepartmentService {
    constructor(private prisma: PrismaService) {}

    async getDepartments(user: RequestUser) {
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
            message: 'Here are the list of Departments',
            data: {
                department,
            }
        }
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
            throw new BadRequestException('Department name already exists!');
        }

        const createdDepartment = await this.prisma.department.create({
            data: {
                name: createDepartmentDto.name,
                division: {
                connect: { id: createDepartmentDto.division_id }
                },
                stat: stat,
            }
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
        })

        if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
            throw new BadRequestException(`User does not exist.`);
        }

        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPos  = requestUser.employee.position.name;

        return {
            status: 'success',
            message: `${createdDepartment.name} Department has been created successfully!`,
            created_by: {
                id: requestUser.id,
                name: userName,
                position: userPos,
            },
            department_id: createdDepartment.id,
            department_name: createdDepartment.name
        };
    }

    async updateDept(updateDepartmentDto: UpdateDepartmentDto, user) {
        const existingDept = await this.prisma.department.findUnique({
            where: { id: updateDepartmentDto.department_id },
            select: {
                name: true,
                stat: true,
            }
        });

        if(!existingDept){
            throw new BadRequestException('Department does not exist!');
        }

        if(existingDept.stat === 0) {
            throw new ForbiddenException(`${existingDept.name} Department status is inactive!`);
        }

        const updateDept = await this.prisma.department.update({
            where: { id: updateDepartmentDto.department_id },
            data: {
                name: updateDepartmentDto.department_name,  // assuming you want to change the name
                division_id: updateDepartmentDto.division_id,
                stat: updateDepartmentDto.stat,
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
