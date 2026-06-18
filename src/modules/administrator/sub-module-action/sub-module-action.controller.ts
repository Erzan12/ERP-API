import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SubModuleActionService } from './sub-module-action.service';
import { ApiGetResponse, ApiPatchResponse, ApiPostResponse } from 'src/utils/helpers/swagger-response.helper';
import { Can } from 'src/utils/decorators/can.decorator';
import { ACTION_READ, SYSTEM_MANAGEMENT } from 'src/utils/constants/ability.constant';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { CreateSubModuleActionDto, UpdateSubmoduleActionDto } from './dto/sub-module-action.dto';

@ApiTags('Administrator - Submodule Action/Permission')
@Controller({path:'administrator', version:'2'})
export class SubModuleActionController {
    constructor(private submoduleActionService: SubModuleActionService) {} 

    @Get('sub-module/permissions/:subModulePermissionId')
    @ApiOperation({ summary: 'Get a Submodule action/permission' })
    @ApiGetResponse(
        'Here is the Submodule action/permission'
    )
    @Can({ action: ACTION_READ, subject: SYSTEM_MANAGEMENT })
    getSubModulepermission(
        @Param('subModulePermissionId', new ParseUUIDPipe()) subModulePermissionId: string, 
        @SessionUser() user: RequestUser,
    ) {
        return this.submoduleActionService.getSubModuleAction(subModulePermissionId, user)
    }

    @Get('sub-module/permissions')
    @ApiOperation({ summary: 'Get Submodule actions/permissions' })
    @ApiGetResponse(
        'Here are the list of Submodule actions/permissions available',
    )
    @Can({ action: ACTION_READ, subject: SYSTEM_MANAGEMENT })
    getSubModulePermission(@SessionUser() user: RequestUser) {
        return this.submoduleActionService.getSubModuleActions(user);
    }

    @Post('sub-module/permissions')
    @ApiBody({
        type: CreateSubModuleActionDto,
        description: 'Payload to create permissions for submodule',
    })
    @ApiOperation({
        summary:
            'Create a new permissions/actions for submodule(acts as inventory of actions for submodules)',
    })
    @ApiPostResponse('Permission created successfully')
    @Can({ action: 'create', subject: 'System Management' }) // sub_module is the subject and action is the permission, action is read,update,delete,create and submodule is Mastertables, Dashboard etc
    createSubModulePermission(
        @Body() addSubModuleDto: CreateSubModuleActionDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.submoduleActionService.createSubModuleAction(addSubModuleDto, user);
    }

    //update the submodule actions - inventory of permissions added on a submodule
    @Put('sub-module/permissions/:subModulePermissionId')
    @ApiBody({
    type: UpdateSubmoduleActionDto,
    description: 'Payload to update the current sub module action details',
    })
    @ApiOperation({ summary: 'Update a current sub module action/permission details' })
    @ApiPatchResponse('Sub module action/permission updated successfully')
    @Can({ action: 'update', subject: 'System Management' }) // sub_module is the subject and action is the permission, action is read,update,delete,create and submodule is Mastertables, Dashboard etc
    updateSubmoduleAction(
    @Body() dto: UpdateSubmoduleActionDto,
    @SessionUser() user: RequestUser,
    @Param('subModuleActionId', new ParseUUIDPipe()) subModuleActionId: string,
    ) {
    return this.submoduleActionService.updateSubmoduleAction(dto, user, subModuleActionId);
    }

    @Delete('sub-module/permissions/:subModulePermissionId')
    @ApiOperation({ summary: 'Delete a submodule action/permission' })
    @Can({ action: 'update', subject: 'System Management' })
    deleteSubmoduleAction(
        @Param('submoduleActionId', new ParseUUIDPipe()) submoduleActionId: string,
    ) {
        return this.submoduleActionService.deleteSubmoduleAction(submoduleActionId);
    }
}
