import { Controller, Post, Body, Get, Patch } from '@nestjs/common';
import { EmploymentStatusService } from './employment_status.service';
import { Can } from '../../Components/decorators/can.decorator';
// import { ACTION_CREATE, ACTION_READ, ACTION_UPDATE, MODULE_ADMIN } from '../../Components/decorators/ability';
import { SM_ADMIN } from '../../Components/constants/core-constants';
import { SessionUser } from '../../Components/decorators/session-user.decorator';
import { CreateEmployeeStatusDto } from './dto/create-emp-stat.dto';
import { RequestUser } from '../../Components/types/request-user.interface';
import { UpdateEmpStatusDto } from './dto/update-emp-stat.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiGetResponse, ApiPatchResponse, ApiPostResponse } from 'src/Components/helpers/swagger-response.helper';
import { ACTION_READ, ACTION_UPDATE, MASTERTABLES } from 'src/Components/constants/ability.constant';

@ApiBearerAuth('access-token')
@ApiTags('Mastertables')
@Controller('Mmastertables')
export class EmploymentStatusController {
    constructor(private employmentStatusService: EmploymentStatusService) {}
  
    @Get()
    @ApiOperation({ summary: 'Get all employment status' })
    @ApiGetResponse('Here are the list of available employment status')
    @Can({ action: ACTION_READ, subject: MASTERTABLES })
    async getEmpStat(
        @SessionUser() user: RequestUser,
    )
    {
        return this.employmentStatusService.getEmpStat(user)
    }

    @Post()
    @ApiBody({ type: CreateEmployeeStatusDto, description: 'Payload to create employee status'})
    @ApiOperation({ summary: 'Create new employee status ' })
    @ApiPostResponse('Employee status created successfully')
    @Can ({ action: ACTION_READ, subject: MASTERTABLES })
    async createEmpStat(
        @Body() createEmpStat: CreateEmployeeStatusDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.employmentStatusService.createEmpStat(createEmpStat, user)
    }

    @Patch('edit')
    @ApiOperation({ summary: 'Updating employee status details' })
    @ApiPatchResponse('Employee status details updated successfully')
    @Can({ action: ACTION_UPDATE, subject: MASTERTABLES })
    async(
        @Body() updateEmpStatusDto: UpdateEmpStatusDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.employmentStatusService.updateEmpStat(updateEmpStatusDto,user)
    }
}
