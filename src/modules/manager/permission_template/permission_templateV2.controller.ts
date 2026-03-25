import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PermissionTemplateService } from './permission_template.service';
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
} from 'src/utils/constants/ability.constant';
import { AssignTemplateDto } from './dto/assign-template.dto';
import { UpdatePermissionTemplateDto } from './dto/update-permission-template.dto';

@ApiTags('Manager - Permission Template')
@Controller({ path: 'manager', version: '2' })
export class PermissionTemplateControllerV2 {
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
    @Param('id', new ParseUUIDPipe()) id: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.permissionTemplateService.getPermissionTemplate(id, user);
  }

  //get user permission templates
  @Get('permission-template/user/:userPermissionTemplateId')
  @ApiOperation({ summary: 'Get available permission templates to user' })
  @ApiGetResponse('Here are the list of permission templates available')
  @Can({ action: ACTION_READ, subject: PERMISSION_TEMPLATE })
  getUserPermissionTemplate(
    @Param('userPermissionTemplateId', new ParseUUIDPipe())
    userPermissionTemplateId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.permissionTemplateService.getUserPermissionTemplate(
      userPermissionTemplateId,
      user,
    );
  }

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
    @Param('id', new ParseUUIDPipe()) id: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.permissionTemplateService.updatePermissionTemplate(
      id,
      dto,
      user,
    );
  }
}
