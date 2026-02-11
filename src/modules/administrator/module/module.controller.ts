import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ModuleService } from './module.service';
import { Can } from '../../../utils/decorators/can.decorator';
import { SessionUser } from '../../../utils/decorators/session-user.decorator';
import { RequestUser } from '../../../utils/types/request-user.interface';
import { CreateModuleDto } from './dto/module.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiGetResponse,
  ApiPatchResponse,
  ApiPostResponse,
} from 'src/utils/helpers/swagger-response.helper';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ACTION_CREATE, ACTION_READ, ACTION_UPDATE, SYSTEM_MANAGEMENT } from 'src/utils/constants/ability.constant';

@ApiBearerAuth('access-token')
@ApiTags('Administrator - Module')
@Controller('administrator')
export class ModuleController {
  constructor(private moduleService: ModuleService) {}

  @Get('modules')
  @ApiOperation({ summary: 'Get modules' })
  @ApiGetResponse('Here are all the Modules available')
  @Can({ action: ACTION_READ , subject: SYSTEM_MANAGEMENT }) // ---> action is permission; subject is submodule; role is check in jwt strategy
  getModules(@SessionUser() user: RequestUser) {
    return this.moduleService.getModules(user);
  }

  @Get('modules/:id')
  @ApiOperation({ summary: 'Get a module' })
  @ApiGetResponse('Details of the module with submodules')
  @Can({ action: ACTION_READ, subject: SYSTEM_MANAGEMENT }) // ---> action is permission; subject is submodule; role is check in jwt strategy
  getModule(
    @SessionUser() user: RequestUser,
    @Param('id', new ParseUUIDPipe) id: string,
  ) {
    return this.moduleService.getModule(user, id); // 👈 pass the id to your service
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
    @Param('id', new ParseUUIDPipe) id: string, //can be number can be string depends on the defined prisma value if int or string
  ) {
    return this.moduleService.updateModude(updateModuleDto, user, id);
  }
}
