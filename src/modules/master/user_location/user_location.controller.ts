import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
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

  @Get('user_locations')
  @ApiOperation({ summary: 'Get all user locations' })
  @ApiGetResponse('List of user locations available')
  @Can({ action: ACTION_READ, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check is jwt strategy
  async getAllUserLocations(@SessionUser() user: RequestUser) {
    return this.userLocationService.getAllUserLocations(user);
  }
}
