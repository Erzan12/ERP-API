import { Controller, Body, Post, Get, Patch } from '@nestjs/common';
import { CreateUserWithRolePermissionDto } from './dto/create-user-with-role-permission.dto';
import { SessionUser } from '../Components/decorators/session-user.decorator';
import { UserService } from '../User/user.service';
import { Can } from '../Components/decorators/can.decorator';
import { ACTION_CREATE, ACTION_READ, ACTION_UPDATE, MODULE_ADMIN, MODULE_MNGR } from '../Components/decorators/ability';
import { SM_ADMIN } from '../Components/constants/core-constants';
import { RequestUser } from '../Components/types/request-user.interface';
import { DeactivateUserAccountDto, ReactivateUserAccountDto } from './dto/user-account-status.dto';
import { UserEmailResetTokenDto } from './dto/user-email.reset-token.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiGetResponse, ApiPostResponse } from 'src/Components/helpers/swagger-response.helper';
import { AddUserRolePermissionsDto } from './dto/add-user-role-permissions.dto';

@ApiBearerAuth('access-token')
@ApiTags('User')
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

        //view user accounts 
        //to set up viewuser accounts in service
        @Get()
        @ApiOperation({ summary: 'Get User Accounts' })
        @ApiGetResponse('Here are all the User Accounts available')
        @Can({
            action: ACTION_READ,
            subject: SM_ADMIN.USER_ACCOUNT,
            // module: [ MODULE_MNGR, MODULE_ADMIN ] // or MODULE_HR if it's from Admin
        })
        async viewUsers(
            @SessionUser() user: RequestUser,
        ) {
            return this.userService.viewUserAccount(user);
        }

        @Get('me/permissions')
        @ApiOperation({ summary: 'Get User Account' })
        @ApiGetResponse('Here are the User Account info available')
        async getMyPermissions(@SessionUser() user: RequestUser) {
            return this.userService.getUserPermissions(user.id);
        }

        //create user account
        @Post()
        @ApiBody({ type: CreateUserWithRolePermissionDto, description: 'Payload to create User Account'})
        @ApiOperation({ summary: 'Create a new user account' })
        @ApiPostResponse('User Account created successfully')
        @Can({
            action: ACTION_CREATE,
            subject: SM_ADMIN.USER_ACCOUNT,
            // module: [ MODULE_MNGR, MODULE_ADMIN] // or MODULE_HR if it's from Admin
        })
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
        @Can({
            action: ACTION_CREATE,
            subject: SM_ADMIN.USER_ACCOUNT,
        })
        async addRolePermission(
            @Body() addUserRolePermissionsDto: AddUserRolePermissionsDto,
            @SessionUser() user: RequestUser
        ) {
            return this.userService.addUserRolePermissions(addUserRolePermissionsDto.userId, addUserRolePermissionsDto.rolePermissionIds, user);
        }

        //for expired first time login reset token key 
        @Post('new_reset_token')
        @Can({
            action: ACTION_CREATE,
            subject: SM_ADMIN.USER_ACCOUNT,
            // module: [MODULE_MNGR, MODULE_ADMIN] // or MODULE_HR if it's from Admin
        })     
        async newResetToken(
            @Body() userEmailResetTokenDto: UserEmailResetTokenDto,
            @SessionUser() user: RequestUser,
        ) {
            return this.userService.userNewResetToken(userEmailResetTokenDto, user);
        }

        // view user tokens
        // to set up viewuser token keys in service
        @Get('token_keys')
        @Can({
            action: ACTION_READ,
            subject: SM_ADMIN.USER_TOKEN_KEY,
            // module: [MODULE_ADMIN]
        })
         async viewUserKeys(
            @Body() createUserWithTemplateDto: CreateUserWithRolePermissionDto,
            @SessionUser() user: RequestUser
        ) {
        return this.userService.createUserAccount(createUserWithTemplateDto, user);
        }

        @Patch('deactivate')
        @Can({
            action: ACTION_UPDATE,
            subject: SM_ADMIN.USER_ACCOUNT,
            // module: [MODULE_ADMIN],
        })
        async deactivateUser(
            @Body() deactivateUserAccountDto: DeactivateUserAccountDto,
            @SessionUser() user: RequestUser,
        ) {
        return this.userService.deactivateUserAccount(deactivateUserAccountDto,user);
        }

        @Patch('reactivate')
        @Can({
            action: ACTION_UPDATE,
            subject: SM_ADMIN.USER_ACCOUNT,
            // module: [MODULE_ADMIN],
        })
        async reactivateUser(
            @Body() reactivateUserAccountDto: ReactivateUserAccountDto,
            @SessionUser() user: RequestUser,
        ) {
            return this.userService.reactivateUserAccount(reactivateUserAccountDto,user)
        }

        @Get('new_employees')
        @Can({
            action: ACTION_READ,
            subject: SM_ADMIN.USER_ACCOUNT,
            // module: [MODULE_ADMIN,MODULE_MNGR]
        })
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

