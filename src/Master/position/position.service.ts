import { Injectable, ForbiddenException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { RequestUser } from '../../Components/types/request-user.interface';

@Injectable()
export class PositionService {
    constructor(private prisma: PrismaService) {}

    //get a single position
    async  getPosition(positionId: number, user: RequestUser) {
        const position = await this.prisma.position.findUnique({
            where: { id: positionId }
        });

        if (!position) {
            throw new BadRequestException('Position not found.')
        };

        return {
            status: 'success',
            message: 'Here is the Position',
            data: {
                position,
            },
        };
    }

    //get all available and active positions
    async getAllPositions(user: RequestUser) {

        const existingPositions = await this.prisma.position.findMany({
            where: {stat:1},
            include: {
                department: true,
            },
        });

        if(existingPositions.length === 0 ) {
            throw new BadRequestException('No available or active position exist!')
        }

        return {
            status: 'success',
            message: 'Here are the list of Positions',
            data: {
                existingPositions
            },
        };
    }

    async createPosition(createPositionDto: CreatePositionDto, user: RequestUser) {
        const { name, department_id, stat } = createPositionDto;

        console.log('createPositionDto:', createPositionDto);
        console.log('stat value:', createPositionDto.stat);

        //Check for duplicate position name
        const existingPosition = await this.prisma.position.findFirst({
            where: { name: createPositionDto.name },
            select: {
                name: true,
                department: true,
                stat: true
            },
        })

        if (existingPosition) {
            throw new ConflictException('Position already exist! Try again!')
        }

        //Validate incoming status
        if (createPositionDto.stat !== 1) {
            throw new BadRequestException('Invalid status. Only active is allowed.');
        }

        //Create the new position
        const createdPosition = await this.prisma.position.create({
            data: {
                name,
                department: {
                    connect: { id: createPositionDto.department_id }   // this links the foreign key
                },
                stat
            },
            include: {
                department: true
            },
        });

        const requestUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include:{
                employee: {
                    include: {
                        person: true,
                        position: true,
                    },
                },
            },
        });

        if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
            throw new BadRequestException(`User does not exist.`);
        }

        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPos = requestUser.employee.position.name;

        return {
            status: 'success',
            message: `${createdPosition.name} Position has been created successfully!`,
            created_by: {
                id: requestUser.id,
                name: userName,
                position: userPos,
            },
            data: {
                position_id: createdPosition.id,
                position_name: createdPosition.name
            },
        };
    }

    async updatePosition(positionId: number, updatePositionDto: UpdatePositionDto, user: RequestUser) {
        const { position_name, department_id, stat } = updatePositionDto;

        const position = await this.prisma.position.findUnique({
            where: { id: positionId },
            select: {
                id: true,
                name: true,
                stat: true,
            }
        })

        if (!position) {
            throw new BadRequestException('Position not Found.')
        }

        if (position.stat === 0){
            throw new ForbiddenException(`${position.name} Position status is inactive!`)
        }

        if (updatePositionDto.department_id !== undefined) {
        const existingDept = await this.prisma.department.findFirst({
            where: { id: updatePositionDto.department_id },
        });

        if (!existingDept) {
            throw new BadRequestException('Department not found!');
        }
        }

        const updatePositionInfo = await this.prisma.position.update({
            where: { id: positionId },
            data: {
                name: position_name,
                sorting: updatePositionDto.sorting,
                department_id,
                stat,
            },
        });

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
            message: `${position.name} Position has been updated Successfully!`,
            updated_by: {
                id: requestUser.id,
                name: userName,
                position: userPos,
            },
            data: {
                updatePositionInfo,
            },
        };
    }
}
