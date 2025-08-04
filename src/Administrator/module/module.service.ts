import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateModuleDto } from './dto/create-module.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ModuleService {
    constructor(private prisma: PrismaService) {}
        // validate if module already exist
        async createModule(createModuleDto: CreateModuleDto, user) { 

        const existingModule = await this.prisma.module.findFirst({
            where: {
                name: createModuleDto.name,
            }
        });

        if (existingModule) {
            throw new BadRequestException('Module already exists!')
        }
    
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
    
        const moduleCreate = await this.prisma.module.create({
            data: {
                name: createModuleDto.name,
            }
        })
    
        return {
            status: 'success',
            message: `New module has been added to the system!`,
            created_by: {
                    id: requestUser.id,
                    name: userName,
                    position: userPos,
            },
            data: {
                module_id: moduleCreate.id,
                module_name: moduleCreate.name
            },
        };
    }
}
