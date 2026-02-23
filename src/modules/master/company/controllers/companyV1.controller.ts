import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Post,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ACTION_CREATE,
  ACTION_READ,
  ACTION_UPDATE,
  MASTERTABLES,
} from 'src/utils/constants/ability.constant';
import { Can } from 'src/utils/decorators/can.decorator';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import {
  ApiGetResponse,
  ApiPatchResponse,
  ApiPostResponse,
} from 'src/utils/helpers/swagger-response.helper';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { CompanyService } from '../company.service';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';

@ApiBearerAuth('access-token')
@ApiTags('Masterstable - Company')
@Controller({ path: 'masterstable', version: '1' })
export class CompanyControllerV1 {
  constructor(private companyService: CompanyService) {}

  //get all available companies
  @Get('companies')
  @ApiOperation({ summary: 'Get all companies' })
  @ApiGetResponse('List of companies retrieved')
  @Can({ action: ACTION_READ, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check in jwt strategy
  getCompanies(@SessionUser() user: RequestUser) {
    return this.companyService.getCompanies(user);
  }

  //get a single company
  @Get('companies/:id')
  @ApiOperation({ summary: 'Get a company' })
  @ApiGetResponse('Here is the company')
  @Can({ action: ACTION_READ, subject: MASTERTABLES })
  getCompany(
    @Param('id', new ParseUUIDPipe()) id: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.companyService.getCompany(id, user);
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

  @Put('companies/:id')
  @ApiBody({ type: UpdateCompanyDto, description: 'Payload to update company' })
  @ApiOperation({ summary: 'Update a current company information' })
  @ApiPatchResponse('Company updated successfully')
  @Can({ action: ACTION_UPDATE, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check in jwt strategy
  updateCompany(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.companyService.updateCompany(id, updateCompanyDto, user);
  }
}
