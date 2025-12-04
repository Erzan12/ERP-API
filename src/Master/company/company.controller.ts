import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { ACTION_CREATE, ACTION_READ, ACTION_UPDATE, MASTERTABLES } from 'src/Components/constants/ability.constant';
import { Can } from 'src/Components/decorators/can.decorator';
import { SessionUser } from 'src/Components/decorators/session-user.decorator';
import { ApiGetResponse, ApiPatchResponse, ApiPostResponse } from 'src/Components/helpers/swagger-response.helper';
import { RequestUser } from 'src/Components/types/request-user.interface';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('company')
export class CompanyController {
    constructor (private companyService: CompanyService) {}
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
}
