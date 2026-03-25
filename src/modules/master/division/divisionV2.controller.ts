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
import { Can } from 'src/utils/decorators/can.decorator';
import {
  ACTION_CREATE,
  ACTION_READ,
  ACTION_UPDATE,
  MASTERTABLES,
} from 'src/utils/constants/ability.constant';

import { DivisionService } from './division.service';

import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';

import { CreateDivisionDto, UpdateDivisionDto } from './dto/division.dto';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';

@ApiTags('Mastertable - Division')
@Controller({ path: 'mastertable', version: '2' })
export class DivisionControllerV2 {
  constructor(private divisionService: DivisionService) {}

  //get all available divisions
  @Get('divisions')
  @ApiOperation({ summary: 'Get all divisions' })
  @ApiGetResponse('List of divisions retrieved')
  @Can({ action: ACTION_READ, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check in jwt strategy
  getDivisions(
    @SessionUser() user: RequestUser,
    @Query() dto: PaginationDto,
    // @Query('page') page = 1,
    // @Query('perPage') perPage = 10,
    // @Query('search') search?: string,
    // @Query('sortBy') sortBy: string = 'company_id',
    // @Query('order') order: 'asc' | 'desc' = 'asc',
  ) {
    return this.divisionService.getDivisions(user, dto);
  }

  //get selected division
  @Get('divisions/:divisionId')
  @ApiOperation({ summary: 'Get a division' })
  @ApiGetResponse('Here is the division')
  @Can({ action: ACTION_READ, subject: MASTERTABLES })
  getDivision(
    @Param('divisionId', new ParseUUIDPipe()) divisionId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.divisionService.getDivision(divisionId, user);
  }

  @Post('divisions')
  @ApiBody({
    type: CreateDivisionDto,
    description: 'Payload to create Division',
  })
  @ApiOperation({ summary: 'Create a new division' })
  @ApiPostResponse('Division created successfully')
  @Can({ action: ACTION_CREATE, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check in jwt strategy
  createDivision(
    @Body() createDivisionDto: CreateDivisionDto,
    @SessionUser() user: RequestUser,
  ) {
    console.log('createDivisionDto:', createDivisionDto);
    return this.divisionService.createDivision(createDivisionDto, user);
  }

  @Put('divisions/:divisionId')
  @ApiBody({
    type: UpdateDivisionDto,
    description: 'Payload to update division',
  })
  @ApiOperation({ summary: 'Update a current division information' })
  @ApiPatchResponse('Division updated successfully')
  @Can({ action: ACTION_UPDATE, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check in jwt strategy
  updateDivision(
    @Param('divisionId', new ParseUUIDPipe()) divisionId: string,
    @Body() updateDivisiionDto: UpdateDivisionDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.divisionService.updateDivision(
      divisionId,
      updateDivisiionDto,
      user,
    );
  }
}
