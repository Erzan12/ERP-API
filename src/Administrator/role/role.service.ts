import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { CreatePermissionTemplateDto } from '../../Manager/permission_template/dto/create-permission-template.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permisisons.dto';
import { UnassignRolePermissionDto } from './dto/unassign-role-permission.dto';
import { RequestUser } from 'src/Components/types/request-user.interface';
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class RoleService {
    constructor(private prisma:PrismaService) {}

    //Add Get Role -> to query the roles available
    async getAllRole(user: RequestUser) {
        const existingRoles = await this.prisma.role.findMany({
            where: { stat: 1},
            include: {
                role_permissions: true,
            }
        })

        if(existingRoles.length === 0 ) {
            throw new BadRequestException('No available or active roles exist!');
        }

        return {
            status: 'success',
            message: 'Here are the list of Roles',
            data: {
                existingRoles
            },
        };
    }

    async createRole(createRoleDto: CreateRoleDto, user: RequestUser) {
        const { name, description, stat } = createRoleDto;

        const role = await this.prisma.role.findUnique({
            where: { name: createRoleDto.name }
        })

        if(role){
            throw new BadRequestException('Role already exist! Try again')
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

        const createdRole = await this.prisma.role.create({
            data: {
                name,
                description,
                stat
            }
        })
    
        return {
            status: 'success',
            message: `Role have been successfully created!`,
            created_by: {
                id: requestUser.id,
                name: userName,
                position: userPos,
            },
            role_id: createdRole.id,
            role_name: createdRole.name
        }
    }

    //Add Get submodule permission -> to query the submodule permission table for available submolues with permission

    async createRolePermissions(createRolePermissionDto: CreateRolePermissionDto, user: RequestUser) {
        const { action, sub_module_id, role_id, department_id, position_id } = createRolePermissionDto;

        const existingRole = await this.prisma.role.findFirst({
            where: { id: role_id },
        });

        if (!existingRole) {
            throw new BadRequestException('Role not found or does not exist!');
        }

        const validSubModuleActions = await this.prisma.subModulePermission.findMany({
            where: { sub_module_id },
        });

        const validActions = validSubModuleActions.map(perm => perm.action);

        const invalidActions = action.filter(act => !validActions.includes(act));

        if (invalidActions.length > 0) {
            throw new BadRequestException(`Invalid action(s) for this sub module: ${invalidActions.join(', ')}`);
        }

        // to map the role_name and sub_module_permission_id so it wont return null in prisma studio
        const subModulePermissionMap = new Map(
            validSubModuleActions.map(perm => [perm.action, perm.id])
        );

        const createRolePermission = action.map(act => ({
            action: act,
            sub_module_id,
            role_id,
            role_name: existingRole.name,
            sub_module_permission_id: subModulePermissionMap.get(act)!, // ! to asset sub_mobule_permission id if it is always defined and cannot be null
            department_id,
            position_id,
        }));

        await this.prisma.rolePermission.createMany({
            data: createRolePermission,
            skipDuplicates: true,
        });

        const rolePermission = await this.prisma.role.findFirst({
            where: { id: role_id },
        })

        if(!rolePermission){
            throw new BadRequestException('Role Permission does not exist');
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
            message: `Added permissions to Role ${rolePermission?.name}`,
            created_by: {
                id: requestUser.id,
                name: userName,
                position: userPos,
            },
            role_id: rolePermission.id,
            role_name: rolePermission.name
        }
    }

    async updateRolePermissions(updateRolePermissionsDto: UpdateRolePermissionsDto, user) {
        const { role_id, action_updates = [] } = updateRolePermissionsDto;

        const existingRole = await this.prisma.role.findUnique({
            where: { id: role_id },
            include: {
            role_permissions: true,
            },
        });

        if (!existingRole) {
            throw new BadRequestException('Role does not exist!');
        }

        if(existingRole.role_permissions.length === 0) {
            throw new BadRequestException('This role has no existing role to update');
        }

        const toUpdate = existingRole.role_permissions.filter((perm) =>
            action_updates.some(update => update.currentAction === perm.action)
        );

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

        const results = await Promise.all(
            toUpdate.map((perm) => {
                const updateData = action_updates.find(u => u.currentAction === perm.action);
                
                if (!updateData) {
                    throw new ForbiddenException('Updating action failed')
                }

                return this.prisma.rolePermission.update({
                    where: { id: perm.id },
                    data: {
                        action: updateData.newAction,
                    },
                });
            })
        );
        return {
            status: 'success',
            message: 'Role Permission successfully updated',
            updated_by: {
                id: requestUser.id,
                name: userName,
                position: userPos,
            },
            updated_data: {
                results
            }
        }
    }

    // //unassing currently selected role permission
    // async unassignRolePermission(unassignRolePermissionDto: UnassignRolePermissionDto, user) {
    //     const { sub_module_id, role_permission_id } = unassignRolePermissionDto;

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

    //     const existingSubModule = await this.prisma.subModule.findFirst({
    //         where: { id: unassignRolePermissionDto.sub_module_id },
    //         include: {
    //             role_permission: {
    //                 include: {
    //                     role: true,
    //                 },
    //             },
    //         },
    //     });

    //     if(!existingSubModule){
    //         throw new BadRequestException('Selected Sub Module does not exist');
    //     }

    //     const existingRolePermission = await this.prisma.rolePermission.findMany({
    //         where: { id: {
    //             in: unassignRolePermissionDto.role_permission_id
    //             },
    //         },
    //     });

    //     if(!existingRolePermission){
    //         throw new BadRequestException('Selected Role Permission does not exist in this Sub Module');
    //     };
        
    //     const unassignedRolePermission = await this.prisma.rolePermission.updateMany({
    //         where: {
    //             id: {
    //                 in: unassignRolePermissionDto.role_permission_id,
    //             },
    //             sub_module_id: unassignRolePermissionDto.sub_module_id,
    //             status: true, // Only update active assignments
    //         },
    //         data: {
    //             status: false, // Mark as unassigned
    //         },
    //     });

    //     return {
    //         status: 'success',
    //         message: 'You have successfuly update a role permission',
    //         updated_by: {
    //                 id: requestUser.id,
    //                 name: userName,
    //                 position: userPos,
    //             },  
    //         data: {
    //             unassignedRolePermission
    //         },
    //     };
    // }
}