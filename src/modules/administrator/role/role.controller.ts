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
import { RolePermissionService, RoleService } from './role.service';
import { Can } from '../../../utils/decorators/can.decorator';
import { SessionUser } from '../../../utils/decorators/session-user.decorator';
import { RequestUser } from '../../../utils/types/request-user.interface';
import {
  CreateRoleDto,
  UpdateRoleDto,
  UpdateRolePermissionDto,
} from './dto/role.dto';
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
  ROLE_MANAGEMENT,
} from 'src/utils/constants/ability.constant';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';

@ApiTags('Administrator - Role')
@Controller({ path: 'administrator', version: '2' })
export class RoleController {
  constructor(private roleService: RoleService) {}

  //get all available roles
  @Get('roles')
  @ApiOperation({ summary: 'Get all Roles' })
  @ApiGetResponse('Here are the list of Roles')
  @Can({ action: ACTION_READ, subject: ROLE_MANAGEMENT }) // sub_module is the subject and action is the permission, action is read,update,delete,create and submodule is Mastertables, Dashboard etc
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

  @Get('roles/role-permissions')
  @ApiOperation({ summary: 'Get all Role Permissions' })
  @ApiGetResponse('Here are the list of Role Permissions')
  @Can({ action: ACTION_READ, subject: ROLE_MANAGEMENT })
  getRolePermissions(@SessionUser() user: RequestUser) {
    return this.roleService.getRolePermissions(user);
  }

  @Get('roles/:id')
  @ApiOperation({ summary: 'Get a role' })
  @ApiGetResponse('Here is the Role')
  @Can({ action: ACTION_READ, subject: ROLE_MANAGEMENT })
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
  @Can({ action: ACTION_CREATE, subject: ROLE_MANAGEMENT }) // sub_module is the subject and action is the permission, action is read,update,delete,create and submodule is Mastertables, Dashboard etc
  createRole(
    @Body() createRoleDto: CreateRoleDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.roleService.createRole(createRoleDto, user);
  }

  @Put('roles/role_permission')
  @ApiOperation({ summary: 'Adding/Updating permission(s) to role' })
  @ApiPatchResponse('Permissions added to role')
  @Can({ action: ACTION_UPDATE, subject: ROLE_MANAGEMENT }) // sub_module is the subject and action is the permission, action is read,update,delete,create and submodule is Mastertables, Dashboard etc
  updateRolePermission(
    @Body() dto: UpdateRolePermissionDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.roleService.assignRolePermissions(dto, user);
  }

  //update role
  @Put('roles/:roleId')
  @ApiOperation({ summary: 'Update current role' })
  @ApiPatchResponse('Role updated successfully')
  @Can({ action: ACTION_UPDATE, subject: ROLE_MANAGEMENT }) // sub_module is the subject and action is the permission, action is read,update,delete,create and submodule is Mastertables, Dashboard etc
  updateRole(
    @Body() dto: UpdateRoleDto,
    @Param('roleId', new ParseUUIDPipe()) roleId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.roleService.updateRole(dto, user, roleId);
  }
}

@ApiTags('Administrator - Role Permissions')
@Controller({ path: 'administrator', version: '2' })
export class RolePermissionController {
  constructor(private rolePermissionService: RolePermissionService) {}

  @Get('roles/:roleId/role-permissions')
  @ApiOperation({ summary: 'Get a single Role with role permissions' })
  @ApiGetResponse('Here is the Role with its role permission')
  @Can({ action: ACTION_READ, subject: ROLE_MANAGEMENT })
  getRoleWithPermissions(
    @SessionUser() user: RequestUser,
    @Param('roleId', new ParseUUIDPipe()) roleId: string,
  ) {
    return this.rolePermissionService.getSingleRoleWithPermissions(
      user,
      roleId,
    );
  }

  @Get('roles/:userId/role-permission')
  @ApiOperation({ summary: 'Get a single User with role permissions' })
  @ApiGetResponse('Here is the User with its role permission')
  @Can({ action: ACTION_READ, subject: ROLE_MANAGEMENT })
  getUserWithPermissions(
    @SessionUser() user: RequestUser,
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ) {
    return this.rolePermissionService.getUserWithRolePermission(user, userId);
  }
}
