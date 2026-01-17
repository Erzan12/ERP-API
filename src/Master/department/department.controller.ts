import { Body, Controller, Post, Patch, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-dept.dto';
import { UpdateDepartmentDto } from './dto/update-dept.dto';
import { RequestUser } from 'src/Components/types/request-user.interface';
import { SessionUser } from 'src/Components/decorators/session-user.decorator';
import { Can } from 'src/Components/decorators/can.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiGetResponse, ApiPatchResponse, ApiPostResponse } from 'src/Components/helpers/swagger-response.helper';
import { ACTION_CREATE, ACTION_READ, ACTION_UPDATE, MASTERTABLES } from 'src/Components/constants/ability.constant';

@ApiBearerAuth('access-token') // matches the name used in .addBearerAuth()
@ApiTags('Mastertables')
@Controller('mastertables')
export class DepartmentController {
    constructor (private departmentService: DepartmentService) {}
    
    @Get('departments')
    @ApiOperation({ summary: 'Get all departments' })
    @ApiGetResponse('List of departments available')
    @Can({ action: ACTION_READ, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check in jwt strategy
    async getAllDepartments(
        @SessionUser() user: RequestUser,
    ) {
        return this.departmentService.getAllDepartments(user)
    }

    @Get('departments/:departmentId')
    @ApiOperation({ summary: 'Get a department'})
    @ApiGetResponse('Here is the department')
    @Can({ action: ACTION_READ, subject: MASTERTABLES })
    async getDepartment(
        @Param('departmentId', ParseIntPipe) departmentId: number,
        @SessionUser() user: RequestUser,
    ) {
        return this.departmentService.getDepartment(departmentId, user)
    }

    @Post('departments')
    @ApiBody({ type: CreateDepartmentDto, description: 'Payload to create Department' })
    @ApiOperation({ summary: 'Create a new department' })
    @ApiPostResponse('Department created successfully')
    @Can({ action: ACTION_CREATE, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check in jwt strategy
    async createDepartment(
        @Body() createDepartmentDto: CreateDepartmentDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.departmentService.createDepartment( createDepartmentDto, user);
    }

    @Patch('departments/:departmentId')
    @ApiBody({ type: UpdateDepartmentDto, description: 'Payload to update department'})
    @ApiOperation({ summary: 'Update a current department information' })
    @ApiPatchResponse('Department updated successfully')
    @Can({ action: ACTION_UPDATE, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check in jwt strategy
    async updateDept(
        @Param('departmentId', ParseIntPipe) departmentId: number,
        @Body() updateDeptDto: UpdateDepartmentDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.departmentService.updateDept( departmentId, updateDeptDto, user)
    }
}
