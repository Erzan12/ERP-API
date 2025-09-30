import { Controller,Post, Body, Put, Delete, Get, Param, Patch } from '@nestjs/common';
import { ModuleService } from './module.service';
import { Can } from '../../Components/decorators/can.decorator';
import { ACTION_CREATE, ACTION_READ, MODULE_ADMIN } from '../../Components/decorators/ability';
import { SM_ADMIN } from '../../Components/constants/core-constants';
import { SessionUser } from '../../Components/decorators/session-user.decorator';
import { RequestUser } from '../../Components/types/request-user.interface';
import { CreateModuleDto } from './dto/create-module.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiGetResponse, ApiPatchResponse, ApiPostResponse } from 'src/Components/helpers/swagger-response.helper';
import { UpdateModuleDto } from './dto/update-module.dto';

@ApiBearerAuth('access-token')
@ApiTags('Module')
@Controller('administrator')
export class ModuleController {
    constructor(private moduleService: ModuleService) {}

    @Get('modules')
    @ApiOperation({ summary: 'Get modules' })
    @ApiGetResponse('Here are all the Modules available')
    @Can({
        action: ACTION_READ,
        subject: SM_ADMIN.CORE_MODULE_MODULE,
        module: [MODULE_ADMIN],
    })
    async getModules(
        @SessionUser() user: RequestUser,
    ) {
        return this.moduleService.listModule(user);
    }

    @Post('module')
    @ApiOperation({ summary: 'Create a new Module' })
    @ApiPostResponse('Module created successfully')                                                                       
    @Can({
        action: ACTION_CREATE,
        subject: SM_ADMIN.CORE_MODULE_MODULE,
        module: [MODULE_ADMIN],
    })
    async createModule( 
        @Body() createModuleDto: CreateModuleDto,
        @SessionUser() user: RequestUser                                                            // to make enum decorator
        ) {
        return this.moduleService.createModule(createModuleDto, user)
    }

    @Get('module/view/:id')
    @ApiOperation({ summary: 'Get module by ID' })
    @ApiGetResponse('Details of the module with submodules')
    @Can({
        action: ACTION_READ,
        subject: SM_ADMIN.CORE_MODULE_MODULE,
        module: [MODULE_ADMIN],
    })
    async getModule(
        @SessionUser() user: RequestUser,
        @Param('id') id: number, // 👈 this gets the `:id` from the URL
    ) {
        return this.moduleService.viewModule(user, id); // 👈 pass the id to your service
    }

    @Patch('module/view/edit/:id')
    @ApiBody({ type: UpdateModuleDto, description: 'Payload to update the module info'})
    @ApiOperation({ summary: 'Update current module' })
    @ApiPatchResponse('Module updated successfully')
    @Can({
        action: ACTION_CREATE,
        subject: SM_ADMIN.CORE_MODULE_MODULE,
        module: [MODULE_ADMIN]
    })
    async updateModule(
        @Body() updateModuleDto: UpdateModuleDto,
        @SessionUser() user: RequestUser,
        @Param('id') id: number, //can be number can be string depends on the defined prisma value if int or string
    ) {
        return this.moduleService.updateMod(updateModuleDto,user,id)
    }

    // @Put()
    // async updateModule({

    // })
}
