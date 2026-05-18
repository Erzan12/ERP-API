import {
  Controller,
  Body,
  Post,
  Get,
  Put,
  Req,
  Param,
  ParseUUIDPipe,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserManagementService } from './user_management.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiGetResponse,
  ApiPostResponse,
  ApiSecurityClearance,
  ApiDeactivateResponse,
  ApiActivateResponse,
} from 'src/utils/helpers/swagger-response.helper';

import {
  DeactivateUserAccountDto,
  ReactivateUserAccountDto,
} from './dto/user-account-status.dto';
import { UserEmailResetTokenDto } from './dto/user-email.reset-token.dto';

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
import { UserManagementPaginationDto } from 'src/utils/dtos/user-mngt-pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDetailsDto } from './dto/user-details.dto';

@ApiTags('User Management')
@Controller({ path: 'users', version: '2' })
export class UserManagementControllerV2 {
  constructor(private userManagementService: UserManagementService) {}

  //view user accounts
  //to set up viewuser accounts in service
  @Get()
  @ApiOperation({ summary: 'Get User Accounts' })
  @ApiGetResponse('Here are all the User Accounts available')
  @ApiSecurityClearance(SEC_LVL_5)
  @SecurityClearance(SEC_LVL_5)
  @Can({ action: ACTION_READ, subject: USER_ACCOUNT })
  viewUsers(
    @SessionUser() user: RequestUser,
    @Query() dto: UserManagementPaginationDto,
  ) {
    return this.userManagementService.getUsers(user, dto);
  }

  //create user account
  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   type: CreateUserWithRoleDto,
  //   description: 'Payload to create User Account',
  // })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        employee_id: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        role_name: { type: 'string' },
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Create a new user account' })
  @ApiPostResponse('User Account created successfully')
  @ApiSecurityClearance(SEC_LVL_5)
  @SecurityClearance(SEC_LVL_5)
  @Can({ action: ACTION_CREATE, subject: USER_ACCOUNT })
  createUser(
    @Body() dto: UserDetailsDto,
    @SessionUser() user: RequestUser,
    @Req() req: Request,
    // @Param('userId', new ParseUUIDPipe()) userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userManagementService.createUserAccount(
      dto,
      user,
      req,
      // userId,
      file,
    );
  }

  //for expired first time login reset token key
  @Post('resend-invitation')
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
    return this.userManagementService.resendInvitation(dto, user);
  }

  //first login password reset token
  // view user tokens
  // to set up view user token keys in service
  // @Get('token_keys')
  // @ApiOperation({ summary: 'Get the token keys for this user' })
  // @ApiGetResponse('Here are all the token keys available for this user')
  // @ApiSecurityClearance(SEC_LVL_5)
  // @SecurityClearance(SEC_LVL_5)
  // @Can({ action: ACTION_READ, subject: USER_TOKEN_KEY })
  // viewUserKeys(
  //   @Body() createUserWithTemplateDto: CreateUserWithRoleDto,
  //   @SessionUser() user: RequestUser,
  //   @Req() req: Request,

  // ) {
  //   return this.userManagementService.createUserAccount(
  //     createUserWithTemplateDto,
  //     user,
  //     req,
  //   );
  // }

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
  viewNewEmployees(
    @SessionUser() user: RequestUser,
    @Query() dto: UserManagementPaginationDto
  ) {
    return this.userManagementService.viewNewEmployeeWithoutUserAccount(user, dto);
  }

  @Get('get-managers')
  @ApiOperation({ summary: 'Get Managers with department and employees' })
  @ApiGetResponse('Here are the list of Managers with departments and employees')
  @ApiSecurityClearance(SEC_LVL_5)
  @SecurityClearance(SEC_LVL_5)
  @Can({ action: ACTION_READ, subject: USER_ACCOUNT })
  getManagers(
    @SessionUser() user: RequestUser,
  ) {
    return this.userManagementService.getManagers(user);
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
