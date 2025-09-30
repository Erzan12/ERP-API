import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateSubModuleDto } from './dto/create-sub-module.dto';
import { AssignSubModulePermissionDto } from './dto/assign-sub-module-permission.dto';
import { PrismaService } from 'prisma/prisma.service';
import { UnassignSubmodulePermissionsDto } from './dto/unassign-submodule.dto';
import { RequestUser } from 'src/Components/types/request-user.interface';
import { AddSubModulePermissionDto } from './dto/add-sub-module-permission.dto';
import { UpdateSubModulePermisisonDto } from './dto/update-sub-module-permisison.dto';

@Injectable()
export class SubModuleService {
    constructor(private prisma: PrismaService) {}

    async listSubModule(user: RequestUser){
      
        const existingSubModules = await this.prisma.subModule.findMany({
            where: {stat:1},
            include: {
                module: true,
            },
        });
        
        if(existingSubModules.length === 0 ) {
            throw new BadRequestException('No available or active sub module exist!')
        }

        return {
            status: 'success',
            message: 'Here are the list of Sub Modules',
            data: {
                existingSubModules
            },
        };
    }

    async createSubModule(createSubModuleDto: CreateSubModuleDto, user: RequestUser) {

        const findModule = await this.prisma.module.findUnique({
            where: { id: createSubModuleDto.module_id }
        })
        if(!findModule){
            throw new BadRequestException('Module not found!')
        }

        const subModule = await this.prisma.subModule.create({
            data: {
                name: createSubModuleDto.name,
                module_id: createSubModuleDto.module_id
            },
            include: {
                module: true,
            }
        })

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

    //single permission creation
    // async addSubModulePerm(addSubModulePermissionDto: AddSubModulePermissionDto, user: RequestUser) {
    //     const createSMPerm = await this.prisma.addedSubModPermission.create({
    //         data: {
    //             action: addSubModulePermissionDto.action,
    //             stat: addSubModulePermissionDto.stat,
    //         }
    //     })

    //     const requestUser = await this.prisma.user.findUnique({
    //         where: { id: user.id },
    //         include:{
    //             employee: {
    //                 include: {
    //                     person: true,
    //                     position: true,
    //                 }
    //             }
    //         }
    //     })

    //     if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
    //         throw new BadRequestException(`User does not exist.`);
    //     }

    //     const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    //     const userPos = requestUser.employee.position.name;

    //     return {
    //         status: 'success',
    //         message: `Sub Module permission ${createSMPerm.action} has been added`,
    //         created_by: {
    //                 id: requestUser.id,
    //                 name: userName,
    //                 position: userPos,
    //         },
    //         subModule_id: createSMPerm.id,
    //         subModule_name: createSMPerm.action
    //     }

    // }

    //multiple permissioin creation
    async addSubModulePerm(addSubModulePermissionDto: AddSubModulePermissionDto,user: RequestUser) {
        const { action, stat = 1 } = addSubModulePermissionDto;

        const permissionsToCreate = action.map((act) => ({
            action: act,
            stat,
        }));

        const createSMPerms = await this.prisma.addedSubModPermission.createMany({
            data: permissionsToCreate,
            skipDuplicates: true, // Optional: skips duplicate "action" entries
        });

        const requestUser = await this.prisma.user.findUnique({
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

        if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
            throw new BadRequestException(`User does not exist.`);
        }

        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPos = requestUser.employee.position.name;

        return {
            status: 'success',
            message: `Added ${createSMPerms.count} new permission(s).`,
            created_by: {
            id: requestUser.id,
            name: userName,
            position: userPos,
            },
            data: {
            count: createSMPerms.count,
            actions_added: action,
            },
        };
    }

    async updateSubModulePerm(updateSubModulePermissionDto: UpdateSubModulePermisisonDto, user: RequestUser, id) {
        const { sub_module_permission_id, action, stat} = updateSubModulePermissionDto;

        const existingSubModulePermission = await this.prisma.addedSubModPermission.findFirst({
            where: { id: updateSubModulePermissionDto.sub_module_permission_id }
        })

        if (!existingSubModulePermission) {
            throw new NotFoundException('Sub Module permission does not exist!');
        }

        // if (existingSubModulePermission.stat === 0) {
        //     throw new ForbiddenException(`${existingSubModulePermission.action} action status is inactive`);
        // }

        const updateSubModulePermission = await this.prisma.addedSubModPermission.update({
            where: { id: updateSubModulePermissionDto.sub_module_permission_id},
            data: {
                id: existingSubModulePermission.id,
                action,
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
            message: `${existingSubModulePermission.action} action has been updated successfully!`,
            updated_by: {
                id: requestUser.id,
                name: userName,
                position: userPos,
            },
            data: {
                updateSubModulePermission,
            },
        };
    }

    // async assignSubModulePermissions(assignSubModPermsDto: AssignSubModulePermissionDto, user) {
    //     //shortcut the createSubModulePermissionsDto will not be called again upon create
    //     const { action, sub_module_id } = assignSubModPermsDto;

    //     const subModulePermissions = await this.prisma.subModule.findFirst({
    //         where: { id: assignSubModPermsDto.sub_module_id },
    //     })

    //     if (!subModulePermissions) {
    //         throw new NotFoundException('Sub Module does not exist!');
    //     }

    //     const requestUser = await this.prisma.user.findUnique({
    //         where: { id: user.id },
    //         include:{
    //             employee: {
    //                 include: {
    //                     person: true,
    //                     position: true,
    //                 }
    //             }
    //         }
    //     })

    //     if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
    //         throw new BadRequestException(`User does not exist.`);
    //     }

    //     const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    //     const userPos = requestUser.employee.position.name;

    //     const subModule = action.map(act =>({
    //         action: act,
    //         sub_module_id,
    //     }));

    //     const result = await this.prisma.subModulePermission.createMany({
    //         data: subModule,
    //         skipDuplicates: true, // optional, avoids duplicate entries
    //     });

    //     const moduleName = this.prisma.subModulePermission.findFirst({
    //         where: { id: subModulePermissions.module_id },
    //         include: {
    //             sub_module: {
    //                 include: {
    //                     module: true,
    //                 }
    //             }
    //         }
    //     })

    //     return {
    //         status: 'success',
    //         message: `Added permissions to Sub Module ${moduleName.sub_module.name}`,
    //         created_by: {
    //                 id: requestUser.id,
    //                 name: userName,
    //                 position: userPos,
    //         },
    //         data: {
    //             result
    //         }
    //     }   
    // }
    async assignSubModulePermissions(assignSubModPermsDto: AssignSubModulePermissionDto, user) {
        const { action, sub_module_id } = assignSubModPermsDto;

        const subModule = await this.prisma.subModule.findFirst({
            where: { id: sub_module_id },
            include: {
                module: true,
            }
        });

        if (!subModule) {
            throw new NotFoundException('Sub Module does not exist!');
        }

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

        if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
            throw new BadRequestException(`User does not exist.`);
        }

        const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
        const userPos = requestUser.employee.position.name;

        // ✅ Fetch existing permission definitions from AddedSubModPermission
        const availablePermissions = await this.prisma.addedSubModPermission.findMany({
            where: {
                action: {
                    in: action,
                },
                stat: 1,
            },
        });

        if (availablePermissions.length === 0) {
            throw new BadRequestException('No matching active permissions found.');
        }

        // ✅ Create SubModulePermission entries using existing permission IDs
        const subModulePermissionsToCreate = availablePermissions.map(perm => ({
            sub_module_id,
            added_sub_mod_permission_id: perm.id,
            action: perm.action, // optional: only if you're storing this string too
        }));

        const result = await this.prisma.subModulePermission.createMany({
            data: subModulePermissionsToCreate,
            skipDuplicates: true,
        });

        return {
            status: 'success',
            message: `Added permissions to Sub Module ${subModule.name}`,
            created_by: {
                id: requestUser.id,
                name: userName,
                position: userPos,
            },
            data: {
                result,
            }
        };
    }


    // async unassignSubmodulePermissions(unassignSubmodulePermissionsDto: UnassignSubmodulePermissionsDto, user) {
    //     const { sub_module_id, sub_module_permission_id } = unassignSubmodulePermissionsDto;

    //     const existingSubModule= await this.prisma.subModule.findFirst({
    //         where: { id: unassignSubmodulePermissionsDto.sub_module_id },
    //     });

    //     if (!existingSubModule){
    //         throw new BadRequestException('Selected Sub Module does not exist');
    //     }

    //     const existingSubModulePermission = await this.prisma.subModulePermission.findMany({
    //         where: { id: {
    //             in: unassignSubmodulePermissionsDto.sub_module_permission_id
    //         },
    //     },
    //     });

    //     if(!existingSubModulePermission){
    //         throw new BadRequestException('Selected Sub Module Permissions does not exist');
    //     };

    //     const requestUser = await this.prisma.user.findUnique({
    //         where: { id: user.id },
    //         include:{
    //             employee: {
    //                 include: {
    //                     person: true,
    //                     position: true,
    //                 }
    //             }
    //         }
    //     })

    //     if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
    //         throw new BadRequestException(`User does not exist.`);
    //     }

    //     const userName = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
    //     const userPos = requestUser.employee.position.name;

    //     const unassignSubmodulePermissions = await this.prisma.subModulePermission.updateMany({
    //         where: {
    //             id: {
                    
    //             }
    //         },
    //         data: {
    //             stat: 1,
    //         }
    //     })

    //     return {
    //         status: 'success',
    //         message: `New module has been added to the system!`,
    //         created_by: {
    //                 id: requestUser.id,
    //                 name: userName,
    //                 position: userPos,
    //         },
    //         data: {
    //             unassignSubmodulePermissions
    //         }
    //     }
    // }
}
