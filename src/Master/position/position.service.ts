import { Injectable, ForbiddenException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { RequestUser } from '../../Components/types/request-user.interface';

@Injectable()
export class PositionService {
    constructor(private prisma: PrismaService, private createPositionDto: CreatePositionDto) {}

    async getPositions(user: RequestUser) {

        const existingPositions = await this.prisma.position.findMany({
            include: {
                department: true,
            }
        })

        if(existingPositions.length === 0 ) {
            throw new BadRequestException('No available or active position exist!')
        }

        return {
            status: 'success',
            message: 'Here are the list of Positions',
            data: {
                existingPositions
            }
        }
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
                name: createPositionDto.name,
                department: {
                    connect: { id: createPositionDto.department_id }   // this links the foreign key
                },
                stat: createPositionDto.stat
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

    async updatePosition(updatePositionDto: UpdatePositionDto, user: RequestUser) {
        const { position_id, position_name, department_id, stat } = updatePositionDto;

        const existingPosition = await this.prisma.position.findFirst({
            where: { id: updatePositionDto.position_id },
            select: {
                id: true,
                name: true,
                stat: true,
            }
        });

        if(!existingPosition){
            throw new BadRequestException('Position not found!');
        }

        if(existingPosition.stat === 0){
            throw new ForbiddenException(`${existingPosition.name} Position status is inactive!`)
        }

        if (updatePositionDto.department_id !== undefined) {
        const existingDept = await this.prisma.department.findFirst({
            where: { id: updatePositionDto.department_id },
        });

        if (!existingDept) {
            throw new BadRequestException('Department not found!');
        }
        }

        const checkStat = await this.prisma.position.findFirst({
            where: { id: updatePositionDto.position_id },
            select: {
                stat: true,
            },
        })

        if(checkStat?.stat === 0) {
            throw new ForbiddenException(`${existingPosition.name} Position status is currently inactive`)
        }

        const updatePositionInfo = await this.prisma.position.update({
            where: { id: updatePositionDto.position_id },
            data: {
                id: existingPosition.id,
                name: position_name,
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
            message: `${existingPosition.name} Position has been updated Successfully!`,
            updated_by: {
                id: requestUser,
                name: userName,
                position: userPos,
            },
            data: {
                updatePositionInfo,
            },
        };
    }

    async deactivatePos (updatePositionDto: UpdatePositionDto, user: RequestUser) {
        const existingPos = await this.prisma.position.findUnique({
            where: { id: updatePositionDto.position_id },
            select: {
                name: true,
                stat: true,
            },
        });

        if(!existingPos) {
            throw new BadRequestException('Position does not exist!');
        }

        if(existingPos.stat === 0){
            throw new ForbiddenException(`${existingPos.name} Position is already deactivated!`);
        }

        const deactivate = await this.prisma.position.update({
            where: { id: updatePositionDto.position_id },
            data: {
                stat: updatePositionDto.stat,
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
            message: `${existingPos.name} Position has been deactivated successfully!`,
            deactivated_by: {
                id: requestUser.id,
                name: userName,
                position: userPos,
            },
            data: {
                deactivate
            },
        }
    }

    async reactivatePos(updatePositionDto: UpdatePositionDto, user: RequestUser) {
        const existingPos = await this.prisma.position.findUnique({
            where: { id: updatePositionDto.department_id },
            select: {
                name: true,
                stat: true,
            },
        });

        if (!existingPos) {
            throw new BadRequestException('Position does not exist!');
        }

        if (existingPos.stat === 1) {
            throw new ForbiddenException(`${existingPos} Position status is already active!`);
        }

        const activate = await this.prisma.position.update({
            where: { id: updatePositionDto.position_id },
            data: {
                name: updatePositionDto.position_name,
                stat: updatePositionDto.stat,
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
            message: `${existingPos.name} Position has been reactivated successfully!`,
            activated_by: {
                id: requestUser,
                name: userName,
                position: userPos,
            },
            data: {
                activate
            },
        };
    }

    async getPositionStatus(user: RequestUser, stat?: number) {
        let statusFilter: number | undefined;

        if (stat !== undefined) {
            if (stat === 1) {
                statusFilter = 1;
            } else if ( stat === 0) {
                statusFilter = 0;
            } else {
                throw new BadRequestException('Invalid status value. Must be "1 = active" or "0 = inactive".');
            }
        }

        const positions = await this.prisma.position.findMany({
            where: statusFilter !== undefined ? { stat: statusFilter } : {},
            orderBy: { name: 'asc' },
        });

        return {
            status: 'success',
            message: 'Positions status fetched successfully!',
            data: {
                positions
            }
        }
    }
}
