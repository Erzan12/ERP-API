import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Put,
  Post,
  Get,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserLocationService } from '../user_location.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserLocationDto } from '../dto/create-user-location.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { Can } from 'src/utils/decorators/can.decorator';
import {
  ACTION_CREATE,
  ACTION_READ,
  ACTION_UPDATE,
  MASTERTABLES,
} from 'src/utils/constants/ability.constant';
import { ApiGetResponse, ApiPatchResponse, ApiPostResponse } from 'src/utils/helpers/swagger-response.helper';
import { UpdateUserLocationDto } from '../dto/update-user-location.dto';

@ApiBearerAuth('access-token') // matches the name used in .addBearerAuth()
@ApiTags('Masterstable - User Location')
@Controller({ path: 'masterstable', version: '2' })
export class UserLocationControllerV2 {
  constructor(private userLocationService: UserLocationService) {}

  @Get('user-locations')
  @ApiOperation({ summary: 'Get all user locations' })
  @ApiGetResponse('List of user locations available')
  @Can({ action: ACTION_READ, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check is jwt strategy
  getUserLocations(@SessionUser() user: RequestUser) {
    return this.userLocationService.getUserLocations(user);
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
    return this.userLocationService.createUserLocation(createUserLocationDto, user)
  }

  @Put('user-locations/:id')
  @ApiBody({
    type: UpdateUserLocationDto,
    description: 'Payload to update User Location information',
  })
  @ApiOperation({ summary: 'Update a current User Location information' })
  @ApiPatchResponse('User Location updated successfully')
  @Can({ action: ACTION_UPDATE, subject: MASTERTABLES })
  updateUserLocation(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserLocationDto:UpdateUserLocationDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.userLocationService.updateUserLocation(id, updateUserLocationDto, user);
  }
}
