import { Body, Controller, Post, Patch, Query, Get } from '@nestjs/common';
import { PositionService } from './position/position.service';
import { CreatePositionDto } from './position/dto/create-position.dto';
import { CreateDepartmentDto } from './department/dto/create-dept.dto';
import { RequestUser } from '../Components/types/request-user.interface';
import { DepartmentService } from './department/department.service';
import { SessionUser } from '../Components/decorators/session-user.decorator';
import { Can } from '../Components/decorators/can.decorator';
import { ACTION_CREATE, ACTION_READ, ACTION_UPDATE, MODULE_ADMIN } from '../Components/decorators/ability';
import { SM_ADMIN } from '../Components/constants/core-constants';
import { UpdateDeptDto } from './department/dto/update-dept.dto';
import { UpdatePositionDto } from './position/dto/update-position.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger'; // <-- import these
import { ApiActivateResponse, ApiDeactivateResponse, ApiGetResponse, ApiPatchResponse, ApiPostResponse } from '../Components/helpers/swagger-response.helper';
import { DeactivatePositionDto, ReactivatePositionDto } from './position/dto/dept-status.dto';
import { DeactivateDepartmentDto, ReactivateDepartmentDto } from './department/dto/pos-status.dto';

@ApiBearerAuth('access-token') // matches the name used in .addBearerAuth()
@ApiTags('Mastertables')
@Controller('mastertables')
export class MasterController {
    constructor(private positionService: PositionService, private departmentService: DepartmentService) {} 

    @Get('position')
    @ApiOperation({ summary: 'Get all positions' })
    @ApiGetResponse('List of positions retrieve')
    @Can({
        action: ACTION_READ,
        subject: SM_ADMIN.MASTER_TABLE_POSITION,
        module: [MODULE_ADMIN]
    })
    async getPosition(
        @SessionUser() user: RequestUser,
    ) {
        return this.positionService.getPositions( user );
    }

    @Post('position')
    @ApiBody({ type: CreatePositionDto, description: 'Payload to create Position'})
    @ApiOperation({ summary: 'Create a new position' })
    @ApiPostResponse('Position created successfully')
    @Can({
        action: ACTION_CREATE,
        subject: SM_ADMIN.MASTER_TABLE_POSITION,
        module: [MODULE_ADMIN]
    })
    async createPosition(
        @Body() createPositionDto: CreatePositionDto, 
        @SessionUser() user: RequestUser,
    ) {
        console.log('createPositionDto:', createPositionDto);
        console.log('stat:', createPositionDto.stat);
        return this.positionService.createPosition( createPositionDto, user);
    }

    @Patch('position')
    @ApiBody({ type: UpdatePositionDto, description: 'Payload to update Position Info'})
    @ApiOperation({ summary: 'Update a current position information'})
    @ApiPatchResponse('Position updated successfully')
    @Can({
        action: ACTION_UPDATE,
        subject: SM_ADMIN.MASTER_TABLE_POSITION,
        module: [MODULE_ADMIN]
    })
    async updatePositionInfo(
        @Body() updatePositionDto: UpdatePositionDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.positionService.updatePosition( updatePositionDto, user);
    }

    @Patch('position/deactivate')
    @ApiBody({ type: DeactivatePositionDto, description: 'Payload to Deactivate Position'})
    @ApiOperation({ summary: 'Deactivate a current position'})
    @ApiDeactivateResponse('Position has been deactivated')
    @Can({
        action: ACTION_UPDATE,
        subject: SM_ADMIN.MASTER_TABLE_POSITION,
        module: [MODULE_ADMIN]
    })
    async deactivatePos(
        @Body() deactivatePositionDto: DeactivatePositionDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.positionService.deactivatePos( deactivatePositionDto, user )
    }

    @Patch('position/reactivate')
    @ApiBody({ type: ReactivatePositionDto, description: 'Payload to Reactivate Position'})
    @ApiOperation({ summary: 'Reactivate a current Position'})
    @ApiActivateResponse('Position has been activated')
    @Can({
        action: ACTION_UPDATE,
        subject: SM_ADMIN.MASTER_TABLE_POSITION,
        module: [MODULE_ADMIN]
    })
    async reactivatePos(
        @Body() reactivatePositionDto: ReactivatePositionDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.positionService.reactivatePos( reactivatePositionDto, user )
    }

    @Get('position/status')
    @ApiOperation({ summary: 'Status of Positions'})
    @ApiGetResponse('Position status successfully fetched')
    @Can({
        action: ACTION_READ,
        subject: SM_ADMIN.MASTER_TABLE_POSITION,
        module: [MODULE_ADMIN]
    })
    async positionStat(
        @SessionUser() user: RequestUser,
        @Query() stat?: number,
    ) {
        return this.positionService.getPositionStatus(user,stat)
    }

    @Get('department')
    @ApiOperation({ summary: 'Get all departments' })
    @ApiGetResponse('List of departments retrieved')
    @Can({
        action: ACTION_READ,
        subject: SM_ADMIN.MASTER_TABLE_DEPARTMENT,
        module: [MODULE_ADMIN]
    })
    async getDepartment(
        @SessionUser() user: RequestUser,
    ) {
        return this.departmentService.getDepartments(user)
    }

    @Post('department')
    @ApiBody({ type: CreateDepartmentDto, description: 'Payload to create Department' })
    @ApiOperation({ summary: 'Create a new department' })
    @ApiPostResponse('Department created successfully')
    @Can({
        action: ACTION_CREATE,
        subject: SM_ADMIN.MASTER_TABLE_DEPARTMENT,
        module: [MODULE_ADMIN]
    })
    async createDepartment(
        @Body() createDepartmentDto: CreateDepartmentDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.departmentService.createDepartment( createDepartmentDto, user);
    }

    @Patch('department')
    @ApiBody({ type: UpdateDeptDto, description: 'Payload to update department'})
    @ApiOperation({ summary: 'Update a current department information' })
    @ApiPatchResponse('Department updated successfully')
    @Can({
        action: ACTION_UPDATE,
        subject: SM_ADMIN.MASTER_TABLE_DEPARTMENT,
        module: [MODULE_ADMIN],
    })
    async updateDept(
        @Body() updateDeptInfoDto: UpdateDeptDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.departmentService.updateDept( updateDeptInfoDto, user)
    }

    @Patch('department/deactivate')
    @ApiBody({ type: DeactivateDepartmentDto, description: 'Payload to deactivate department' })
    @ApiOperation({ summary: 'Deactivate a department' })
    @ApiDeactivateResponse('Department deactivated successfully')
    @Can({
        action: ACTION_UPDATE,
        subject: SM_ADMIN.MASTER_TABLE_DEPARTMENT,
        module: [MODULE_ADMIN],
    })
    async deactivateDept(
        @Body() deactivateDepartmentDto: DeactivateDepartmentDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.departmentService.deactivateDept( deactivateDepartmentDto, user )
    }

    @Patch('department/reactivate')
    @ApiBody({ type: ReactivateDepartmentDto, description: 'Payload to activate department'})
    @ApiOperation({ summary: 'Activate a department' })
    @ApiActivateResponse('Department activated successfully')
    @Can({
        action: ACTION_UPDATE,
        subject: SM_ADMIN.MASTER_TABLE_POSITION,
        module: [MODULE_ADMIN],
    })
    async reactivateDept(
        @Body() reactivateDepartmentDto: ReactivateDepartmentDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.departmentService.reactivateDept( reactivateDepartmentDto, user )
    }

    @Get('departments')
    @ApiOperation({ summary: 'Get department status' })
    @ApiGetResponse('Department status fetched succussfully')
    @Can({
        action: ACTION_READ,
        subject: SM_ADMIN.MASTER_TABLE_POSITION,
        module: [MODULE_ADMIN],
    })
    async departmentStat(
        @SessionUser() user: RequestUser,
        @Query('status') status?: string,
    ) {
        return this.departmentService.getDepartmentStatus(user, status);
    }
}
