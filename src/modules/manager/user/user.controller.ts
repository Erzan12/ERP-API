import { Controller, Body, Post, Get, Patch } from '@nestjs/common';
import { CreateUserWithRolePermissionDto } from './dto/create-user-with-role-permission.dto';
import { UserService } from './user.service';
import { RequestUser } from 'src/components/types/request-user.interface';
import {
  DeactivateUserAccountDto,
  ReactivateUserAccountDto,
} from './dto/user-account-status.dto';
import { UserEmailResetTokenDto } from './dto/user-email.reset-token.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiGetResponse,
  ApiPostResponse,
  ApiSecurityClearance,
  ApiDeactivateResponse,
  ApiActivateResponse,
} from 'src/components/helpers/swagger-response.helper';
import { AddUserRolePermissionsDto } from './dto/add-user-role-permissions.dto';
import {
  ACTION_READ,
  ACTION_CREATE,
  USER_ACCOUNT,
  ACTION_APPROVE,
  SEC_LVL_5,
  USER_TOKEN_KEY,
} from 'src/components/constants/ability.constant';
import { SecurityClearance } from 'src/auth/security_clearance/security-clearance.decorator';
import { Can } from 'src/components/decorators/can.decorator';
import { SessionUser } from 'src/components/decorators/session-user.decorator';

@ApiBearerAuth('access-token')
@ApiTags('Manager')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  //view user accounts
  //to set up viewuser accounts in service
  @Get()
  @ApiOperation({ summary: 'Get User Accounts' })
  @ApiGetResponse('Here are all the User Accounts available')
  @ApiSecurityClearance(SEC_LVL_5)
  @SecurityClearance(SEC_LVL_5)
  @Can({ action: ACTION_READ, subject: USER_ACCOUNT })
  async viewUsers(@SessionUser() user: RequestUser) {
    return this.userService.viewUserAccount(user);
  }

  @Get('me/permissions')
  @ApiOperation({ summary: 'My User Account' })
  @ApiGetResponse('My user account')
  @ApiSecurityClearance(SEC_LVL_5)
  @SecurityClearance(SEC_LVL_5)
  @Can({ action: ACTION_READ, subject: USER_ACCOUNT })
  async getMyPermissions(@SessionUser() user: RequestUser) {
    return this.userService.getUserPermissions(user.id);
  }

  //create user account
  @Post()
  @ApiBody({
    type: CreateUserWithRolePermissionDto,
    description: 'Payload to create User Account',
  })
  @ApiOperation({ summary: 'Create a new user account' })
  @ApiPostResponse('User Account created successfully')
  @ApiSecurityClearance(SEC_LVL_5)
  @SecurityClearance(SEC_LVL_5)
  @Can({ action: ACTION_CREATE, subject: USER_ACCOUNT })
  async createUser(
    @Body() createUserWithRolePermissionDto: CreateUserWithRolePermissionDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.userService.createUserAccount(
      createUserWithRolePermissionDto,
      user,
    );
  }

  //ADDING ROLE PERMISSION TO USER AFTER USER ACCOUNT CREATION
  @Post('role_permission')
  @ApiOperation({ summary: 'Add Role permissions to user' })
  @ApiPostResponse('Role permission added to user successfully')
  @ApiSecurityClearance(SEC_LVL_5)
  @SecurityClearance(SEC_LVL_5)
  @Can({ action: ACTION_CREATE, subject: USER_ACCOUNT })
  async addRolePermission(
    @Body() addUserRolePermissionsDto: AddUserRolePermissionsDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.userService.addUserRolePermissions(
      addUserRolePermissionsDto.userId,
      addUserRolePermissionsDto.rolePermissionIds,
      user,
    );
  }

  //for expired first time login reset token key
  @Post('new_reset_token')
  @ApiBody({
    type: UserEmailResetTokenDto,
    description: 'Payload for new user reset token',
  })
  @ApiOperation({ summary: 'Reset token for first time log in' })
  @ApiPostResponse('Password reset done! you can now log in!')
  @ApiSecurityClearance(SEC_LVL_5)
  @SecurityClearance(SEC_LVL_5)
  @Can({ action: ACTION_CREATE, subject: USER_TOKEN_KEY })
  async newResetToken(
    @Body() userEmailResetTokenDto: UserEmailResetTokenDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.userService.userNewResetToken(userEmailResetTokenDto, user);
  }

  //first login password reset token

  // view user tokens
  // to set up view user token keys in service
  @Get('token_keys')
  @ApiOperation({ summary: 'Get the token keys for this user' })
  @ApiGetResponse('Here are all the token keys available for this user')
  @ApiSecurityClearance(SEC_LVL_5)
  @SecurityClearance(SEC_LVL_5)
  @Can({ action: ACTION_READ, subject: USER_TOKEN_KEY })
  async viewUserKeys(
    @Body() createUserWithTemplateDto: CreateUserWithRolePermissionDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.userService.createUserAccount(createUserWithTemplateDto, user);
  }

  @Patch('deactivate')
  @ApiOperation({ summary: 'Deactivate the user account' })
  @ApiDeactivateResponse('User account deactivated successfully')
  @ApiSecurityClearance(SEC_LVL_5)
  @SecurityClearance(SEC_LVL_5)
  async deactivateUser(
    @Body() deactivateUserAccountDto: DeactivateUserAccountDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.userService.deactivateUserAccount(
      deactivateUserAccountDto,
      user,
    );
  }

  @Patch('reactivate')
  @ApiOperation({ summary: 'Reactivate the user account' })
  @ApiActivateResponse('User account reactivated successfully')
  @ApiSecurityClearance(SEC_LVL_5)
  @SecurityClearance(SEC_LVL_5)
  async reactivateUser(
    @Body() reactivateUserAccountDto: ReactivateUserAccountDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.userService.reactivateUserAccount(
      reactivateUserAccountDto,
      user,
    );
  }

  @Get('new_employees')
  @ApiOperation({ summary: 'Get the new employees without user accounts' })
  @ApiGetResponse('Here are the list of new employees without user accounts')
  @ApiSecurityClearance(SEC_LVL_5)
  @SecurityClearance(SEC_LVL_5)
  async viewNewEmployees(@SessionUser() user: RequestUser) {
    return this.userService.viewNewEmployeeWithoutUserAccount(user);
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
