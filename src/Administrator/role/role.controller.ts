import { Controller, Get, Post, Body, Patch, Param, Query, ParseIntPipe } from '@nestjs/common';
import { RoleService } from './role.service';
import { Can } from '../../Components/decorators/can.decorator';
import { SessionUser } from '../../Components/decorators/session-user.decorator';
import { RequestUser } from '../../Components/types/request-user.interface';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permisisons.dto';
import { CreatePermissionTemplateDto } from './dto/create-permission-template.dto';
import { AddPermissionToExistingRoleDto, AddPermissionToExistingUserDto } from './dto/add-permission-template.dto';
import { ACTION_CREATE, MODULE_ADMIN, ACTION_UPDATE } from '../../Components/decorators/ability';
import { SM_ADMIN } from '../../Components/constants/core-constants';
import { UnassignRolePermissionDto } from './dto/unassign-role-permission.dto';
import { PrismaService } from 'prisma/prisma.service';

@Controller('role')
export class RoleController {

    constructor(private roleService: RoleService, private prisma: PrismaService) {}

    //create role
    @Post()                                                                          
    @Can({
        action: ACTION_CREATE,  // the action of the subtion will be match with the current user role permission
        subject: SM_ADMIN.CORE_MODULE_ROLE, // SUBMODULE of Module Admin
        module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    async createRole(
        @Body() createRoleDto: CreateRoleDto,
        @SessionUser() user: RequestUser 
    ) {
        return this.roleService.createRole(createRoleDto, user)
    }

    //add role permisison
    @Post('role_permission')                                                            
    @Can({
        action: ACTION_CREATE,
        subject: SM_ADMIN.CORE_MODULE_ROLE,
        module: [MODULE_ADMIN]
    })       
    async createRolePermission(
        @Body() createRolePermissionDto: CreateRolePermissionDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.roleService.createRolePermissions(createRolePermissionDto, user)
    }

    //update role permission
    @Patch('update_role_permission')
    @Can({
        action: ACTION_UPDATE,
        subject: SM_ADMIN.CORE_MODULE_ROLE,
        module: [MODULE_ADMIN] 
    })
    async updateRolePermissions( 
        @Body() updateRolePermissionsDto: UpdateRolePermissionsDto,
        @SessionUser() user: RequestUser,                                                       
     ) {
        return this.roleService.updateRolePermissions(updateRolePermissionsDto, user);
    }

    //unassign role permission
    @Patch('unassign_role_permission')
    @Can({
        action: ACTION_UPDATE,
        subject: SM_ADMIN.CORE_MODULE_ROLE,
        module: [MODULE_ADMIN]
    })
    async unassingRolePermission(
        @Body() unassingRolePermissionDto: UnassignRolePermissionDto,
        @SessionUser() user: RequestUser,
    ) {
        console.log('Current User:', user)
        return this.roleService.unassignRolePermission(unassingRolePermissionDto, user);
    }

    //filter/show active or inactive roles permission for a submodule
    @Get(':subModuleId/permissions')
    async getPermissions(
        @Param('subModuleId', ParseIntPipe) subModuleId: number,
        @Query('status') status?: string, // optional query param
    ) {
    const isActive = status === 'true' ? true : status === 'false' ? false : undefined;

        return await this.prisma.rolePermission.findMany({
            where: {
            sub_module_id: subModuleId,
            ...(isActive !== undefined && { status: isActive }), // conditionally add `status`
            },
        });
    }

    @Post('permission_templates')
    @Can({
        action: ACTION_CREATE,
        subject: SM_ADMIN.CORE_MODULE_ROLE,
        module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    async create(
        @Body() dto: CreatePermissionTemplateDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.roleService.createPermissionTemplate(dto,user);
    }

    @Patch('assign_permission_template/roles')
    @Can({
        action: ACTION_UPDATE,  // the action of the subtion will be match with the current user role permission
        subject: SM_ADMIN.CORE_MODULE_ROLE, // SUBMODULE of Module Admin
        module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
    })
    async assignPermissionTemplateByRole( 
        @Body() addPermissionTemplateDto: AddPermissionToExistingRoleDto,   
        @SessionUser() user: RequestUser,                                                      // to make enum decorator
     ) {
        return this.roleService.assignPermissionTemplateByRole(addPermissionTemplateDto,user);
    }   

    @Patch('assign_permission_template/user')
    @Can({
        action: ACTION_UPDATE,
        subject: SM_ADMIN.CORE_MODULE_MODULE,
        module: [MODULE_ADMIN]
    })
    async assignPermissionTemplateByUser(
        @Body() addPermissionTemplateDto: AddPermissionToExistingUserDto,
    ) {
        return this.roleService.assignPermissionTemplateByUser(addPermissionTemplateDto);
    }
}
