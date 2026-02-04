import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { Can } from '../../../components/decorators/can.decorator';
import { SessionUser } from '../../../components/decorators/session-user.decorator';
import { RequestUser } from '../../../components/types/request-user.interface';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permisisons.dto';
import { CreatePermissionTemplateDto } from '../../manager/permission_template/dto/create-permission-template.dto';
import { UnassignRolePermissionDto } from './dto/unassign-role-permission.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiGetResponse,
  ApiPatchResponse,
  ApiPostResponse,
} from 'src/components/helpers/swagger-response.helper';
import {
  ACTION_CREATE,
  ACTION_READ,
  ACTION_UPDATE,
  SYSTEM_MANAGEMENT,
} from 'src/components/constants/ability.constant';
import { PrismaService } from 'src/config/prisma/prisma.service';

@ApiBearerAuth('access-token')
@ApiTags('System Management')
@Controller('administrator')
export class RoleController {
  constructor(
    private roleService: RoleService,
    private prisma: PrismaService,
  ) {}

  //get all available roles
  @Get('roles')
  @ApiOperation({ summary: 'Get all Roles' })
  @ApiGetResponse('Here are the list of Roles')
  @Can({ action: ACTION_READ, subject: SYSTEM_MANAGEMENT }) // sub_module is the subject and action is the permission, action is read,update,delete,create and submodule is Mastertables, Dashboard etc
  getAllRole(@SessionUser() user: RequestUser) {
    return this.roleService.getAllRole(user);
  }

  //create role
  @Post('role')
  @ApiOperation({ summary: 'Create new role' })
  @ApiPostResponse('Role created successfully')
  @Can({ action: ACTION_CREATE, subject: SYSTEM_MANAGEMENT }) // sub_module is the subject and action is the permission, action is read,update,delete,create and submodule is Mastertables, Dashboard etc
  createRole(
    @Body() createRoleDto: CreateRoleDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.roleService.createRole(createRoleDto, user);
  }

  //add role permisison -> combining created role with submodule embedded permissions -> and this role permission can be assigned to a user
  @Post('role_permission')
  @ApiOperation({ summary: 'Adding permission to role' })
  @ApiPostResponse('Permissions added to role')
  @Can({ action: ACTION_CREATE, subject: SYSTEM_MANAGEMENT }) // sub_module is the subject and action is the permission, action is read,update,delete,create and submodule is Mastertables, Dashboard etc
  createRolePermission(
    @Body() createRolePermissionDto: CreateRolePermissionDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.roleService.createRolePermissions(
      createRolePermissionDto,
      user,
    );
  }

  //update role permission
  @Patch('role_permission')
  @ApiOperation({ summary: 'Updating current permission to role' })
  @ApiPatchResponse('Permissions updated to role')
  @Can({ action: ACTION_UPDATE, subject: SYSTEM_MANAGEMENT }) // sub_module is the subject and action is the permission, action is read,update,delete,create and submodule is Mastertables, Dashboard etc
  updateRolePermissions(
    @Body() updateRolePermissionsDto: UpdateRolePermissionsDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.roleService.updateRolePermissions(
      updateRolePermissionsDto,
      user,
    );
  }

  //unassign role permission
  // @Patch('unassign_role_permission')
  // @Can({
  //     action: ACTION_UPDATE,
  //     subject: SM_ADMIN.CORE_MODULE_ROLE,
  //     module: [MODULE_ADMIN]
  // })
  // async unassingRolePermission(
  //     @Body() unassingRolePermissionDto: UnassignRolePermissionDto,
  //     @SessionUser() user: RequestUser,
  // ) {
  //     console.log('Current User:', user)
  //     return this.roleService.unassignRolePermission(unassingRolePermissionDto, user);
  // }

  //filter/show active or inactive roles permission for a submodule
  @Get(':subModulePermissionId/permissions')
  getPermissions(
    @Param('subModuleId', ParseIntPipe) subModuleId: number,
    @Query('status') status?: string, // optional query param
  ) {
    const isActive =
      status === 'true' ? true : status === 'false' ? false : undefined;

    return this.prisma.rolePermission.findMany({
      where: {
        sub_module_permission_id: subModuleId,
        ...(isActive !== undefined && { status: isActive }), // conditionally add `status`
      },
    });
  }

  // @Post('permission_templates')
  // @Can({
  //     action: ACTION_CREATE,
  //     subject: SM_ADMIN.CORE_MODULE_ROLE,
  //     module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
  // })
  // async create(
  //     @Body() dto: CreatePermissionTemplateDto,
  //     @SessionUser() user: RequestUser,
  // ) {
  //     return this.roleService.createPermissionTemplate(dto,user);
  // }

  // @Patch('assign_permission_template/roles')
  // @Can({
  //     action: ACTION_UPDATE,  // the action of the subtion will be match with the current user role permission
  //     subject: SM_ADMIN.CORE_MODULE_ROLE, // SUBMODULE of Module Admin
  //     // module: [MODULE_ADMIN] // or MODULE_HR if it's from Admin
  // })
  // async assignPermissionTemplateByRole(
  //     @Body() addPermissionTemplateDto: AddPermissionToExistingRoleDto,
  //     @SessionUser() user: RequestUser,                                                      // to make enum decorator
  //  ) {
  //     return this.roleService.assignPermissionTemplateByRole(addPermissionTemplateDto,user);
  // }

  // @Patch('assign_permission_template/user')
  // @Can({
  //     action: ACTION_UPDATE,
  //     subject: SM_ADMIN.CORE_MODULE_MODULE,
  //     module: [MODULE_ADMIN]
  // })
  // async assignPermissionTemplateByUser(
  //     @Body() addPermissionTemplateDto: AddPermissionToExistingUserDto,
  // ) {
  //     return this.roleService.assignPermissionTemplateByUser(addPermissionTemplateDto);
  // }
}
