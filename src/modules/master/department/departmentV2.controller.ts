import {
  Body,
  Controller,
  Post,
  Put,
  Get,
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
  MASTERTABLES,
} from 'src/utils/constants/ability.constant';

import { Can } from 'src/utils/decorators/can.decorator';

import { RequestUser } from 'src/utils/types/request-user.interface';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';

import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';

import { DepartmentService } from './department.service';

@ApiTags('Mastertable - Department')
@Controller({ path: 'mastertable', version: '2' })
export class DepartmentControllerV2 {
  constructor(private departmentService: DepartmentService) {}

  @Get('departments')
  @ApiOperation({ summary: 'Get all departments' })
  @ApiGetResponse('List of departments available')
  @Can({ action: ACTION_READ, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check in jwt strategy
  getDepartments(
    @SessionUser() user: RequestUser,
    @Query() dto: PaginationDto,
    // @Query('page') page = 1,
    // @Query('perPage') perPage = 10,
    // @Query('search') search?: string,
    // @Query('sortBy') sortBy: string = 'created_at',
    // @Query('order') order: 'asc' | 'desc' = 'asc',
  ) {
    return this.departmentService.getDepartments(user, dto);
  }

  @Get('departments/:departmentId')
  @ApiOperation({ summary: 'Get a department' })
  @ApiGetResponse('Here is the department')
  @Can({ action: ACTION_READ, subject: MASTERTABLES })
  getDepartment(
    @Param('departmentId', new ParseUUIDPipe()) departmentId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.departmentService.getDepartment(departmentId, user);
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

  @Put('departments/:departmentId')
  @ApiBody({
    type: UpdateDepartmentDto,
    description: 'Payload to update department',
  })
  @ApiOperation({ summary: 'Update a current department information' })
  @ApiPatchResponse('Department updated successfully')
  @Can({ action: ACTION_UPDATE, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check in jwt strategy
  updateDepartment(
    @Param('departmentId', new ParseUUIDPipe()) departmentId: string,
    @Body() updateDeptDto: UpdateDepartmentDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.departmentService.updateDepartment(
      departmentId,
      updateDeptDto,
      user,
    );
  }
}
