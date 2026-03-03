import { Controller, Param, Get, ParseUUIDPipe, Query } from '@nestjs/common';
import { UserLocationService } from '../user_location.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { Can } from 'src/utils/decorators/can.decorator';
import {
  ACTION_READ,
  MASTERTABLES,
} from 'src/utils/constants/ability.constant';
import { ApiGetResponse } from 'src/utils/helpers/swagger-response.helper';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';

@ApiBearerAuth('access-token') // matches the name used in .addBearerAuth()
@ApiTags('Mastertable - User Location')
@Controller({ path: 'mastertable', version: '1' })
export class UserLocationControllerV1 {
  constructor(private userLocationService: UserLocationService) {}

  @Get('user-locations')
  @ApiOperation({ summary: 'Get all user locations' })
  @ApiGetResponse('List of user locations available')
  @Can({ action: ACTION_READ, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check is jwt strategy
  getUserLocations(
    @SessionUser() user: RequestUser,
    @Query() dto: PaginationDto,
    @Query('page') page = 1,
    @Query('perPage') perPage = 10,
    @Query('search') search?: string,
    @Query('sortBy') sortBy: string = 'created_at',
    @Query('order') order: 'asc' | 'desc' = 'asc',
  ) {
    return this.userLocationService.getUserLocations(user, dto);
  }

  @Get('user-locations/:id')
  @ApiOperation({ summary: 'Get a user locations' })
  @ApiGetResponse('Here is the user location')
  @Can({ action: ACTION_READ, subject: MASTERTABLES })
  getUserLocation(
    @Param('id', new ParseUUIDPipe()) id: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.userLocationService.getUserLocation(id, user);
  }
}
