import {
  Body,
  Controller,
  Post,
  Put,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-dept.dto';
import { UpdateDepartmentDto } from './dto/update-dept.dto';
import { RequestUser } from 'src/components/types/request-user.interface';
import { SessionUser } from 'src/components/decorators/session-user.decorator';
import { Can } from 'src/components/decorators/can.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiGetResponse,
  ApiPatchResponse,
  ApiPostResponse,
} from 'src/components/helpers/swagger-response.helper';
import {
  ACTION_CREATE,
  ACTION_READ,
  ACTION_UPDATE,
  MASTERTABLES,
} from 'src/components/constants/ability.constant';

@ApiBearerAuth('access-token') // matches the name used in .addBearerAuth()
@ApiTags('Admin - Mastertables')
@Controller('administrator/mastertables')
export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}

  @Get('departments')
  @ApiOperation({ summary: 'Get all departments' })
  @ApiGetResponse('List of departments available')
  @Can({ action: ACTION_READ, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check in jwt strategy
  getDepartments(@SessionUser() user: RequestUser) {
    return this.departmentService.getDepartments(user);
  }

  @Get('departments/:id')
  @ApiOperation({ summary: 'Get a department' })
  @ApiGetResponse('Here is the department')
  @Can({ action: ACTION_READ, subject: MASTERTABLES })
  getDepartment(
    @Param('id', ParseIntPipe) id: number,
    @SessionUser() user: RequestUser,
  ) {
    return this.departmentService.getDepartment(id, user);
  }

  @Post('departments')
  @ApiBody({
    type: CreateDepartmentDto,
    description: 'Payload to create Department',
  })
  @ApiOperation({ summary: 'Create a new department' })
  @ApiPostResponse('Department created successfully')
  @Can({ action: ACTION_CREATE, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check in jwt strategy
  createDepartment(
    @Body() createDepartmentDto: CreateDepartmentDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.departmentService.createDepartment(createDepartmentDto, user);
  }

  @Put('departments/:id')
  @ApiBody({
    type: UpdateDepartmentDto,
    description: 'Payload to update department',
  })
  @ApiOperation({ summary: 'Update a current department information' })
  @ApiPatchResponse('Department updated successfully')
  @Can({ action: ACTION_UPDATE, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check in jwt strategy
  updateDepartment(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDeptDto: UpdateDepartmentDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.departmentService.updateDepartment(id, updateDeptDto, user);
  }
}
