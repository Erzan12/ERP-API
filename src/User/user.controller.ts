import { Controller, Body, Post, Get, Patch } from '@nestjs/common';
import { CreateUserWithRolePermissionDto } from './dto/create-user-with-role-permission.dto';
import { SessionUser } from '../Components/decorators/session-user.decorator';
import { UserService } from '../User/user.service';
import { Can } from '../Components/decorators/can.decorator';
// import { ACTION_CREATE, ACTION_READ, ACTION_UPDATE, MODULE_ADMIN, MODULE_MNGR } from '../Components/decorators/ability';
import { SM_ADMIN } from '../Components/constants/core-constants';
import { RequestUser } from '../Components/types/request-user.interface';
import { DeactivateUserAccountDto, ReactivateUserAccountDto } from './dto/user-account-status.dto';
import { UserEmailResetTokenDto } from './dto/user-email.reset-token.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiGetResponse, ApiPostResponse } from 'src/Components/helpers/swagger-response.helper';
import { AddUserRolePermissionsDto } from './dto/add-user-role-permissions.dto';
import { ACTION_READ, ACTION_CREATE, USER_ACCOUNT, ACTION_APPROVE } from 'src/Components/constants/ability.constant';

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
        @Can ({ action: ACTION_READ, subject: USER_ACCOUNT})
        async viewUsers(
            @SessionUser() user: RequestUser,
        ) {
            return this.userService.viewUserAccount(user);
        }

        @Get('me/permissions')
        @ApiOperation({ summary: 'My User Account' })
        @ApiGetResponse('My user account')
        @Can ({ action: ACTION_READ, subject: USER_ACCOUNT })
        async getMyPermissions(@SessionUser() user: RequestUser) {
            return this.userService.getUserPermissions(user.id);
        }

        //create user account
        @Post()
        @ApiBody({ type: CreateUserWithRolePermissionDto, description: 'Payload to create User Account'})
        @ApiOperation({ summary: 'Create a new user account' })
        @ApiPostResponse('User Account created successfully')
        @Can ({ action: ACTION_CREATE, subject: USER_ACCOUNT })
        async createUser(
            @Body() createUserWithRolePermissionDto: CreateUserWithRolePermissionDto,
            @SessionUser() user: RequestUser
        ) {
        return this.userService.createUserAccount(createUserWithRolePermissionDto, user);
        }

        //ADDING ROLE PERMISSION TO USER AFTER USER ACCOUNT CREATION
        @Post('role_permission')
        @ApiOperation({ summary: 'Add Role permissions to user' })
        @ApiPostResponse('Role permission added to user successfully')
        @Can ({ action: ACTION_CREATE, subject: USER_ACCOUNT })
        async addRolePermission(
            @Body() addUserRolePermissionsDto: AddUserRolePermissionsDto,
            @SessionUser() user: RequestUser
        ) {
            return this.userService.addUserRolePermissions(addUserRolePermissionsDto.userId, addUserRolePermissionsDto.rolePermissionIds, user);
        }

        //for expired first time login reset token key 
        @Post('new_reset_token')  
        @ApiBody({ type: UserEmailResetTokenDto, description: 'Payload for new user reset token' })
        @ApiOperation({ summary: 'Reset token for first time log in'})
        @ApiPostResponse('Password reset done! you can now log in!')
        @Can ({ action: ACTION_CREATE, subject: USER_ACCOUNT})
        async newResetToken(
            @Body() userEmailResetTokenDto: UserEmailResetTokenDto,
            @SessionUser() user: RequestUser,
        ) {
            return this.userService.userNewResetToken(userEmailResetTokenDto, user);
        }

        // view user tokens
        // to set up view user token keys in service
        @Get('token_keys')
        @ApiOperation({ })
        async viewUserKeys(
            @Body() createUserWithTemplateDto: CreateUserWithRolePermissionDto,
            @SessionUser() user: RequestUser
        ) {
        return this.userService.createUserAccount(createUserWithTemplateDto, user);
        }

        @Patch('deactivate')
        async deactivateUser(
            @Body() deactivateUserAccountDto: DeactivateUserAccountDto,
            @SessionUser() user: RequestUser,
        ) {
        return this.userService.deactivateUserAccount(deactivateUserAccountDto,user);
        }

        @Patch('reactivate')
        async reactivateUser(
            @Body() reactivateUserAccountDto: ReactivateUserAccountDto,
            @SessionUser() user: RequestUser,
        ) {
            return this.userService.reactivateUserAccount(reactivateUserAccountDto,user)
        }

        @Get('new_employees')
        async viewNewEmployees(
            @SessionUser() user: RequestUser,
        ) {
            return this.userService.viewNewEmployeeWithoutUserAccount(user)
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

