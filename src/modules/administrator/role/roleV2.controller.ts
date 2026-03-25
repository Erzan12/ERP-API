import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { Can } from '../../../utils/decorators/can.decorator';
import { SessionUser } from '../../../utils/decorators/session-user.decorator';
import { RequestUser } from '../../../utils/types/request-user.interface';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permisisons.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiGetResponse,
  ApiPatchResponse,
  ApiPostResponse,
} from 'src/utils/helpers/swagger-response.helper';
import {
  ACTION_CREATE,
  ACTION_READ,
  ACTION_UPDATE,
  SYSTEM_MANAGEMENT,
} from 'src/utils/constants/ability.constant';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';

@ApiTags('Administrator - Role')
@Controller({ path: 'administrator', version: '2' })
export class RoleControllerV2 {
  constructor(private roleService: RoleService) {}

  //get all available roles
  @Get('roles')
  @ApiOperation({ summary: 'Get all Roles' })
  @ApiGetResponse('Here are the list of Roles')
  @Can({ action: ACTION_READ, subject: SYSTEM_MANAGEMENT }) // sub_module is the subject and action is the permission, action is read,update,delete,create and submodule is Mastertables, Dashboard etc
  getRoles(
    @SessionUser() user: RequestUser,
    @Query() dto: PaginationDto,
    // @Query('page') page = 1,
    // @Query('perPage') perPage = 10,
    // @Query('search') search?: string,
    // @Query('sortBy') sortBy: string = 'created_at',
    // @Query('order') order: 'asc' | 'desc' = 'asc',
  ) {
    return this.roleService.getRoles(user, dto);
  }

  @Get('roles/:id')
  @ApiOperation({ summary: 'Get a role' })
  @ApiGetResponse('Here is the Role')
  @Can({ action: ACTION_READ, subject: SYSTEM_MANAGEMENT })
  getRole(
    @Param('id', new ParseUUIDPipe()) id: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.roleService.getRole(id, user);
  }

  //create role
  @Post('roles')
  @ApiOperation({ summary: 'Create new role' })
  @ApiPostResponse('Role created successfully')
  @Can({ action: ACTION_CREATE, subject: SYSTEM_MANAGEMENT }) // sub_module is the subject and action is the permission, action is read,update,delete,create and submodule is Mastertables, Dashboard etc
  createRole(
    @Body() createRoleDto: CreateRoleDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.roleService.createRole(createRoleDto, user);
  }

  //update role
  @Put('roles/:roleId')
  @ApiOperation({ summary: 'Update current role' })
  @ApiPostResponse('Role updated successfully')
  @Can({ action: ACTION_UPDATE, subject: SYSTEM_MANAGEMENT }) // sub_module is the subject and action is the permission, action is read,update,delete,create and submodule is Mastertables, Dashboard etc
  updateRole(
    @Body() dto: UpdateRoleDto,
    @Param('roleId', new ParseUUIDPipe()) roleId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.roleService.updateRole(dto, user, roleId);
  }

  //add role permisison -> combining created role with submodule embedded permissions -> and this role permission can be assigned to a user
  @Put('roles/role_permission')
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
  @Put('roles/role_permission/:id')
  @ApiOperation({ summary: 'Updating current permission to role' })
  @ApiPatchResponse('Permissions updated to role')
  @Can({ action: ACTION_UPDATE, subject: SYSTEM_MANAGEMENT }) // sub_module is the subject and action is the permission, action is read,update,delete,create and submodule is Mastertables, Dashboard etc
  updateRolePermissions(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateRolePermissionsDto: UpdateRolePermissionsDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.roleService.updateRolePermissions(
      id,
      updateRolePermissionsDto,
      user,
    );
  }
}
