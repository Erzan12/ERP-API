import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiLoginResponse } from 'src/utils/helpers/swagger-response.helper';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';

@ApiBearerAuth('access-token')
@ApiTags('Administrator - User Access')
@Controller({ path: 'administrator', version: '2' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/user-access/:id')
  @ApiOperation({ summary: 'Verify user' })
  @ApiLoginResponse('User has been verified')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  verify(
    @SessionUser() requestUser: RequestUser,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.userService.getUser(requestUser, id);
  }
}
