import {
  Controller,
  Get,
  ParseUUIDPipe,
  Param,
  Query,
  Post,
  Body,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiGetResponse,
  ApiPostResponse,
  ApiSecurityClearance,
} from 'src/utils/helpers/swagger-response.helper';
import { RoleManagementService } from './role-management.service';
import { Can } from 'src/utils/decorators/can.decorator';
import {
  ACTION_CREATE,
  ACTION_READ,
  ROLE_MANAGEMENT,
  SEC_LVL_5,
} from 'src/utils/constants/ability.constant';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { SecurityClearance } from 'src/middleware/security_clearance/security-clearance.decorator';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';
import { AddRoleToUserDto } from './dto/role.dto';

@ApiTags('Manager - Role Management')
@Controller({ path: 'manager', version: '2' })
export class RoleManagementControllerV2 {
  constructor(private roleManagementService: RoleManagementService) {}

  @Get('roles')
  @ApiOperation({ summary: 'Get All Roles' })
  @ApiGetResponse('Here are the list of Roles')
  @Can({ action: ACTION_READ, subject: ROLE_MANAGEMENT })
  getRoles(@SessionUser() user: RequestUser, @Query() dto: PaginationDto) {
    return this.roleManagementService.getRoles(user, dto);
  }

  @Get('roles/:roleId')
  @ApiOperation({ summary: 'Get All Roles' })
  @ApiGetResponse('Here are the list of Roles')
  @Can({ action: ACTION_READ, subject: ROLE_MANAGEMENT })
  getRole(
    @SessionUser() user: RequestUser,
    @Param('roleId', new ParseUUIDPipe()) roleId: string,
  ) {
    return this.roleManagementService.getRole(roleId, user);
  }

  @Get('me/permissions')
  @ApiOperation({ summary: 'My User Account' })
  @ApiGetResponse('My user account')
  @ApiSecurityClearance(SEC_LVL_5)
  @SecurityClearance(SEC_LVL_5)
  @Can({ action: ACTION_READ, subject: ROLE_MANAGEMENT })
  getMyPermissions(@SessionUser() user: RequestUser) {
    return this.roleManagementService.getUserPermissions(user.id);
  }

  //create role
  // @Post('roles')
  // @ApiOperation({ summary: 'Create new role' })
  // @ApiPostResponse('Role created successfully')
  // @Can({ action: ACTION_CREATE, subject: SYSTEM_MANAGEMENT }) // sub_module is the subject and action is the permission, action is read,update,delete,create and submodule is Mastertables, Dashboard etc
  // createRole(
  //   @Body() createRoleDto: CreateRoleDto,
  //   @SessionUser() user: RequestUser,
  // ) {
  //   return this.roleService.createRole(createRoleDto, user);
  // }

  @Post('roles/:userId')
  @ApiOperation({ summary: 'Add Role to user' })
  @ApiPostResponse('Role has been added to the user with permission')
  @ApiSecurityClearance(SEC_LVL_5)
  @SecurityClearance(SEC_LVL_5)
  @Can({ action: ACTION_CREATE, subject: ROLE_MANAGEMENT })
  addUserRole(
    @SessionUser() requestUser: RequestUser,
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() dto: AddRoleToUserDto,
  ) {
    return this.roleManagementService.addRoleUser(requestUser, userId, dto);
  }

  //ADDING ROLE PERMISSION TO USER AFTER USER ACCOUNT CREATION
  // @Post('role_permission')
  // @ApiOperation({ summary: 'Add Role permissions to user' })
  // @ApiPostResponse('Role permission added to user successfully')
  // @ApiSecurityClearance(SEC_LVL_5)
  // @SecurityClearance(SEC_LVL_5)
  // @Can({ action: ACTION_CREATE, subject: ROLE_MANAGEMENT })
  // addRolePermission(
  //   @Body() addUserRolePermissionsDto: AddUserRolePermissionsDto,
  //   @SessionUser() user: RequestUser,
  // ) {
  //   return this.roleManagementService.addUserRolePermissions(
  //     addUserRolePermissionsDto.userId,
  //     addUserRolePermissionsDto.rolePermissionIds,
  //     user,
  //   );
  // }
}
