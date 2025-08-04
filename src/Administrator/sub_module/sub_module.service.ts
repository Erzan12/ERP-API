import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateSubModuleDto } from './dto/create-sub-module.dto';
import { CreateSubModulePermissionDto } from '../sub_module/dto/create-sub-module-permission.dto';
import { PrismaService } from 'prisma/prisma.service';
import { UnassignSubmodulePermissionsDto } from './dto/unassign-submodule.dto';

@Injectable()
export class SubModuleService {
    constructor(private prisma: PrismaService) {}

    async createSubModule(createSubModuleDto: CreateSubModuleDto, user) {

        const findModule = await this.prisma.module.findUnique({
            where: { id: createSubModuleDto.module_id }
        })
        if(!findModule){
            throw new BadRequestException('Module not found!')
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

        const subModule = await this.prisma.subModule.create({
            data: {
                name: createSubModuleDto.name,
                module_id: createSubModuleDto.module_id
            },
            include: {
                module: true,
            }
        })

        return {
            status: 'success',
            message: `Sub Module ${subModule.name} for Module ${subModule.module.name} has been added`,
            created_by: {
                    id: requestUser.id,
                    name: userName,
                    position: userPos,
            },
            subModule_id: subModule.id,
            subModule_name: subModule.name
        }
    }

    async createSubModulePermissions(createSubModulePermissionsDto: CreateSubModulePermissionDto, user) {
        //shortcut the createSubModulePermissionsDto will not be called again upon create
        const { action, sub_module_id } = createSubModulePermissionsDto;

        const subModulePermissions = await this.prisma.subModule.findFirst({
            where: { id: createSubModulePermissionsDto.sub_module_id },
        })

        if (!subModulePermissions) {
            throw new BadRequestException('Sub Module does not exist!');
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

        const subModule = action.map(act =>({
            action: act,
            sub_module_id,
        }));

        const result = await this.prisma.subModulePermission.createMany({
            data: subModule,
            skipDuplicates: true, // optional, avoids duplicate entries
        });

        const moduleName = this.prisma.subModulePermission.findFirst({
            where: { id: subModulePermissions.module_id },
            include: {
                sub_module: {
                    include: {
                        module: true,
                    }
                }
            }
        })

        return {
            status: 'success',
            message: `Added permissions to Sub Module ${moduleName.sub_module.name}`,
            created_by: {
                    id: requestUser.id,
                    name: userName,
                    position: userPos,
            },
            data: {
                result
            }
        }   
    }

    async unassignSubmodulePermissions(unassignSubmodulePermissionsDto: UnassignSubmodulePermissionsDto, user) {
        const { sub_module_id, sub_module_permission_id } = unassignSubmodulePermissionsDto;

        const existingSubModule= await this.prisma.subModule.findFirst({
            where: { id: unassignSubmodulePermissionsDto.sub_module_id },
        });

        if (!existingSubModule){
            throw new BadRequestException('Selected Sub Module does not exist');
        }

        const existingSubModulePermission = await this.prisma.subModulePermission.findMany({
            where: { id: {
                in: unassignSubmodulePermissionsDto.sub_module_permission_id
            },
        },
        });

        if(!existingSubModulePermission){
            throw new BadRequestException('Selected Sub Module Permissions does not exist');
        };

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

        const unassignSubmodulePermissions = await this.prisma.subModulePermission.updateMany({
            where: {
                id: {
                    
                }
            },
            data: {
                stat: 1,
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
                unassignSubmodulePermissions
            }
        }
    }
}
