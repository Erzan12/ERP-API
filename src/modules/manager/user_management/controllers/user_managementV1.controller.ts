import { Controller, Body, Post, Get, Put, Req} from '@nestjs/common';
import { UserManagementService } from '../user_management.service';
import {
  ApiBody,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiGetResponse,
  ApiPostResponse,
  ApiSecurityClearance,
  ApiDeactivateResponse,
  ApiActivateResponse,
} from 'src/utils/helpers/swagger-response.helper';

import { DeactivateUserAccountDto, ReactivateUserAccountDto, } from '../dto/user-account-status.dto';
import { CreateUserWithRoleDto } from '../dto/create-user-with-role-permission.dto';
import { UserEmailResetTokenDto } from '../dto/user-email.reset-token.dto';

import {
  ACTION_READ,
  ACTION_CREATE,
  USER_ACCOUNT,
  SEC_LVL_5,
  USER_TOKEN_KEY,
} from 'src/utils/constants/ability.constant';
import { SecurityClearance } from 'src/middleware/security_clearance/security-clearance.decorator';
import { Can } from 'src/utils/decorators/can.decorator';

import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { Request } from 'express';

@ApiTags('Manager - User Management')
@Controller({ path: 'users', version: '1' })
export class UserManagementControllerV1 {
  constructor(private userManagementService: UserManagementService) {}

  //view user accounts
  //to set up viewuser accounts in service
  @Get()
  @ApiOperation({ summary: 'Get User Accounts' })
  @ApiGetResponse('Here are all the User Accounts available')
  @ApiSecurityClearance(SEC_LVL_5)
  @SecurityClearance(SEC_LVL_5)
  @Can({ action: ACTION_READ, subject: USER_ACCOUNT })
  viewUsers(@SessionUser() user: RequestUser) {
    return this.userManagementService.viewUserAccount(user);
  }

  // @Get('users/me/permissions')
  // @ApiOperation({ summary: 'My User Account' })
  // @ApiGetResponse('My user account')
  // @ApiSecurityClearance(SEC_LVL_5)
  // @SecurityClearance(SEC_LVL_5)
  // @Can({ action: ACTION_READ, subject: USER_ACCOUNT })
  // getMyPermissions(@SessionUser() user: RequestUser) {
  //   return this.userManagementService.getUserPermissions(user.id);
  // }

  //create user account
  @Post()
  @ApiBody({
    type: CreateUserWithRoleDto,
    description: 'Payload to create User Account',
  })
  @ApiOperation({ summary: 'Create a new user account' })
  @ApiPostResponse('User Account created successfully')
  @ApiSecurityClearance(SEC_LVL_5)
  @SecurityClearance(SEC_LVL_5)
  @Can({ action: ACTION_CREATE, subject: USER_ACCOUNT })
  createUser(
    @Body() createUserWithRoleDto: CreateUserWithRoleDto,
    @SessionUser() user: RequestUser,
    @Req() req: Request,
  ) {
    return this.userManagementService.createUserAccount(
      createUserWithRoleDto,
      user,
      req,
      user,
    );
  }

  //for expired first time login reset token key
  @Post('users/resend-invitation')
  @ApiBody({
    type: UserEmailResetTokenDto,
    description: 'Payload for new user reset token',
  })
  @ApiOperation({ summary: 'Reset token for first time log in' })
  @ApiPostResponse('Password reset done! you can now log in!')
  @ApiSecurityClearance(SEC_LVL_5)
  @SecurityClearance(SEC_LVL_5)
  @Can({ action: ACTION_CREATE, subject: USER_TOKEN_KEY })
  newResetToken(
    @Body() dto: UserEmailResetTokenDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.userManagementService.resendInvitation(
      dto,
      user,
    );
  }

  // @Put('add-role/:userId/:roleName')
  // @ApiOperation({ summary: 'Add Role to user' })
  // @ApiPostResponse('Role has been added to the user with permission')
  // @ApiSecurityClearance(SEC_LVL_5)
  // @SecurityClearance(SEC_LVL_5)
  // @Can({ action: ACTION_CREATE, subject: USER_ACCOUNT })
  // addUserRole(
  //   @SessionUser() requestUser: RequestUser,
  //   @Param('userId', new ParseUUIDPipe()) userId: string,
  //   @Param('roleName') roleName: string,
  // ) {
  //   return this.userManagementService.addRoleUser(requestUser, userId, roleName);
  // }

  // //ADDING ROLE PERMISSION TO USER AFTER USER ACCOUNT CREATION
  // @Post('role_permission')
  // @ApiOperation({ summary: 'Add Role permissions to user' })
  // @ApiPostResponse('Role permission added to user successfully')
  // @ApiSecurityClearance(SEC_LVL_5)
  // @SecurityClearance(SEC_LVL_5)
  // @Can({ action: ACTION_CREATE, subject: USER_ACCOUNT })
  // addRolePermission(
  //   @Body() addUserRolePermissionsDto: AddUserRolePermissionsDto,
  //   @SessionUser() user: RequestUser,
  // ) {
  //   return this.userManagementService.addUserRolePermissions(
  //     addUserRolePermissionsDto.userId,
  //     addUserRolePermissionsDto.rolePermissionIds,
  //     user,
  //   );
  // }

  //first login password reset token
  // view user tokens
  // to set up view user token keys in service
  @Get('token_keys')
  @ApiOperation({ summary: 'Get the token keys for this user' })
  @ApiGetResponse('Here are all the token keys available for this user')
  @ApiSecurityClearance(SEC_LVL_5)
  @SecurityClearance(SEC_LVL_5)
  @Can({ action: ACTION_READ, subject: USER_TOKEN_KEY })
  viewUserKeys(
    @Body() createUserWithRoleDto: CreateUserWithRoleDto,
    @SessionUser() user: RequestUser,
    @Req() req: Request,
  ) {
    return this.userManagementService.createUserAccount(
      createUserWithRoleDto,
      user,
      req,
      user,
    );
  }

  @Put('deactivate')
  @ApiOperation({ summary: 'Deactivate the user account' })
  @ApiDeactivateResponse('User account deactivated successfully')
  @ApiSecurityClearance(SEC_LVL_5)
  @SecurityClearance(SEC_LVL_5)
  deactivateUser(
    @Body() deactivateUserAccountDto: DeactivateUserAccountDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.userManagementService.deactivateUserAccount(
      deactivateUserAccountDto,
      user,
    );
  }

  @Put('reactivate')
  @ApiOperation({ summary: 'Reactivate the user account' })
  @ApiActivateResponse('User account reactivated successfully')
  @ApiSecurityClearance(SEC_LVL_5)
  @SecurityClearance(SEC_LVL_5)
  reactivateUser(
    @Body() reactivateUserAccountDto: ReactivateUserAccountDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.userManagementService.reactivateUserAccount(
      reactivateUserAccountDto,
      user,
    );
  }

  @Get('new_employees')
  @ApiOperation({ summary: 'Get the new employees without user accounts' })
  @ApiGetResponse('Here are the list of new employees without user accounts')
  @ApiSecurityClearance(SEC_LVL_5)
  @SecurityClearance(SEC_LVL_5)
  viewNewEmployees(@SessionUser() user: RequestUser) {
    return this.userManagementService.viewNewEmployeeWithoutUserAccount(user);
  }

  // @Get('with_roles_permissions')
  // @Can({
  //     action: ACTION_READ,
  //     subject: SM_ADMIN.USER_ACCOUNT,
  //     module: [MODULE_ADMIN,MODULE_MNGR]
  // })
  // async getAllWithRolesPermissions(
  // ) {
  //     return this.userService.getUsersWithRolesAndPermissions();
  // }
}
