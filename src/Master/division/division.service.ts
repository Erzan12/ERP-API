import { BadRequestException, ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateDivisionDto } from './dto/create-division.dto';
import { RequestUser } from 'src/Components/types/request-user.interface';
import { UpdateDivisionDto } from './dto/update-division.dto.';

@Injectable()
export class DivisionService {
    constructor(private prisma: PrismaService) {}

    async getDivisions(user: RequestUser) {
        const division = await this.prisma.department.findMany()
        
        if(!division) {
            throw new BadRequestException('No available divisions found');
        }

        return {
            status: 'success',
            message: 'Here are the list of Divisions',
            data: {
                division,
            }
        };
    }

    async createDivision(createDivisionDto: CreateDivisionDto, user: RequestUser) {
        const { name, division_head_id, stat } = createDivisionDto;

        const existingDivision = await this.prisma.division.findFirst({
            where: {
                name: createDivisionDto.name,
                division_head_id: createDivisionDto.division_head_id,
            }
        });

        if (existingDivision) {
            throw new ConflictException('Division name already exists!');
        }

        const createDivision = await this.prisma.division.create({
            data: {
                name,
                division_head_id,
                stat
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
            message: `${createDivision.name} Division has been created successfully!`,
            created_by: {
                id: requestUser.id,
                name: userName,
                position: userPos,
            },
            division_id: createDivision.id,
            division_name: createDivision.name
        }
    }

    async updateDivision(updateDivisionDto: UpdateDivisionDto, user: RequestUser) {
        const existingDivision = await this.prisma.division.findUnique({
            where: { id: updateDivisionDto.division_id },
            select: {
                name: true,
                stat: true,
            }
        });

        if(!existingDivision){
            throw new BadRequestException('Department does not exist!');
        }

        if(existingDivision.stat === 0) {
            throw new ForbiddenException(`${existingDivision.name} Division status is inactive!`)
        }

        const updateDivision = await this.prisma.division.update({
            where: { id: updateDivisionDto.division_id },
            data: {
                name: updateDivisionDto.division_name,
                stat: updateDivisionDto.stat,
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
            message: `${updateDivision.name} Division has been updated successfully`,
            updated_by: {
                id: requestUser.id,
                name: userName,
                position: userPos
            },
            data: {
                division_id: updateDivision.id,
                division_name:updateDivision.name,
            },
        };
    }
}
