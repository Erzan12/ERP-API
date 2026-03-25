import {
  Body,
  Controller,
  Param,
  Put,
  Post,
  Get,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { UserLocationService } from './user_location.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateUserLocationDto,
  UpdateUserLocationDto,
} from './dto/user-location.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { Can } from 'src/utils/decorators/can.decorator';
import {
  ACTION_CREATE,
  ACTION_READ,
  ACTION_UPDATE,
  MASTERTABLES,
} from 'src/utils/constants/ability.constant';
import {
  ApiGetResponse,
  ApiPatchResponse,
  ApiPostResponse,
} from 'src/utils/helpers/swagger-response.helper';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';

@ApiTags('Mastertable - User Location')
@Controller({ path: 'mastertable', version: '2' })
export class UserLocationControllerV2 {
  constructor(private userLocationService: UserLocationService) {}

  @Get('user-locations')
  @ApiOperation({ summary: 'Get all user locations' })
  @ApiGetResponse('List of user locations available')
  @Can({ action: ACTION_READ, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check is jwt strategy
  getUserLocations(
    @SessionUser() user: RequestUser,
    @Query() dto: PaginationDto,
    // @Query('page') page = 1,
    // @Query('perPage') perPage = 10,
    // @Query('search') search?: string,
    // @Query('sortBy') sortBy: string = 'created_at',
    // @Query('order') order: 'asc' | 'desc' = 'asc',
  ) {
    return this.userLocationService.getUserLocations(user, dto);
  }

  @Get('user-locations/:userLocationId')
  @ApiOperation({ summary: 'Get a user locations' })
  @ApiGetResponse('Here is the user location')
  @Can({ action: ACTION_READ, subject: MASTERTABLES })
  getUserLocation(
    @Param('userLocationId', new ParseUUIDPipe()) userLocationId: string,
    @SessionUser() user: RequestUser,
  ) {
    return this.userLocationService.getUserLocation(userLocationId, user);
  }

  @Post('user-locations')
  @ApiBody({
    type: CreateUserLocationDto,
    description: 'Payload to create User Location',
  })
  @ApiOperation({ summary: 'Create a User Location' })
  @ApiPostResponse('User Location has been created successfully')
  @Can({ action: ACTION_CREATE, subject: MASTERTABLES })
  createUserLocation(
    @Body() createUserLocationDto: CreateUserLocationDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.userLocationService.createUserLocation(
      createUserLocationDto,
      user,
    );
  }

  @Put('user-locations/:userLocationId')
  @ApiBody({
    type: UpdateUserLocationDto,
    description: 'Payload to update User Location information',
  })
  @ApiOperation({ summary: 'Update a current User Location information' })
  @ApiPatchResponse('User Location updated successfully')
  @Can({ action: ACTION_UPDATE, subject: MASTERTABLES })
  updateUserLocation(
    @Param('userLocationId', new ParseUUIDPipe()) userLocationId: string,
    @Body() updateUserLocationDto: UpdateUserLocationDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.userLocationService.updateUserLocation(
      userLocationId,
      updateUserLocationDto,
      user,
    );
  }
}
