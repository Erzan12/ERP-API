import { Controller, Post, Body, Get, Patch } from '@nestjs/common';
import { EmploymentStatusService } from './employment_status.service';
import { Can } from '../../Components/decorators/can.decorator';
import { ACTION_CREATE, ACTION_READ, ACTION_UPDATE, MODULE_ADMIN } from '../../Components/decorators/ability';
import { SM_ADMIN } from '../../Components/constants/core-constants';
import { SessionUser } from '../../Components/decorators/session-user.decorator';
import { EmpStatusDto } from './dto/create-emp-stat.dto';
import { RequestUser } from '../../Components/types/request-user.interface';
import { UpdateEmpStatusDto } from './dto/update-emp-stat.dto';

@Controller('employment_status')
export class EmploymentStatusController {
    constructor(private employmentStatusService: EmploymentStatusService) {}
  
    @Get()
    @Can({
        action: ACTION_READ,
        subject: SM_ADMIN.EMP_STATUS,
        module: [MODULE_ADMIN]
    })
    async getEmpStat(
        @SessionUser() user: RequestUser,
    )
    {
        return this.employmentStatusService.getEmpStat(user)
    }

    @Post()
    @Can({
        action: ACTION_CREATE,
        subject: SM_ADMIN.EMP_STATUS,
        module: [MODULE_ADMIN]
    })
    async createEmpStat(
        @Body() createEmpStat: EmpStatusDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.employmentStatusService.createEmpStat(createEmpStat, user)
    }

    @Patch()
    @Can({
        action: ACTION_UPDATE,
        subject: SM_ADMIN.EMP_STATUS,
        module: [MODULE_ADMIN],
    })
    async(
        @Body() updateEmpStatusDto: UpdateEmpStatusDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.employmentStatusService.updateEmpStat(updateEmpStatusDto,user)
    }
}
