import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { CreatePermissionTemplateDto } from './dto/create-permission-template.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permisisons.dto';
import { AddPermissionToExistingRoleDto } from './dto/add-permission-template.dto';
import { AddPermissionToExistingUserDto } from './dto/add-permission-template.dto';
import { UnassignRolePermissionDto } from './dto/unassign-role-permission.dto';
import { SessionUser } from '../../Components/decorators/session-user.decorator';

@Injectable()
export class RoleService {
    constructor(private prisma:PrismaService) {}

    async createRole(createRoleDto: CreateRoleDto, user) {
        const { name, description } = createRoleDto;

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

    async createRolePermissions(createRolePermissionDto: CreateRolePermissionDto, user) {
        const { action, sub_module_id, module_id, role_id } = createRolePermissionDto;

        const rolePermissions = await this.prisma.role.findFirst({
            where: { id: createRolePermissionDto.role_id },
        })

        if(!rolePermissions) {
            throw new BadRequestException('Role not found or does not exist!')
        }

        const moduleID = await this.prisma.module.findFirst({
            where: { id: module_id},
        });

        if(!moduleID) {
            throw new BadRequestException('Module not found or does not exist!')
        }

        const subID = await this.prisma.subModule.findFirst({
            where: { id: sub_module_id}
        })

        if(!subID) {
            throw new BadRequestException('Sub Module not found or does not exist!')
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

        const createRolePermission = action.map(act =>({
            action: act,
            sub_module_id,
            module_id,
            role_id,
        }))

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

    async createPermissionTemplate(createPermissionTemplateDto: CreatePermissionTemplateDto, user) {
        console.log('DTO Received:', createPermissionTemplateDto);

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

        const { name, department_ids, company_id, rolePermissionIds } = createPermissionTemplateDto;

        // Flatten the actions so each action is its own object
        const flattenedRolePermissionIds = rolePermissionIds.flatMap(({ role_id, sub_module_id, module_id, action }) =>
            action.map((act) => ({
                role_id,
                sub_module_id,
                module_id,
                action: act,
            }))
        );


        const uniqueRoleIds = [...new Set(flattenedRolePermissionIds.map(rp => rp.role_id))];
        const uniqueModuleIds = [...new Set(flattenedRolePermissionIds.map(rp => rp.module_id))];

        const createPermTemplate = await this.prisma.permissionTemplate.create({
            data: {
                name,
                    company: {
                    connect: { id: company_id },
                },
                departments: {
                    create: department_ids.map(department_id => ({
                    department: { connect: { id: department_id } },
                })),
                },
                role: {
                    connect: uniqueRoleIds.map(id => ({ id })),
                },
                module: {
                    connect: uniqueModuleIds.map(id => ({ id })),
                },
                role_permissions: {
                create: flattenedRolePermissionIds.map(({ role_id, sub_module_id, module_id, action }) => ({
                    role_permission: {
                    connect: {
                        role_id_sub_module_id_module_id_action: {
                        role_id,
                        sub_module_id,
                        module_id,
                        action,
                        }
                    }
                    }
                })),
                },
            },
            include: {
                company: true,
                role_permissions: true,
                role: true,
                module: true,
            },
        });

        return {
            status: 'success',
            message: `New Permission Template has been added to the system!`,
            created_by: {
                    id: requestUser.id,
                    name: userName,
                    position: userPos,
                },
            permission_template_id: createPermTemplate.id,
            permission_template_name: createPermTemplate.name
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

    //unassing currently selected role permission
    async unassignRolePermission(unassignRolePermissionDto: UnassignRolePermissionDto, user) {
        const { sub_module_id, role_permission_id } = unassignRolePermissionDto;

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

        const existingSubModule = await this.prisma.subModule.findFirst({
            where: { id: unassignRolePermissionDto.sub_module_id },
            include: {
                role_permission: {
                    include: {
                        role: true,
                    },
                },
            },
        });

        if(!existingSubModule){
            throw new BadRequestException('Selected Sub Module does not exist');
        }

        const existingRolePermission = await this.prisma.rolePermission.findMany({
            where: { id: {
                in: unassignRolePermissionDto.role_permission_id
                },
            },
        });

        if(!existingRolePermission){
            throw new BadRequestException('Selected Role Permission does not exist in this Sub Module');
        };
        
        const unassignedRolePermission = await this.prisma.rolePermission.updateMany({
            where: {
                id: {
                    in: unassignRolePermissionDto.role_permission_id,
                },
                sub_module_id: unassignRolePermissionDto.sub_module_id,
                status: true, // Only update active assignments
            },
            data: {
                status: false, // Mark as unassigned
            },
        });

        return {
            status: 'success',
            message: 'You have successfuly update a role permission',
            updated_by: {
                    id: requestUser.id,
                    name: userName,
                    position: userPos,
                },  
            data: {
                unassignedRolePermission
            },
        };
    }

    //assigning permission template to user who doesnt have a permission yet
    async assignPermissionTemplateByRole(addPermissionTemplate:AddPermissionToExistingRoleDto, user) {
        const { role_ids, permission_template_id } = addPermissionTemplate;

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

        if (!role_ids || !permission_template_id) {
            throw new BadRequestException('Missing role_id or permission_template_id');
        }

        // 1. Fetch users with their permission_templates
        const existingUsers = await this.prisma.user.findMany({
        where: {
            user_roles: {
            some: {
                role_id: {
                in: addPermissionTemplate.role_ids, // ✅ filter users who have at least one of the given role_ids
                },
            },
            },
        },
        include: {
            permission_templates: true,
        },
        });

        console.log('Matching users:', existingUsers);
        
        console.log('Existing Users:', existingUsers);

        if (existingUsers.length === 0) {
                throw new BadRequestException('No users found for this role');
        }

        const usersAlreadyAssigned = existingUsers.filter(role =>
            role.permission_templates.some(pt => pt.id === permission_template_id)
        );

        if (usersAlreadyAssigned.length > 0) {
            const usernames = usersAlreadyAssigned.map(u => u.username).join(', ');
            throw new BadRequestException(`These users already have this template: ${usernames}`);
        }

        const existingPermissionTemplate = await this.prisma.permissionTemplate.findUnique({
            where: {id: permission_template_id},
        })

        if(!existingPermissionTemplate) {
            throw new BadRequestException('Permission Template not found')
        }
        //if data is existing in db but want to assign a role or permission just update not create
        // ✅ Step 1: Assign template to role (many-to-many)
        // await Promise.all(
        //     addPermissionTemplate.role_ids.map(roleId =>
        //         this.prisma.role.update({
        //             where: { id: roleId },
        //             data: {
        //                 permission_template: {
        //                 connect: { id: permission_template_id },
        //                 },
        //             },
        //         }),
        //     ),
        // );
        const roleUpdates = role_ids.map(roleId =>
            this.prisma.role.update({
                where: { id: roleId },
                data: {
                    permission_template: {
                        connect: { id: permission_template_id },
                    },
                },
            })
        );

        // 2. Filter out users who already have this template
        const usersToUpdate = existingUsers.filter(user =>
            !user.permission_templates.some(pt => pt.id === permission_template_id)
        );

        // 3. Add the template to those users
        // for (const user of usersToUpdate) {
        //     await this.prisma.user.update({
        //         where: { id: user.id },
        //         data: {
        //             permission_templates: {
        //                 connect: { id: permission_template_id },
        //             },
        //         },
        //     });
        // }
        const userUpdates = usersToUpdate.map(user =>
            this.prisma.user.update({
                where: { id: user.id },
                data: {
                    permission_templates: {
                        connect: { id: permission_template_id },
                    },
                },
            })
        );

        //rollback if roleUpdates fail so no update will push in db
        await this.prisma.$transaction([
            ...roleUpdates,
            ...userUpdates,
        ]);

        

        const updatedTemplate = await this.prisma.permissionTemplate.findUnique({
            where: { id: permission_template_id },
            include: { user: true }, // should show the users you just updated
        });

        return {
            status: 'success',
            message: `Assigned permission template to role and all users with role: ${addPermissionTemplate.role_ids}`,
            created_by: {
                    id: requestUser.id,
                    name: userName,
                    position: userPos,
            },
            updated_data: {
                updatedTemplate
            }    
        };
    }

    // async assignPermissionTemplateByUser(addPermissionTemplate: AddPermissionToExistingUserDto) {
    //     const { user_ids, permission_template_id } = addPermissionTemplate;

    //     if (!user_ids || !permission_template_id) {
    //         throw new BadRequestException('Missing user_id or permission_template_id');
    //     }

    //     // fetch users with their permission_templates
    //     const existingUsers = await this.prisma.user.findMany({
    //         where: {
    //             id: {
    //                 in: addPermissionTemplate.user_ids
    //             }
    //         },
    //         include: {
    //             permission_templates: true,
    //         },
    //     });

    //     console.log('Matching users:', existingUsers);
        
    //     console.log('Existing Users:', existingUsers);

    //     if (existingUsers.length === 0) {
    //         throw new BadRequestException('No users found for this template');
    //     }

    //     const usersAlreadyAssigned = existingUsers.filter(user =>
    //         user.permission_templates.some(pt => pt.id === permission_template_id)
    //     );

    //     if (usersAlreadyAssigned.length > 0) {
    //         const usernames = usersAlreadyAssigned.map(u => u.username).join(', ');
    //         throw new BadRequestException(`This users already have this template: ${usernames}`);
    //     }

    //     const existingPermissionTemplate = await this.prisma.permissionTemplate.findUnique({
    //         where: {id: addPermissionTemplate.permission_template_id},
    //     });

    //     if(!existingPermissionTemplate) {
    //         throw new BadRequestException('Permission Template not found')
    //     }

    //     const permissionTemplateWithRelations = await this.prisma.permissionTemplate.findUnique({
    //         where: { id: permission_template_id },
    //         include: {
    //             role: true,     // This must be plural or handled correctly
    //             module: true,
    //         },
    //     });

    //     if (!permissionTemplateWithRelations || !permissionTemplateWithRelations.role || !permissionTemplateWithRelations.module) {
    //     throw new BadRequestException('Permission Template is missing related role or module');
    //     }

    //     const role = permissionTemplateWithRelations.role?.[0];
    //     const module = permissionTemplateWithRelations.module?.[0];

    //     if (!role || !module) {
    //         throw new BadRequestException('Permission Template must be associated with at least one role and one module.');
    //     }

    //     // Now it's safe to access .id
    //     console.log('role.id:', role.id);
    //     console.log('module.id:', module.id);

    //     for (const user_id of user_ids) {

    //         // Optional: Check if user already has this role+module
    //         const existingUserRole = await this.prisma.userRole.findFirst({
    //             where: {
    //                 user_id,
    //                 role_id: role.id,
    //                 module_id: module.id,
    //             },
    //         });

    //         if (!existingUserRole) {
    //             await this.prisma.userRole.create({
    //                 data: {
    //                     user: { connect: { id: user_id } },
    //                     role: { connect: { id: role.id } },
    //                     module: { connect: { id: module.id } },
    //                 },
    //             });
    //         }
    //     }

    //     // Fetch permissions linked to this template
    //     const templatePermissions = await this.prisma.permissionTemplateRolePermission.findMany({
    //         where: {
    //             permission_template_id,
    //         },
    //         include: {
    //             role_permission: true,
    //         },
    //     });

    //     for (const user_id of user_ids) {
    //         // Check if UserRole exists or was just created
    //         const userRole = await this.prisma.userRole.findFirst({
    //             where: {
    //                 user_id,
    //                 role_id: role.id,
    //                 module_id: module.id,
    //             },
    //         });

    //         if (userRole) {
    //             const userPermissionsData = templatePermissions.map(tp => ({
    //                 user_id,
    //                 user_role_id: userRole.id,
    //                 user_role_permission: tp.role_permission.action,
    //                 role_permission_id: tp.role_permission_id,
    //             }));

    //             await this.prisma.userPermission.createMany({
    //                 data: userPermissionsData,
    //                 skipDuplicates: true, // add this avoid Duplicate Permissions
    //             });
    //         }
    //     }

    //     // checks the module to update in user 
    //     const module_id = module.id;

    //     if (!module_id) {
    //     throw new BadRequestException('Module ID is missing from the permission template');
    //     }

    //     // checks the role to update in user 
    //     const role_id = role.id;

    //     if (!role_id) {
    //     throw new BadRequestException('Module ID is missing from the permission template');
    //     }

    //     // this part is cleaner and avoids unnecessary writes
    //     const usersToUpdate = existingUsers.filter(user =>
    //         !user.permission_templates.some(pt => pt.id === permission_template_id),
    //     );

    //     await Promise.all(
    //         usersToUpdate.map(user =>
    //             this.prisma.user.update({
    //             where: { id: user.id },
    //             data: {
    //                 permission_templates: {
    //                 connect: { id: permission_template_id },
    //                 },
    //                 roles: {
    //                     connect: { id: role_id }
    //                 },
    //                 modules: {
    //                     connect: { id: module_id },
    //                 }
    //             },
    //             })
    //         )
    //     );

    //     return {
    //         status: 'success',
    //         message: `Assigned permission template to user: ${addPermissionTemplate.user_ids}`,
    //         update_data: {
    //             existingUsers
    //         },
    //     };
    // }
    // async assignPermissionTemplateByUser(addPermissionTemplate: AddPermissionToExistingUserDto) {
    //     const { user_ids, permission_template_id } = addPermissionTemplate;

    //     if (!user_ids || !permission_template_id) {
    //         throw new BadRequestException('Missing user_ids or permission_template_id');
    //     }

    //     // Fetch users with their current permission_templates
    //     const existingUsers = await this.prisma.user.findMany({
    //         where: {
    //         id: { in: user_ids },
    //         },
    //         include: {
    //         permission_templates: true,
    //         },
    //     });

    //     if (existingUsers.length === 0) {
    //         throw new BadRequestException('No users found for the provided user_ids');
    //     }

    //     // Prevent assigning duplicate templates
    //     const usersAlreadyAssigned = existingUsers.filter(user =>
    //         user.permission_templates.some(pt => pt.id === permission_template_id),
    //     );

    //     if (usersAlreadyAssigned.length > 0) {
    //         const usernames = usersAlreadyAssigned.map(u => u.username).join(', ');
    //         throw new BadRequestException(`These users already have this template: ${usernames}`);
    //     }

    //     const permissionTemplate = await this.prisma.permissionTemplate.findUnique({
    //         where: { id: permission_template_id },
    //         include: {
    //         role: true,
    //         module: true,
    //         },
    //     });

    //     if (!permissionTemplate || permissionTemplate.role.length === 0 || permissionTemplate.module.length === 0) {
    //         throw new BadRequestException('Permission Template must be associated with at least one role and one module.');
    //     }

    //     // Fetch templatePermissions once (outside the loop)
    //     const templatePermissions = await this.prisma.permissionTemplateRolePermission.findMany({
    //         where: {
    //         permission_template_id,
    //         },
    //         include: {
    //         role_permission: true,
    //         },
    //     });

    //     const userRoleCreates = [];
    //     const userPermissionCreates = [];
    //     const userTemplateConnects = [];
    //     const userModuleConnects = [];
    //     const userRoleConnects = [];

    //     for (const user_id of user_ids) {
    //         for (const role of permissionTemplate.role) {
    //         for (const module of permissionTemplate.module) {
    //             // 1. Create or ensure user-role-module association
    //             const userRoleUpsert = this.prisma.userRole.upsert({
    //             where: {
    //                 user_id_role_id_module_id: {
    //                 user_id,
    //                 role_id: role.id,
    //                 module_id: module.id,
    //                 },
    //             },
    //             create: {
    //                 user_id,
    //                 role_id: role.id,
    //                 module_id: module.id,
    //             },
    //             update: {},
    //             });

    //             userRoleCreates.push(userRoleUpsert);

    //             // 2. Collect user_permission data based on role/module match
    //             const matchedTemplatePermissions = templatePermissions.filter(tp =>
    //             tp.role_permission.role_id === role.id &&
    //             tp.role_permission.module_id === module.id,
    //             );

    //             const userPermissionsData = matchedTemplatePermissions.map(tp => ({
    //             user_id,
    //             user_role_permission: tp.role_permission.action,
    //             user_role_id: undefined, // placeholder (will be updated below)
    //             role_permission_id: tp.role_permission_id,
    //             }));

    //             // Store with context so we can update user_role_id later
    //             userPermissionCreates.push({ user_id, role_id: role.id, module_id: module.id, permissions: userPermissionsData });

    //             // For clean-up later (connecting template, roles, modules)
    //             userTemplateConnects.push(
    //             this.prisma.user.update({
    //                 where: { id: user_id },
    //                 data: {
    //                 permission_templates: {
    //                     connect: { id: permission_template_id },
    //                 },
    //                 },
    //             })
    //             );
    //             userModuleConnects.push(
    //             this.prisma.user.update({
    //                 where: { id: user_id },
    //                 data: {
    //                 modules: {
    //                     connect: { id: module.id },
    //                 },
    //                 },
    //             })
    //             );
    //             userRoleConnects.push(
    //             this.prisma.user.update({
    //                 where: { id: user_id },
    //                 data: {
    //                 roles: {
    //                     connect: { id: role.id },
    //                 },
    //                 },
    //             })
    //             );
    //         }
    //         }
    //     }

    //     // Run userRole upserts first to ensure IDs are generated
    //     const upsertedUserRoles = await this.prisma.$transaction(userRoleCreates);

    //     // Now map user_role_ids back into permission createMany data
    //     const permissionCreateManyOps = userPermissionCreates.map(({ user_id, role_id, module_id, permissions }) => {
    //         const matchedUserRole = upsertedUserRoles.find(ur =>
    //         ur.user_id === user_id && ur.role_id === role_id && ur.module_id === module_id
    //         );

    //         if (!matchedUserRole) return null;

    //         const completedPermissions = permissions.map(p => ({
    //         ...p,
    //         user_role_id: matchedUserRole.id,
    //         }));

    //         return this.prisma.userPermission.createMany({
    //         data: completedPermissions,
    //         skipDuplicates: true,
    //         });
    //     }).filter(Boolean); // remove nulls if any

    // // Combine all updates into one transaction
    //     await this.prisma.$transaction([
    //         ...permissionCreateManyOps,
    //         ...userTemplateConnects,
    //         ...userModuleConnects,
    //         ...userRoleConnects,
    //     ]);

    //     return {
    //         status: 'success',
    //         message: `Assigned permission template to ${user_ids.length} user(s)`,
    //         template_id: permission_template_id,
    //         affected_user_ids: user_ids,
    //     };
    // }

    async assignPermissionTemplateByUser(addPermissionTemplate: AddPermissionToExistingUserDto) {
        const { user_ids, permission_template_id } = addPermissionTemplate;

        if (!user_ids || !permission_template_id) {
            throw new BadRequestException('Missing user_id or permission_template_id');
        }

        const existingUsers = await this.prisma.user.findMany({
            where: { id: { in: user_ids } },
            include: { permission_templates: true },
        });

        if (existingUsers.length === 0) {
            throw new BadRequestException('No users found for this template');
        }

        const usersAlreadyAssigned = existingUsers.filter(user =>
            user.permission_templates.some(pt => pt.id === permission_template_id)
        );

        if (usersAlreadyAssigned.length > 0) {
            const usernames = usersAlreadyAssigned.map(u => u.username).join(', ');
            throw new BadRequestException(`These users already have this template: ${usernames}`);
        }

        const permissionTemplate = await this.prisma.permissionTemplate.findUnique({
            where: { id: permission_template_id },
            include: {
                role: true,
                module: true,
            },
        });

        if (!permissionTemplate || !permissionTemplate.role.length || !permissionTemplate.module.length) {
            throw new BadRequestException('Permission Template must have at least one role and module');
        }

        const templatePermissions = await this.prisma.permissionTemplateRolePermission.findMany({
            where: { permission_template_id },
            include: { role_permission: true },
        });

        const userRoleCreates: Prisma.PrismaPromise<any>[] = [];
        const userPermissionCreates: {
            user_id: number;
            role_id: number;
            module_id: number;
            permissions: {
                user_id: number;
                user_role_permission: string;
                user_role_id: number | undefined;
                role_permission_id: number;
            }[];
        }[] = [];

        const userTemplateConnects: Prisma.PrismaPromise<any>[] = [];
        const userModuleConnects: Prisma.PrismaPromise<any>[] = [];
        const userRoleConnects: Prisma.PrismaPromise<any>[] = [];

        for (const user_id of user_ids) {
            for (const role of permissionTemplate.role) {
                for (const module of permissionTemplate.module) {
                    userRoleCreates.push(
                        this.prisma.userRole.upsert({
                            where: {
                                user_id_role_id_module_id: {
                                    user_id,
                                    role_id: role.id,
                                    module_id: module.id,
                                },
                            },
                            create: {
                                user_id,
                                role_id: role.id,
                                module_id: module.id,
                            },
                            update: {},
                        })
                    );

                    const userPermissionsData = templatePermissions.map(tp => ({
                        user_id,
                        user_role_permission: tp.role_permission.action,
                        user_role_id: undefined, // Will be replaced after upserts
                        role_permission_id: tp.role_permission_id,
                    }));

                    userPermissionCreates.push({
                        user_id,
                        role_id: role.id,
                        module_id: module.id,
                        permissions: userPermissionsData,
                    });

                    // Connect user to template/role/module
                    userTemplateConnects.push(
                        this.prisma.user.update({
                            where: { id: user_id },
                            data: {
                                permission_templates: {
                                    connect: { id: permission_template_id },
                                },
                            },
                        })
                    );

                    userModuleConnects.push(
                        this.prisma.user.update({
                            where: { id: user_id },
                            data: {
                                modules: {
                                    connect: { id: module.id },
                                },
                            },
                        })
                    );

                    userRoleConnects.push(
                        this.prisma.user.update({
                            where: { id: user_id },
                            data: {
                                roles: {
                                    connect: { id: role.id },
                                },
                            },
                        })
                    );
                }
            }
        }

        // Run the upserts for UserRole
        const upsertedUserRoles = await this.prisma.$transaction(userRoleCreates);

        // Map permissions with their proper user_role_id after upserts
        const permissionCreateManyOps = userPermissionCreates
            .map(({ user_id, role_id, module_id, permissions }) => {
                const matchedUserRole = upsertedUserRoles.find(
                    ur => ur.user_id === user_id && ur.role_id === role_id && ur.module_id === module_id
                );

                if (!matchedUserRole) return null;

                const completedPermissions = permissions.map(p => ({
                    ...p,
                    user_role_id: matchedUserRole.id,
                }));

                return this.prisma.userPermission.createMany({
                    data: completedPermissions,
                    skipDuplicates: true,
                });
            })
            .filter(Boolean) as Prisma.PrismaPromise<any>[]; // Remove nulls

        // Final transaction: assign roles/modules/template + permissions
        await this.prisma.$transaction([
            ...permissionCreateManyOps,
            ...userTemplateConnects,
            ...userModuleConnects,
            ...userRoleConnects,
        ]);

        return {
            status: 'success',
            message: `Assigned permission template to ${user_ids.length} user(s)`,
            template_id: permission_template_id,
            affected_user_ids: user_ids,
        };
    }
}
