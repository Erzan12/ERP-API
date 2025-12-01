import { Body, Controller, Post, Patch, Query, Get } from '@nestjs/common';
import { PositionService } from './position/position.service';
// import { CreatePositionDto } from './position/dto/create-position.dto';
import { CreateDepartmentDto } from './department/dto/create-dept.dto';
import { RequestUser } from '../Components/types/request-user.interface';
import { DepartmentService } from './department/department.service';
import { SessionUser } from '../Components/decorators/session-user.decorator';
import { Can } from '../Components/decorators/can.decorator';
// import { ACTION_CREATE, ACTION_READ, ACTION_UPDATE, MODULE_ADMIN } from '../Components/decorators/ability';
// import { SM_ADMIN } from '../Components/constants/core-constants';
import { UpdateDepartmentDto } from './department/dto/update-dept.dto';
// import { UpdatePositionDto } from './position/dto/update-position.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger'; // <-- import these
import { ApiActivateResponse, ApiDeactivateResponse, ApiGetResponse, ApiPatchResponse, ApiPostResponse } from '../Components/helpers/swagger-response.helper';
import { CreateDivisionDto } from './division/dto/create-division.dto';
import { DivisionService } from './division/division.service';
import { UpdateDivisionDto } from './division/dto/update-division.dto.';
import { CreateCompanyDto } from './company/dto/create-company.dto';
import { CompanyService } from './company/company.service';
import { UpdateCompanyDto } from './company/dto/update-company.dto';
import { ACTION_CREATE, ACTION_READ, MASTERTABLES } from 'src/Components/constants/ability.constant';
import { Read } from 'src/Components/helpers/permission.helper';

@ApiBearerAuth('access-token') // matches the name used in .addBearerAuth()
@ApiTags('Mastertables')
@Controller('mastertables')
export class MasterController {
    constructor(private positionService: PositionService, private departmentService: DepartmentService, private divisionService: DivisionService, private companyService: CompanyService) {} 

    @Get('positions')
    @ApiOperation({ summary: 'Get all positions' })
    @ApiGetResponse('List of positions retrieve')
    @Can({ action: ACTION_READ, subject: MASTERTABLES }) // sub_module is the subject and action is the permission, action is read,update,delete,create and submodule is Mastertables, Dashboard etc
    async getPosition(
        @SessionUser() user: RequestUser,
    ) {
        return this.positionService.getPositions( user );
    }

    @Get('departments')
    @ApiOperation({ summary: 'Get all departments' })
    @ApiGetResponse('List of departments retrieved')
    // @Can({ action: ACTION_READ, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check in jwt strategy
    @Read(MASTERTABLES)
    async getDepartment(
        @SessionUser() user: RequestUser,
    ) {
        return this.departmentService.getDepartments(user)
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

    @Patch('departments')
    @ApiBody({ type: UpdateDepartmentDto, description: 'Payload to update department'})
    @ApiOperation({ summary: 'Update a current department information' })
    @ApiPatchResponse('Department updated successfully')
    @Can({ action: 'update', subject: 'Mastertables' }) // ---> action is permission; subject is submodule; role is check in jwt strategy
    async updateDept(
        @Body() updateDeptDto: UpdateDepartmentDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.departmentService.updateDept( updateDeptDto, user)
    }

    @Get('divisions')
    @ApiOperation({ summary: 'Get all divisions'})
    @ApiGetResponse('List of divisions retrieved')
    @Can({ action: 'read', subject: 'Mastertables' }) // ---> action is permission; subject is submodule; role is check in jwt strategy
    async getDivision(
        @SessionUser() user: RequestUser,
    ) {
        return this.divisionService.getDivisions(user)
    }

    @Post('divisions')
    @ApiBody({ type: CreateDivisionDto, description: 'Payload to create Division'})
    @ApiOperation({ summary: 'Create a new division' })
    @ApiPostResponse('Division created successfully')
    @Can({ action: 'create', subject: 'Mastertables' }) // ---> action is permission; subject is submodule; role is check in jwt strategy
    async createDivision(
        @Body() createDivisionDto: CreateDivisionDto,
        @SessionUser() user: RequestUser,
    ) {
        console.log('createDivisionDto:', createDivisionDto);
        console.log('stat:', createDivisionDto.stat);
        return this.divisionService.createDivision( createDivisionDto,user);
    }

    @Patch('divisions')
    @ApiBody({ type: UpdateDivisionDto, description: 'Payload to update division'})
    @ApiOperation({ summary: 'Update a current division information' })
    @ApiPatchResponse('Division updated successfully')
    @Can({ action: 'update', subject: 'Mastertables' }) // ---> action is permission; subject is submodule; role is check in jwt strategy
    async updateDivision(
        @Body() updateDivisiionDto: UpdateDivisionDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.divisionService.updateDivision( updateDivisiionDto, user)
    }

    @Get('companies')
    @ApiOperation({ summary: 'Get all departments' })
    @ApiGetResponse('List of companies retrieved')
    @Can({ action: 'read', subject: 'Mastertables' }) // ---> action is permission; subject is submodule; role is check in jwt strategy
    async getCompany(
        @SessionUser() user: RequestUser,
    ) {
        return this.companyService.getCompanies(user)
    }

    @Post('companies')
    @ApiBody({ type: CreateCompanyDto, description: 'Payload to create company'})
    @ApiOperation({ summary: 'Create a new company'})
    @ApiPostResponse('Company created successfully')
    @Can({ action: 'create', subject: 'Mastertables' }) // ---> action is permission; subject is submodule; role is check in jwt strategy
    async createCompany(
        @Body() createCompanyDto: CreateCompanyDto,
        @SessionUser() user: RequestUser,
    ) {
        console.log('createCompanyDto:', createCompanyDto.name);
        console.log('stat:', createCompanyDto.stat);
        return this.companyService.createCompany(createCompanyDto,user);
    }

    @Patch('companies')
    @ApiBody({ type: UpdateCompanyDto, description: 'Payload to update company'})
    @ApiOperation({ summary: 'Update a current company information'})
    @ApiPatchResponse('Company updated successfully')
    @Can({ action: 'update', subject: 'Mastertables' }) // ---> action is permission; subject is submodule; role is check in jwt strategy
    async updateCompany(
        @Body() updateCompanyDto: UpdateCompanyDto,
        @SessionUser() user: RequestUser,
    ) {
        console.log('updateCompanyDto:', updateCompanyDto.name);
        console.log('stat:', updateCompanyDto.stat);
        return this.companyService.updateCompany(updateCompanyDto,user);
    }
}
