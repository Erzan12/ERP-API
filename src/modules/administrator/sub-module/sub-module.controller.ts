import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Put,
  ParseUUIDPipe,
  Query,
  Delete,
} from '@nestjs/common';
import { Can } from '../../../utils/decorators/can.decorator';
import { CreateSubModuleDto, UpdateSubmoduleDto } from './dto/sub-module.dto';
import { AssignSubModulePermissionDto } from './dto/assign-sub-module-permission.dto';
import { SessionUser } from '../../../utils/decorators/session-user.decorator';
import { RequestUser } from '../../../utils/types/request-user.interface';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiPatchResponse,
  ApiPostResponse,
  ApiGetResponse,
} from 'src/utils/helpers/swagger-response.helper';
import {
  ACTION_READ,
  SYSTEM_MANAGEMENT,
} from 'src/utils/constants/ability.constant';
import { SubModulePaginationDto } from 'src/utils/dtos/module-pagination.dto';
import { SubModuleService } from './sub-module.service';

@ApiTags('Administrator - Submodule')
@Controller({ path: 'administrator', version: '2' })
export class SubModuleController {
  constructor(private subModuleService: SubModuleService) {}

  //get list of submodules
  @Get('sub-modules')
  @ApiOperation({ summary: 'Get Submodules' })
  @ApiGetResponse('Here are all the Sub modules available')
  @Can({ action: ACTION_READ, subject: SYSTEM_MANAGEMENT }) // ---> action is permission; subject is submodule; role is check in jwt strategy
  getSubmodules(
    @SessionUser() user: RequestUser,
    @Query() dto: SubModulePaginationDto,
  ) {
    return this.subModuleService.getSubModules(user, dto);
  }

  @Get('sub-modules/:subModuleId')
  @ApiOperation({ summary: 'Get a Submodule' })
  @ApiGetResponse('Get a Submodule')
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

  @Put('/sub-modules/:subModuleId')
  @ApiBody({
    type: UpdateSubmoduleDto,
    description: 'Payload to update the current sub module',
  })
  @ApiOperation({ summary: 'Update a current Submodule details' })
  @ApiPatchResponse('Sub module updated successfully')
  @Can({ action: 'update', subject: 'System Management' }) // sub_module is the subject and action is the permission, action is read,update,delete,create and submodule is Mastertables, Dashboard etc
  updateSubmodule(
    @Body() dto: UpdateSubmoduleDto,
    @SessionUser() user: RequestUser,
    @Param('subModuleId', new ParseUUIDPipe()) subModuleId: string,
  ) {
    return this.subModuleService.updateSubmodule(subModuleId, dto, user);
  }

  @Delete('sub-modules/:subModuleId')
  @ApiOperation({ summary: 'Delete a submodule ' })
  @Can({ action: 'update', subject: 'System Management' })
  deleteSubmodule(
    @Param('subModuleId', new ParseUUIDPipe()) subModuleId: string,
  ) {
    return this.subModuleService.deleteSubmodule(subModuleId);
  }
}
