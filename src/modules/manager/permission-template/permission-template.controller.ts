import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  ParseUUIDPipe,
} from '@nestjs/common';
<<<<<<<< HEAD:src/modules/manager/permission-template/permission-template.controller.ts
import { PermissionTemplateService } from './permission-template.service';
========
import { PermissionTemplateService } from './permission_template.service';
>>>>>>>> 4c013eacfb0c8d760e3271e80f0b2e31d08fab78:src/modules/manager/permission-template/permission_template.controller.ts
import { Can } from 'src/utils/decorators/can.decorator';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { CreatePermissionTemplateDto } from './dto/create-permission-template.dto';
import { ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import {
  ApiGetResponse,
  ApiPatchResponse,
  ApiPostResponse,
} from 'src/utils/helpers/swagger-response.helper';
import {
  ACTION_CREATE,
  ACTION_READ,
  ACTION_UPDATE,
  PERMISSION_TEMPLATE,
<<<<<<<< HEAD:src/modules/manager/permission-template/permission-template.controller.ts
} from 'src/utils/constants/ability.constants';
========
} from 'src/utils/constants/ability.constant';
>>>>>>>> 4c013eacfb0c8d760e3271e80f0b2e31d08fab78:src/modules/manager/permission-template/permission_template.controller.ts
import { AssignTemplateDto } from './dto/assign-template.dto';
import { UpdatePermissionTemplateDto } from './dto/update-permission-template.dto';

@ApiTags('Manager - Permission Template')
@Controller({ path: 'manager', version: '2' })
export class PermissionTemplateController {
  constructor(private permissionTemplateService: PermissionTemplateService) {}

  //get permission templates
  @Get('permission-template')
  @ApiOperation({ summary: 'Get permission templates' })
  @ApiGetResponse('Here are all the permission templates available')
  @Can({ action: ACTION_READ, subject: PERMISSION_TEMPLATE })
  getPermissionTemplates(@SessionUser() user: RequestUser) {
    return this.permissionTemplateService.getPermissionTemplates(user);
  }

  //get a permission template
  @Get('permission-template/:id')
  @ApiOperation({ summary: 'Get a permission template' })
  @ApiGetResponse('Here is the permission template')
  @Can({ action: ACTION_READ, subject: PERMISSION_TEMPLATE })
  getPermissionTemplate(
<<<<<<<< HEAD:src/modules/manager/permission-template/permission-template.controller.ts
    @Param('id', ParseUUIDPipe) id: string,
========
    @Param('id', new ParseUUIDPipe()) id: string,
>>>>>>>> 4c013eacfb0c8d760e3271e80f0b2e31d08fab78:src/modules/manager/permission-template/permission_template.controller.ts
    @SessionUser() user: RequestUser,
  ) {
    return this.permissionTemplateService.getPermissionTemplate(id, user);
  }

  //get user permission templates
  // @Get('permission-template/user/:userPermissionTemplateId')
  // @ApiOperation({ summary: 'Get available permission templates to user' })
  // @ApiGetResponse('Here are the list of permission templates available')
  // @Can({ action: ACTION_READ, subject: PERMISSION_TEMPLATE })
  // getUserPermissionTemplate(
<<<<<<<< HEAD:src/modules/manager/permission-template/permission-template.controller.ts
  //   @Param('userPermissionTemplateId', ParseUUIDPipe)
========
  //   @Param('userPermissionTemplateId', new ParseUUIDPipe())
>>>>>>>> 4c013eacfb0c8d760e3271e80f0b2e31d08fab78:src/modules/manager/permission-template/permission_template.controller.ts
  //   userPermissionTemplateId: string,
  //   @SessionUser() user: RequestUser,
  // ) {
  //   return this.permissionTemplateService.getUserPermissionTemplate(
  //     userPermissionTemplateId,
  //     user,
  //   );
  // }

  //create new permission template
  @Post('permission-template')
  @ApiBody({
    type: CreatePermissionTemplateDto,
    description: 'Payload to create Permission Template',
  })
  @ApiOperation({ summary: 'Create new permission template' })
  @ApiPostResponse('Permission template created successfully')
  @Can({ action: ACTION_CREATE, subject: PERMISSION_TEMPLATE })
  createPermissionTemplate(
    @Body() dto: CreatePermissionTemplateDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.permissionTemplateService.createPermissionTemplate(dto, user);
  }

  //assign permission template to user
  @Post('permission-template/user/:id')
  @ApiBody({
    type: AssignTemplateDto,
    description: 'Payload to assign permission template to user',
  })
  @ApiOperation({ summary: 'Assign Permission template to user' })
  @ApiPostResponse('Permission Template assigned to user successfully')
  @Can({ action: ACTION_CREATE, subject: PERMISSION_TEMPLATE })
  assignPermTemplate(
    @Body() dto: AssignTemplateDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.permissionTemplateService.assignTemplateToUser(dto, user);
  }

  //update existing permission template information
  @Put('permission-template/:id')
  @ApiBody({
    type: UpdatePermissionTemplateDto,
    description: 'Payload to update Permission Template',
  })
  @ApiOperation({ summary: 'Get available permissin templates to user' })
  @ApiPatchResponse('Permissin Template has been updated.')
  @Can({ action: ACTION_UPDATE, subject: PERMISSION_TEMPLATE })
  updatePermissionTemplate(
    @Body() dto: UpdatePermissionTemplateDto,
<<<<<<<< HEAD:src/modules/manager/permission-template/permission-template.controller.ts
    @Param('id', ParseUUIDPipe) id: string,
========
    @Param('id', new ParseUUIDPipe()) id: string,
>>>>>>>> 4c013eacfb0c8d760e3271e80f0b2e31d08fab78:src/modules/manager/permission-template/permission_template.controller.ts
    @SessionUser() user: RequestUser,
  ) {
    return this.permissionTemplateService.updatePermissionTemplate(
      id,
      dto,
      user,
    );
  }
}
