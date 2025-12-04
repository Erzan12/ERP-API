import { Body, Controller, Post, Patch, Query, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PositionService } from './position/position.service';
import { CreateDepartmentDto } from './department/dto/create-dept.dto';
import { RequestUser } from '../Components/types/request-user.interface';
import { DepartmentService } from './department/department.service';
import { SessionUser } from '../Components/decorators/session-user.decorator';
import { Can } from '../Components/decorators/can.decorator';
import { UpdateDepartmentDto } from './department/dto/update-dept.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger'; // <-- import these
import { ApiActivateResponse, ApiDeactivateResponse, ApiGetResponse, ApiPatchResponse, ApiPostResponse } from '../Components/helpers/swagger-response.helper';
import { CreateDivisionDto } from './division/dto/create-division.dto';
import { DivisionService } from './division/division.service';
import { UpdateDivisionDto } from './division/dto/update-division.dto.';
import { CreateCompanyDto } from './company/dto/create-company.dto';
import { CompanyService } from './company/company.service';
import { UpdateCompanyDto } from './company/dto/update-company.dto';
import { ACTION_CREATE, ACTION_READ, ACTION_UPDATE, MASTERTABLES } from 'src/Components/constants/ability.constant';
import { CreatePositionDto } from './position/dto/create-position.dto';
import { UpdatePositionDto } from './position/dto/update-position.dto';
import { EmploymentStatusService } from './employment_status/employment_status.service';
import { CreateEmployeeStatusDto } from './employment_status/dto/create-emp-stat.dto';
import { UpdateEmpStatusDto } from './employment_status/dto/update-emp-stat.dto';

@ApiBearerAuth('access-token') // matches the name used in .addBearerAuth()
@ApiTags('Mastertables')
@Controller('mastertables')
export class MasterController {
    constructor(private positionService: PositionService, private departmentService: DepartmentService, private divisionService: DivisionService, private companyService: CompanyService, private employmentStatusService: EmploymentStatusService) {} 

    //get all available positions
    @Get('positions')
    @ApiOperation({ summary: 'Get all positions' })
    @ApiGetResponse('List of positions retrieve')
    @Can({ action: ACTION_READ, subject: MASTERTABLES }) // sub_module is the subject and action is the permission, action is read,update,delete,create and submodule is Mastertables, Dashboard etc
    async getAllPositions(
        @SessionUser() user: RequestUser,
    ) {
        return this.positionService.getAllPositions(user);
    }

    //get single position
    @Get('positions/:positionId')
    @ApiOperation({ summary: 'Get a position.'})
    @ApiGetResponse('Here is the position.')
    @Can({ action: ACTION_READ, subject: MASTERTABLES })
    async getPosition(
        @Param('positionId', ParseIntPipe) positionId: number,
        @SessionUser() user: RequestUser,
    ) {
        return this.positionService.getPosition(positionId, user)
    }

    @Post('positions')
    @ApiBody({ type: CreatePositionDto, description: 'Payload to create Position'})
    @ApiOperation({ summary: 'Create a new position' })
    @ApiPostResponse('Position created successfully')
    @Can({ action: ACTION_CREATE, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check in jwt strategy
    async createPosition(
        @Body() createPositionDto: CreatePositionDto, 
        @SessionUser() user: RequestUser,
    ) {
        console.log('createPositionDto:', createPositionDto);
        console.log('stat:', createPositionDto.stat);
        return this.positionService.createPosition( createPositionDto, user);
    }

    @Patch('positions/:positionId')
    @ApiBody({ type: UpdatePositionDto, description: 'Payload to update Position Info'})
    @ApiOperation({ summary: 'Update a current position information'})
    @ApiPatchResponse('Position updated successfully')
    @Can({ action: ACTION_UPDATE, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check in jwt strategy
    async updatePositionInfo(
        @Param('positionId', ParseIntPipe) positionId: number,
        @Body() updatePositionDto: UpdatePositionDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.positionService.updatePosition( positionId, updatePositionDto, user);
    }

    //get all departments
    @Get('departments')
    @ApiOperation({ summary: 'Get all departments' })
    @ApiGetResponse('List of departments retrieved')
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

    //get all available divisions
    @Get('divisions')
    @ApiOperation({ summary: 'Get all divisions'})
    @ApiGetResponse('List of divisions retrieved')
    @Can({ action: ACTION_READ, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check in jwt strategy
    async getAllDivisions(
        @SessionUser() user: RequestUser,
    ) {
        return this.divisionService.getAllDivisions(user)
    }

    //get selected division
    @Get('divisions/:divisionId')
    @ApiOperation({ summary: 'Get a division'})
    @ApiGetResponse('Here is the division')
    @Can({ action: ACTION_READ, subject: MASTERTABLES })
    async getDivision(
        @Param('divisionId', ParseIntPipe) divisionId: number,
        @SessionUser() user: RequestUser,
    ) {
        return this.divisionService.getDivision(divisionId,user)
    }

    @Post('divisions')
    @ApiBody({ type: CreateDivisionDto, description: 'Payload to create Division'})
    @ApiOperation({ summary: 'Create a new division' })
    @ApiPostResponse('Division created successfully')
    @Can({ action: ACTION_CREATE, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check in jwt strategy
    async createDivision(
        @Body() createDivisionDto: CreateDivisionDto,
        @SessionUser() user: RequestUser,
    ) {
        console.log('createDivisionDto:', createDivisionDto);
        console.log('stat:', createDivisionDto.stat);
        return this.divisionService.createDivision( createDivisionDto,user);
    }

    @Patch('divisions/:divisionId')
    @ApiBody({ type: UpdateDivisionDto, description: 'Payload to update division'})
    @ApiOperation({ summary: 'Update a current division information' })
    @ApiPatchResponse('Division updated successfully')
    @Can({ action: ACTION_UPDATE, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check in jwt strategy
    async updateDivision(
        @Param('divisionId', ParseIntPipe) divisionId:number,
        @Body() updateDivisiionDto: UpdateDivisionDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.divisionService.updateDivision( divisionId, updateDivisiionDto, user)
    }

    //get all available companies
    @Get('companies')
    @ApiOperation({ summary: 'Get all departments' })
    @ApiGetResponse('List of companies retrieved')
    @Can({ action: ACTION_READ, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check in jwt strategy
    async getAllCompany(
        @SessionUser() user: RequestUser,
    ) {
        return this.companyService.getAllCompany(user)
    }

    //get a single company
    @Get('company/:companyId')
    @ApiOperation({ summary: 'Get a company'})
    @ApiGetResponse('Here is the company')
    @Can({ action: ACTION_READ, subject: MASTERTABLES })
    async getCompany(
        @Param('companyId', ParseIntPipe) companyId: number,
        @SessionUser() user: RequestUser,
    ) {
        return this.companyService.getCompany(companyId,user);
    }

    @Post('companies')
    @ApiBody({ type: CreateCompanyDto, description: 'Payload to create company'})
    @ApiOperation({ summary: 'Create a new company'})
    @ApiPostResponse('Company created successfully')
    @Can({ action: ACTION_CREATE, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check in jwt strategy
    async createCompany(
        @Body() createCompanyDto: CreateCompanyDto,
        @SessionUser() user: RequestUser,
    ) {
        // console.log('createCompanyDto:', createCompanyDto.name);
        // console.log('stat:', createCompanyDto.stat);
        return this.companyService.createCompany(createCompanyDto,user);
    }

    @Patch('companies/:companyId')
    @ApiBody({ type: UpdateCompanyDto, description: 'Payload to update company'})
    @ApiOperation({ summary: 'Update a current company information'})
    @ApiPatchResponse('Company updated successfully')
    @Can({ action: ACTION_UPDATE, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check in jwt strategy
    async updateCompany(
        @Param('companyId', ParseIntPipe) companyId: number,
        @Body() updateCompanyDto: UpdateCompanyDto,
        @SessionUser() user: RequestUser,
    ) {
        console.log('updateCompanyDto:', updateCompanyDto.name);
        console.log('stat:', updateCompanyDto.stat);
        return this.companyService.updateCompany(companyId,updateCompanyDto,user);
    }

    //get all employment_status
    @Get('employment_status/')
    @ApiOperation({ summary: 'Get all employment status' })
    @ApiGetResponse('Here are the list of available employment status')
    @Can({ action: ACTION_READ, subject: MASTERTABLES })
    async getEmpStat(
        @SessionUser() user: RequestUser,
    )
    {
        return this.employmentStatusService.getEmpStat(user)
    }

    //get only one employment_status
    @Get('employment_status/:employmentStatusId')
    @ApiOperation({ summary: 'Get an employment status.' })
    @ApiGetResponse('Here is the employment status.')
    @Can({ action: ACTION_READ, subject: MASTERTABLES })
    async getEmpStatus(
        @Param('employmentStatusId', ParseIntPipe) employmentStatusId: number,
        @SessionUser() user: RequestUser,
    ) {
        return this.employmentStatusService.getEmpStatus(employmentStatusId, user)
    }

    @Post('employment_status/')
    @ApiBody({ type: CreateEmployeeStatusDto, description: 'Payload to create employee status.'})
    @ApiOperation({ summary: 'Create new employee status.' })
    @ApiPostResponse('Employee status created successfully.')
    @Can ({ action: ACTION_READ, subject: MASTERTABLES })
    async createEmpStat(
        @Body() createEmpStat: CreateEmployeeStatusDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.employmentStatusService.createEmpStat(createEmpStat, user)
    }

    @Patch('employment_status/update/:employmentStatusId')
    @ApiOperation({ summary: 'Updating employee status details.' })
    @ApiPatchResponse('Employee status details updated successfully.')
    @Can({ action: ACTION_UPDATE, subject: MASTERTABLES })
    async(
        @Param('employmentStatusId', ParseIntPipe) employmentStatusId: number,
        @Body() updateEmpStatusDto: UpdateEmpStatusDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.employmentStatusService.updateEmpStat(employmentStatusId, updateEmpStatusDto, user)
    }
}
