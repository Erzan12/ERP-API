import { Controller, Post, Body, Patch, Param, Get } from '@nestjs/common';
import { SM_ADMIN } from '../../Components/constants/core-constants';
// import { ACTION_CREATE, ACTION_READ, ACTION_UPDATE, MODULE_ADMIN } from '../../Components/decorators/ability';
import { Can } from '../../Components/decorators/can.decorator';
import { CreateSubModuleDto } from './dto/create-sub-module.dto';
import { AssignSubModulePermissionDto } from './dto/assign-sub-module-permission.dto';
import { SessionUser } from '../../Components/decorators/session-user.decorator';
import { RequestUser } from '../../Components/types/request-user.interface';
import { SubModuleService } from './sub_module.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddSubModulePermissionDto } from './dto/add-sub-module-permission.dto';
import { ApiPatchResponse, ApiPostResponse, ApiGetResponse } from 'src/Components/helpers/swagger-response.helper';
import { UpdateSubModulePermisisonDto } from './dto/update-sub-module-permisison.dto';

@ApiBearerAuth('access-token')
@ApiTags('System Management')
@Controller('administrator')
export class SubModuleController {
    constructor(private subModuleService: SubModuleService) {}
    
    //get list of submodules
    @Get('submodules')
    @ApiOperation({ summary: 'Get modules' })
    @ApiGetResponse('Here are all the Sub modules available')
    @Can({ action: 'read', subject: 'System Management' }) // ---> action is permission; subject is submodule; role is check in jwt strategy
    async getSubmodules(
        @SessionUser() user: RequestUser,
    ) {
        return this.subModuleService.listSubModule(user);
    }
    
    //create submodule
    @Post('submodule')
    @ApiBody({ type: CreateSubModuleDto, description: 'Payload to create Submodule' })
    @ApiOperation({ summary: 'Create a new Submodule'})
    @ApiPostResponse('Submodule created successfully')                                                                         
    @Can({ action: 'create', subject: 'System Management' }) // sub_module is the subject and action is the permission, action is read,update,delete,create and submodule is Mastertables, Dashboard etc
    async createSubModule( 
        @Body() createSubModuleDto: CreateSubModuleDto,
        @SessionUser() user: RequestUser                                                          
    ) {
        return this.subModuleService.createSubModule(createSubModuleDto, user)
    }

    //add permissions to submodules
    @Post('submodule/permission')
    @ApiBody({ type: AssignSubModulePermissionDto, description: 'Payload to assign permissions for submodule' })
    @ApiOperation({ summary: 'Assign a new permission for submodule'})
    @ApiPostResponse('Permission assigned to a submodule successfully')                                                                        
    @Can({ action: 'create', subject: 'System Management' }) // sub_module is the subject and action is the permission, action is read,update,delete,create and submodule is Mastertables, Dashboard etc
    async createSubModulePermission( 
        @Body() assignSubModulePermissionDto: AssignSubModulePermissionDto,
        @SessionUser() user: RequestUser 
    ) {
        return this.subModuleService.assignSubModulePermissions(assignSubModulePermissionDto, user)
    }

    //get list of submodule permissions added


    //inventory of submodule permissions 
    @Post('submodule/permissions')
    @ApiBody({ type: AddSubModulePermissionDto, description: 'Payload to create permissions for submodule' })
    @ApiOperation({ summary: 'Create a new permission for submodule'})
    @ApiPostResponse('Permission created successfully')
    @Can({ action: 'create', subject: 'System Management' }) // sub_module is the subject and action is the permission, action is read,update,delete,create and submodule is Mastertables, Dashboard etc
    async createPermission(
        @Body() addSubModuleDto: AddSubModulePermissionDto,
        @SessionUser() user: RequestUser,
    ) {
        console.log('createSubModuleDto:', AddSubModulePermissionDto);
        return this.subModuleService.addSubModulePerm(addSubModuleDto, user)
    }

    //update the submodule permissions
    @Patch('submodule/permissions/edit/:id')
    @ApiBody({ type: UpdateSubModulePermisisonDto, description: 'Payload to update the current sub module permission' })
    @ApiOperation({ summary: 'Update a current sub module permission' })
    @ApiPatchResponse('Sub module permission updated successfully')
    @Can({ action: 'update', subject: 'System Management' }) // sub_module is the subject and action is the permission, action is read,update,delete,create and submodule is Mastertables, Dashboard etc
    async updatePermission(
        @Body() updateSubModulePermisisonDto: UpdateSubModulePermisisonDto,
        @SessionUser() user: RequestUser,
        @Param('id') id: number,
    ) {
        return this.subModuleService.updateSubModulePerm(updateSubModulePermisisonDto,user,id)
    }
}
