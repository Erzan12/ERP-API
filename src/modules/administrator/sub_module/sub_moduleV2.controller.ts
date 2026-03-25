import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Put,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { Can } from '../../../utils/decorators/can.decorator';
import { CreateSubModuleDto } from './dto/create-sub-module.dto';
import { AssignSubModulePermissionDto } from './dto/assign-sub-module-permission.dto';
import { SessionUser } from '../../../utils/decorators/session-user.decorator';
import { RequestUser } from '../../../utils/types/request-user.interface';
import { SubModuleService } from './sub_module.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddSubModulePermissionDto } from './dto/add-sub-module-permission.dto';
import {
  ApiPatchResponse,
  ApiPostResponse,
  ApiGetResponse,
} from 'src/utils/helpers/swagger-response.helper';
import { UpdateSubModulePermisisonDto } from './dto/update-sub-module-permisison.dto';
import {
  ACTION_READ,
  SYSTEM_MANAGEMENT,
} from 'src/utils/constants/ability.constant';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';

@ApiTags('Administrator - Submodule')
@Controller({ path: 'administrator', version: '2' })
export class SubModuleControllerV2 {
  constructor(private subModuleService: SubModuleService) {}

  //get list of submodules
  @Get('sub-modules')
  @ApiOperation({ summary: 'Get Submodules' })
  @ApiGetResponse('Here are all the Sub modules available')
  @Can({ action: ACTION_READ, subject: SYSTEM_MANAGEMENT }) // ---> action is permission; subject is submodule; role is check in jwt strategy
  getSubmodules(
    @SessionUser() user: RequestUser,
    @Query() dto: PaginationDto,
    // @Query('page') page = 1,
    // @Query('perPage') perPage = 10,
    // @Query('search') search?: string,
    // @Query('sortBy') sortBy: string = 'created_at',
    // @Query('order') order: 'asc' | 'desc' = 'asc',
  ) {
    return this.subModuleService.getSubModules(user, dto);
  }

  @Get('sub-modules/permissions')
  @ApiOperation({ summary: 'Get Submodule actions/permissions' })
  @ApiGetResponse(
    'Here are the list of Submodule actions/permissions available',
  )
  @Can({ action: ACTION_READ, subject: SYSTEM_MANAGEMENT })
  getSubModuleActions(@SessionUser() user: RequestUser) {
    return this.subModuleService.getSubModuleActions(user);
  }

  @Get('sub-modules/:subModuleId')
  @ApiOperation({ summary: 'Get a Submodule' })
  @ApiGetResponse('status: Success!')
  @Can({ action: ACTION_READ, subject: SYSTEM_MANAGEMENT })
  getSubmodule(
    @Param('subModuleId', new ParseUUIDPipe()) subModuleId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.subModuleService.getSubmodule(subModuleId, user);
  }

  //create submodule
  @Post('sub-modules')
  @ApiBody({
    type: CreateSubModuleDto,
    description: 'Payload to create Submodule',
  })
  @ApiOperation({ summary: 'Create a new Submodule' })
  @ApiPostResponse('Submodule created successfully')
  @Can({ action: 'create', subject: 'System Management' }) // sub_module is the subject and action is the permission, action is read,update,delete,create and submodule is Mastertables, Dashboard etc
  createSubModule(
    @Body() createSubModuleDto: CreateSubModuleDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.subModuleService.createSubModule(createSubModuleDto, user);
  }

  @Post('sub-modules/permissions')
  @ApiBody({
    type: AddSubModulePermissionDto,
    description: 'Payload to create permissions for submodule',
  })
  @ApiOperation({
    summary:
      'Create a new permissions/actions for submodule(acts as inventory of actions for submodules)',
  })
  @ApiPostResponse('Permission created successfully')
  @Can({ action: 'create', subject: 'System Management' }) // sub_module is the subject and action is the permission, action is read,update,delete,create and submodule is Mastertables, Dashboard etc
  createPermission(
    @Body() addSubModuleDto: AddSubModulePermissionDto,
    @SessionUser() user: RequestUser,
  ) {
    console.log('createSubModuleDto:', AddSubModulePermissionDto);
    return this.subModuleService.addSubModuleAction(addSubModuleDto, user);
  }

  //add permissions to submodules
  @Put('sub-modules/permissions')
  @ApiBody({
    type: AssignSubModulePermissionDto,
    description: 'Payload to assign permissions for submodule',
  })
  @ApiOperation({ summary: 'Assign a new permission for submodule' })
  @ApiPostResponse('Permission assigned to a submodule successfully')
  @Can({ action: 'create', subject: 'System Management' }) // sub_module is the subject and action is the permission, action is read,update,delete,create and submodule is Mastertables, Dashboard etc
  createSubModulePermission(
    @Body() assignSubModulePermissionDto: AssignSubModulePermissionDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.subModuleService.assignSubModulePermissions(
      assignSubModulePermissionDto,
      user,
    );
  }

  //update the submodule permissions
  @Put('sub-module/permissions/:id')
  @ApiBody({
    type: UpdateSubModulePermisisonDto,
    description: 'Payload to update the current sub module permission',
  })
  @ApiOperation({ summary: 'Update a current sub module permission' })
  @ApiPatchResponse('Sub module permission updated successfully')
  @Can({ action: 'update', subject: 'System Management' }) // sub_module is the subject and action is the permission, action is read,update,delete,create and submodule is Mastertables, Dashboard etc
  updatePermission(
    @Body() dto: UpdateSubModulePermisisonDto,
    @SessionUser() user: RequestUser,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.subModuleService.updateSubModuleAction(dto, user, id);
  }
}
