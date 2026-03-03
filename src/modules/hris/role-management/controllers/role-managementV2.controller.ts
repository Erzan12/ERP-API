import { Controller, Get, ParseUUIDPipe, Param } from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiGetResponse } from 'src/utils/helpers/swagger-response.helper';

import { RoleManagementService } from '../role-management.service';

import { Can } from 'src/utils/decorators/can.decorator';
import { ACTION_READ, ROLE_MANAGEMENT } from 'src/utils/constants/ability.constant';

import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';

@ApiTags('Human Resources - Role Management')
@Controller({path: 'roles', version: '2'})
export class RoleManagementControllerV2 {
    constructor(private roleManagementService: RoleManagementService) {}

    @Get()
    @ApiOperation({ summary: 'Get All Roles' })
    @ApiGetResponse('Here are the list of Roles')
    @Can({ action: ACTION_READ, subject: ROLE_MANAGEMENT})
    getRoles(@SessionUser() user: RequestUser) {
        return this.roleManagementService.getRoles(user);
    }

    @Get('/:roleId')
    @ApiOperation({ summary: 'Get All Roles' })
    @ApiGetResponse('Here are the list of Roles')
    @Can({ action: ACTION_READ, subject: ROLE_MANAGEMENT})
    getRole(
        @SessionUser() user: RequestUser,
        @Param('roleId', new ParseUUIDPipe()) roleId: string,
    ) {
        return this.roleManagementService.getRole(roleId, user);
    }
}
