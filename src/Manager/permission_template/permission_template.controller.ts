import { Controller, Get, Post, Body, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { PermissionTemplateService } from './permission_template.service';
import { Can } from 'src/Components/decorators/can.decorator';
import { SessionUser } from 'src/Components/decorators/session-user.decorator';
import { RequestUser } from 'src/Components/types/request-user.interface';
import { CreatePermissionTemplateDto } from './dto/create-permission-template.dto';
import { PrismaService } from 'prisma/prisma.service';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import { ApiGetResponse, ApiPatchResponse, ApiPostResponse } from 'src/Components/helpers/swagger-response.helper';
import { ACTION_CREATE, ACTION_READ, ACTION_UPDATE, PERMISSION_TEMPLATE } from 'src/Components/constants/ability.constant';
import { AssignTemplateDto } from './dto/assign-template.dto';
import { UpdatePermissionTemplateDto } from './dto/update-permission-template.dto';

@ApiBearerAuth('access-token')
@ApiTags('Manager')
@Controller('permission_template')
export class PermissionTemplateController {
    constructor(private permissionTemplateService: PermissionTemplateService, private prisma: PrismaService) {}

    //get permission templates
    @Get('')
    @ApiOperation({ summary: 'Get permission templates' })
    @ApiGetResponse('Here are all the permission templates available')
    @Can({ action: ACTION_READ, subject: PERMISSION_TEMPLATE })
    async getAllPermissionTemplate(
        @SessionUser() user: RequestUser,
    ) {
        return this.permissionTemplateService.getAllPermissionTemplate(user);
    }

    //get a permission template
    @Get('/:permissionTemplateId')
    @ApiOperation({ summary: 'Get a permission template'})
    @ApiGetResponse('Here is the permission template')
    @Can({ action: ACTION_READ, subject: PERMISSION_TEMPLATE })
    async getPermissionTemplate(
        @Param('permissionTemplateId', ParseIntPipe) permissionTemplateId: number,
        @SessionUser() user: RequestUser,
    ) {
        return this.permissionTemplateService.getPermissionTemplate(permissionTemplateId, user)
    }

    //get user permission templates
    @Get('/user/:userPermissionTemplateId')
    @ApiOperation({ summary: 'Get available permission templates to user' })
    @ApiGetResponse('Here are the list of permission templates available')
    @Can({ action: ACTION_READ, subject: PERMISSION_TEMPLATE })
    async getUserPermissionTemplate(
        @Param('userPermissionTemplateId', ParseIntPipe) userPermissionTemplateId: number,
        @SessionUser() user: RequestUser
    ) {
        return this.permissionTemplateService.getUserPermissionTemplate(userPermissionTemplateId,user);
    }

    //update existing permission template information
    @Patch('/:permissionTemplateId')
    @ApiBody({ type: UpdatePermissionTemplateDto, description: 'Payload to update Permission Template'})
    @ApiOperation({ summary: 'Get available permissin templates to user' })
    @ApiPatchResponse('Permissin Template has been updated.')
    @Can({ action: ACTION_UPDATE, subject: PERMISSION_TEMPLATE })
    async updatePermissionTemplate(
        @Body() dto: UpdatePermissionTemplateDto,
        @Param('permissionTemplateId', ParseIntPipe) permissionTemplateId: number,
        @SessionUser() user: RequestUser
    ) {
        return this.permissionTemplateService.updatePermissionTemplate(permissionTemplateId,dto, user)
    }

    //create new permission template
    @Post('')
    @ApiBody({ type: CreatePermissionTemplateDto, description: 'Payload to create Permission Template'})
    @ApiOperation({ summary: 'Create new permission template' })
    @ApiPostResponse('Permission template created successfully')
    @Can({ action: ACTION_CREATE, subject: PERMISSION_TEMPLATE })
    async createPermissionTemplate(
        @Body() dto: CreatePermissionTemplateDto,
        @SessionUser() user: RequestUser
    ) {
        return this.permissionTemplateService.createPermissionTemplate(dto, user)
    }

    //assign permission template to user
    @Post('/user/:id')
    @ApiBody({ type: AssignTemplateDto, description: 'Payload to assign permission template to user' })
    @ApiOperation({ summary: 'Assign Permission template to user'})
    @ApiPostResponse('Permission Template assigned to user successfully')
    @Can({ action: ACTION_CREATE, subject: PERMISSION_TEMPLATE })
    async assignPermTemplate(
        @Body() dto: AssignTemplateDto,
        @SessionUser() user: RequestUser,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.permissionTemplateService.assignTemplateToUser(dto, user)
    }
}
