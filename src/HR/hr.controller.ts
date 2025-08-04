import { Controller, Get } from '@nestjs/common';
import {
    MODULE_HR,
    ACTION_READ,
    ACTION_CREATE
} from '../Components/decorators/ability';
import { Can } from '../Components/decorators/can.decorator';
import { SM_HR } from '../Components/constants/core-constants';
import { SessionUser } from '../Components/decorators/session-user.decorator';
import { RequestUser } from '../Components/types/request-user.interface';
import { HrService } from './hr.service';
import { EmployeeService } from './employee/employee.service';

@Controller('hr')
export class HrController {

    constructor(private hrService: HrService, private readonly employeeService: EmployeeService) {}
    //sample path for each submodules employee_masterlist->retrievelistofemployees->action: view,add,edit,delete->retrievesingledocument->action: view,add,edit,delete
    @Get()
    @Can({
        action: ACTION_READ,
        subject: SM_HR.DASHBOARD,
        module: [MODULE_HR],
    })
    getHRDashBoard(
        @SessionUser() user: RequestUser,
    ) {
        return this.hrService.getHRDashboard(user)
    }

    @Get('employees')
    @Can({
            action: ACTION_CREATE,
            subject: SM_HR.EMPLOYEE_MASTERLIST,
            module: [MODULE_HR]
    })
    async getEmployees(
        @SessionUser() user: RequestUser,
    ) {
        return this.employeeService.getEmployeeMasterlist(user)
    }

    @Get('recruitment')
    @Can({
        action: ACTION_READ,
        subject: SM_HR.RECRUITMENT,
        module: [MODULE_HR],
    })
    getRecruitment() {
        return { message: 'hr recruitement'};
    }

    @Get('action_memos')
    @Can({
        action: ACTION_READ,
        subject: SM_HR.ACTION_MEMOS,
        module: [MODULE_HR],
    })
    getActionMem() {
        return { message: 'hr action memos' }
    }

    @Get('crew_movements')
    @Can({
        action: ACTION_READ,
        subject: SM_HR.CREW_MOVEMENTS,
        module: [MODULE_HR],
    })
    getCrewMove() {
        return { message: 'hr crew movements' }
    }

    @Get('awol_cases')
    @Can({
        action: ACTION_READ,
        subject: SM_HR.AWOL_CASE,
        module: [MODULE_HR],
    })
    getAwolCase() {
        return { message: 'hr AWOL Case' }
    }

    @Get('employee_relation')
    @Can({
        action: ACTION_READ,
        subject: SM_HR.EMPLOYEE_RELATION,
        module: [MODULE_HR],
    })
    getEmpRelCase() {
        return { message: 'hr employee relation' }
    }

    @Get('leave_application')
    @Can({
        action: ACTION_READ,
        subject: SM_HR.LEAVE_APPLICATION,
        module: [MODULE_HR],
    })
    getLeaveApp() {
        return { message: 'hr leave application' }
    }

    @Get()
    @Can({
        action: ACTION_READ,
        subject: SM_HR.OT_APPLICATION,
        module: [MODULE_HR],
    })
    getOTApp() {
        return { message: 'hr OT Applications' }
    }

    @Get()
    @Can({
        action: ACTION_READ,
        subject: SM_HR.UT_APPLICATION,
        module: [MODULE_HR],
    })
    getUTApp() {
        return { message: 'hr UT Applications' }
    }

    @Get()
    @Can({
        action: ACTION_READ,
        subject: SM_HR.OB_APPLICATION,
        module: [MODULE_HR],
    })
    getOBApp() {
        return { message: 'hr OB Applications' }
    }
    
    @Get()
    @Can({
        action: ACTION_READ,
        subject: SM_HR.OB_APPLICATION,
        module: [MODULE_HR],
    })
    getOJTTrainees() {
        return { message: 'hr On-The-Job Trainees' }
    }

    @Get()
    @Can({
        action: ACTION_READ,
        subject: SM_HR.PERFORMANCE_EVALUATION,
        module: [MODULE_HR],
    })
    getPerEval() {
        return { message: 'hr Performance Evaluations' }
    }

    @Get()
    @Can({
        action: ACTION_READ,
        subject: SM_HR.BULLETIN,
        module: [MODULE_HR],
    })
    getBulletin() {
        return { message: 'hr Bulletin' }
    }

    @Get()
    @Can({
        action: ACTION_READ,
        subject: SM_HR.VACCINE_CARD,
        module: [MODULE_HR],
    })
    getVaccine() {
        return { message: 'hr Vaccine Card' }
    }

    @Get()
    @Can({
        action: ACTION_READ,
        subject: SM_HR.ORG_CHART,
        module: [MODULE_HR],
    })
    getOrgChart() {
        return { message: 'hr Organization Chart' }
    }

    @Get()
    @Can({
        action: ACTION_READ,
        subject: SM_HR.INCIDENT_REPORTS,
        module: [MODULE_HR],
    })
    getIncidentRep() {
        return { message: 'hr Incident Reports' }
    }

    @Get()
    @Can({
        action: ACTION_READ,
        subject: SM_HR.HR_REPORTS,
        module: [MODULE_HR],
    })
    getHRreport() {
        return { message: 'hr HR Reports' }
    }
}

