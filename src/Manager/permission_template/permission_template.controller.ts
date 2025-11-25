import { Controller, Get, Post, Body, Param } from '@nestjs/common';
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

@ApiBearerAuth('access-token')
@ApiTags('Manager')
@Controller('permission-template')
export class PermissionTemplateController {
    constructor(private permissionTemplateService: PermissionTemplateService, private prisma: PrismaService) {}

    //get permission templates
    @Get('')
    @ApiOperation({ summary: 'Get permission templates' })
    @ApiGetResponse('Here are all the permission templates available')
    @Can({ action: ACTION_READ, subject: PERMISSION_TEMPLATE })
    async getPermissionTemplates(@SessionUser() user: RequestUser,) {
        return this.permissionTemplateService.listPermTemplate(user);
    }

    //get user permission templates
    @Get('me')
    @ApiOperation({ summary: 'Get available permission templates to user' })
    @ApiGetResponse('Here are the list of permission templates available')
    @Can({ action: ACTION_READ, subject: PERMISSION_TEMPLATE })
    async getPermTemplates(@SessionUser() user: RequestUser) {
        return this.permissionTemplateService.getPermissionTemplatesFor(user);
    }

    @Post('')
    @ApiBody({ type: CreatePermissionTemplateDto, description: 'Payload to create Permission Template'})
    @ApiOperation({ summary: 'Create new permission template' })
    @ApiPostResponse('Permission template created successfully')
    // @ApiCreatedResponse({
    //     description: 'The permission template has been successfully created.',
    //     schema: {
    //     example: {
    //         message: 'Permission template created',
    //         template_id: 1,
    //         name: 'Accounting Clerk Permissions',
    //     },
    //     },
    // })
    // @ApiBadRequestResponse({
    //     description: 'Validation error or template already exists.',
    //     schema: {
    //     example: {
    //         statusCode: 400,
    //         message: 'Permission template already exists',
    //         error: 'Bad Request',
    //     },
    //     },
    // })
    @Can({ action: ACTION_CREATE, subject: PERMISSION_TEMPLATE })
    async createPermissionTemplate(
        @Body() dto: CreatePermissionTemplateDto,
        @SessionUser() user: RequestUser
    ) {
        return this.permissionTemplateService.createPermissionTemplate(dto, user)
    }

    //assign permission template to user
    @Post('user/:id')
    @ApiBody({ type: AssignTemplateDto, description: 'Payload to assign permission template to user' })
    @ApiOperation({ summary: 'Assign Permission template to user'})
    @ApiPostResponse('Permission Template assigned to user successfully')
    @Can({ action: ACTION_CREATE, subject: PERMISSION_TEMPLATE })
    async assignPermTemplate(
        @Body() dto: AssignTemplateDto,
        @SessionUser() user: RequestUser,
        @Param('id') id: number,
    ) {
        return this.permissionTemplateService.assignTemplateToUser(dto, user)
    }
}
