import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';

import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiGetResponse,
  ApiPatchResponse,
  ApiPostResponse,
} from 'src/utils/helpers/swagger-response.helper';

import {
  ACTION_CREATE,
  ACTION_READ,
  ACTION_UPDATE,
  SYSTEM_MANAGEMENT,
} from 'src/utils/constants/ability.constant';

import { Can } from '../../../utils/decorators/can.decorator';

import { SessionUser } from '../../../utils/decorators/session-user.decorator';
import { RequestUser } from '../../../utils/types/request-user.interface';

import { CreateModuleDto, UpdateModuleDto } from './dto/module.dto';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';

import { ModuleService } from './module.service';

@ApiTags('Administrator - Module')
@Controller({ path: 'administrator', version: '2' })
export class ModuleControllerV2 {
  constructor(private moduleService: ModuleService) {}

  @Get('modules')
  @ApiOperation({ summary: 'Get modules' })
  @ApiGetResponse('Here are all the Modules available')
  @Can({ action: ACTION_READ, subject: SYSTEM_MANAGEMENT }) // ---> action is permission; subject is submodule; role is check in jwt strategy
  getModules(
    @SessionUser() user: RequestUser,
    @Query() dto: PaginationDto,
    // @Query('page') page = 1,
    // @Query('perPage') perPage = 10,
    // @Query('search') search?: string,
    // @Query('sortBy') sortBy: string = 'created_at',
    // @Query('order') order: 'asc' | 'desc' = 'asc',
  ) {
    return this.moduleService.getModules(user, dto);
  }

  @Get('modules/:moduleId')
  @ApiOperation({ summary: 'Get a module' })
  @ApiGetResponse('Details of the module with submodules')
  @Can({ action: ACTION_READ, subject: SYSTEM_MANAGEMENT }) // ---> action is permission; subject is submodule; role is check in jwt strategy
  getModule(
    @SessionUser() user: RequestUser,
    @Param('moduleId', new ParseUUIDPipe()) moduleId: string,
  ) {
    return this.moduleService.getModule(user, moduleId); // 👈 pass the id to your service
  }

  @Post('modules')
  @ApiOperation({ summary: 'Create a new Module' })
  @ApiPostResponse('Module created successfully')
  @Can({ action: ACTION_CREATE, subject: SYSTEM_MANAGEMENT }) // ---> action is permission; subject is submodule; role is check in jwt strategy
  createModule(
    @Body() createModuleDto: CreateModuleDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.moduleService.createModule(createModuleDto, user);
  }

  @Put('modules/:id')
  @ApiBody({
    type: UpdateModuleDto,
    description: 'Payload to update the module info',
  })
  @ApiOperation({ summary: 'Update current module' })
  @ApiPatchResponse('Module updated successfully')
  @Can({ action: ACTION_UPDATE, subject: SYSTEM_MANAGEMENT }) // ---> action is permission; subject is submodule; role is check in jwt strategy
  updateModule(
    @Body() updateModuleDto: UpdateModuleDto,
    @SessionUser() user: RequestUser,
    @Param('id', new ParseUUIDPipe()) id: string, //can be number can be string depends on the defined prisma value if int or string
  ) {
    return this.moduleService.updateModude(updateModuleDto, user, id);
  }
}
