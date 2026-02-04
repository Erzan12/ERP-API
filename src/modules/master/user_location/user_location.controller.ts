import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Put,
  Post,
  Get,
} from '@nestjs/common';
import { UserLocationService } from './user_location.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserLocationDto } from './dto/create-user-location.dto';
import { RequestUser } from 'src/components/types/request-user.interface';
import { SessionUser } from 'src/components/decorators/session-user.decorator';
import { Can } from 'src/components/decorators/can.decorator';
import {
  ACTION_CREATE,
  ACTION_READ,
  ACTION_UPDATE,
  MASTERTABLES,
} from 'src/components/constants/ability.constant';
import { ApiGetResponse } from 'src/components/helpers/swagger-response.helper';

@ApiBearerAuth('access-token') // matches the name used in .addBearerAuth()
@ApiTags('Mastertables')
@Controller('mastertables')
export class UserLocationController {
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
    @Param('id', ParseIntPipe) id: number,
    @SessionUser() user: RequestUser,
) {
  return this.userLocationService.getUserLocation(id,user)
}
}
