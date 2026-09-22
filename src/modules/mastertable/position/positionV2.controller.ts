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

import { RequestUser } from 'src/utils/types/request-user.interface';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';

import { CreatePositionDto, UpdatePositionDto } from './dto/position.dto';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';

import { PositionService } from './position.service';

// @ApiCookieAuth('access-token')
@ApiTags('Mastertable - Position')
@Controller({ path: 'mastertable', version: '2' })
export class PositionControllerV2 {
  constructor(private positionService: PositionService) {}

  //get all available positions
  @Get('positions')
  @ApiOperation({ summary: 'Get all positions' })
  @ApiGetResponse('List of positions retrieve')
  @Can({ action: ACTION_READ, subject: MASTERTABLES }) // sub_module is the subject and action is the permission, action is read,update,delete,create and submodule is Mastertables, Dashboard etc
  getPositions(
    @SessionUser() user: RequestUser,
    @Query() dto: PaginationDto,
    // @Query('page') page = 1,
    // @Query('perPage') perPage = 10,
    // @Query('search') search?: string,
    // @Query('sortBy') sortBy: string = 'created_at',
    // @Query('order') order: 'asc' | 'desc' = 'asc',
  ) {
    return this.positionService.getPositions(user, dto);
  }

  //get single position
  @Get('positions/:positionId')
  @ApiOperation({ summary: 'Get a position.' })
  @ApiGetResponse('Here is the position.')
  @Can({ action: ACTION_READ, subject: MASTERTABLES })
  getPosition(
    @Param('positionId', new ParseUUIDPipe()) positionId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.positionService.getPosition(positionId, user);
  }

  @Post('positions')
  @ApiBody({
    type: CreatePositionDto,
    description: 'Payload to create Position',
  })
  @ApiOperation({ summary: 'Create a new position' })
  @ApiPostResponse('Position created successfully')
  @Can({ action: ACTION_CREATE, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check in jwt strategy
  createPosition(
    @Body() createPositionDto: CreatePositionDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.positionService.createPosition(createPositionDto, user);
  }

  @Put('positions/:positionId')
  @ApiBody({
    type: UpdatePositionDto,
    description: 'Payload to update Position information',
  })
  @ApiOperation({ summary: 'Update a current position information' })
  @ApiPatchResponse('Position updated successfully')
  @Can({ action: ACTION_UPDATE, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check in jwt strategy
  updatePosition(
    @Param('positionId', new ParseUUIDPipe()) positionId: string,
    @Body() updatePositionDto: UpdatePositionDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.positionService.updatePosition(
      positionId,
      updatePositionDto,
      user,
    );
  }
}
