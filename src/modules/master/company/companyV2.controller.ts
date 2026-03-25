import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Post,
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

import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';

import { CompanyService } from './company.service';

@ApiTags('Mastertable - Company')
@Controller({ path: 'mastertable', version: '2' })
export class CompanyControllerV2 {
  constructor(private companyService: CompanyService) {}

  //get all available companies
  @Get('companies')
  @ApiOperation({ summary: 'Get all companies' })
  @ApiGetResponse('List of companies retrieved')
  @Can({ action: ACTION_READ, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check in jwt strategy
  getCompanies(
    @SessionUser() user: RequestUser,
    @Query() dto: PaginationDto,
    // @Query('page') page = 1,
    // @Query('perPage') perPage = 10,
    // @Query('search') search?: string,
    // @Query('sortBy') sortBy: string = 'created_at',
    // @Query('order') order: 'asc' | 'desc' = 'asc',
  ) {
    return this.companyService.getCompanies(user, dto);
  }

  //get a single company
  @Get('companies/:companyId')
  @ApiOperation({ summary: 'Get a company' })
  @ApiGetResponse('Here is the company')
  @Can({ action: ACTION_READ, subject: MASTERTABLES })
  getCompany(
    @Param('companyId', new ParseUUIDPipe()) companyId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.companyService.getCompany(companyId, user);
  }

  @Post('companies')
  @ApiBody({ type: CreateCompanyDto, description: 'Payload to create company' })
  @ApiOperation({ summary: 'Create a new company' })
  @ApiPostResponse('Company created successfully')
  @Can({ action: ACTION_CREATE, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check in jwt strategy
  createCompany(
    @Body() createCompanyDto: CreateCompanyDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.companyService.createCompany(createCompanyDto, user);
  }

  @Put('companies/:companyId')
  @ApiBody({ type: UpdateCompanyDto, description: 'Payload to update company' })
  @ApiOperation({ summary: 'Update a current company information' })
  @ApiPatchResponse('Company updated successfully')
  @Can({ action: ACTION_UPDATE, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check in jwt strategy
  updateCompany(
    @Param('companyId', new ParseUUIDPipe()) companyId: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.companyService.updateCompany(companyId, updateCompanyDto, user);
  }
}
