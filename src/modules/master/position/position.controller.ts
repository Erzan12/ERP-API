import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PositionService } from './position.service';
import {
  ApiGetResponse,
  ApiPatchResponse,
  ApiPostResponse,
} from 'src/components/helpers/swagger-response.helper';
import { Can } from 'src/components/decorators/can.decorator';
import { RequestUser } from 'src/components/types/request-user.interface';
import {
  ACTION_CREATE,
  ACTION_READ,
  ACTION_UPDATE,
  MASTERTABLES,
} from 'src/components/constants/ability.constant';
import { SessionUser } from 'src/components/decorators/session-user.decorator';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

@ApiBearerAuth('access-token')
@ApiTags('Mastertables')
@Controller('mastertables')
export class PositionController {
  constructor(private positionService: PositionService) {}

  //get all available positions
  @Get('positions')
  @ApiOperation({ summary: 'Get all positions' })
  @ApiGetResponse('List of positions retrieve')
  @Can({ action: ACTION_READ, subject: MASTERTABLES }) // sub_module is the subject and action is the permission, action is read,update,delete,create and submodule is Mastertables, Dashboard etc
  getPositions(@SessionUser() user: RequestUser) {
    return this.positionService.getPositions(user);
  }

  //get single position
  @Get('positions/:id')
  @ApiOperation({ summary: 'Get a position.' })
  @ApiGetResponse('Here is the position.')
  @Can({ action: ACTION_READ, subject: MASTERTABLES })
  getPosition(
    @Param('id', ParseIntPipe) id: number,
    @SessionUser() user: RequestUser,
  ) {
    return this.positionService.getPosition(id, user);
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

  @Put('positions/:id')
  @ApiBody({
    type: UpdatePositionDto,
    description: 'Payload to update Position information',
  })
  @ApiOperation({ summary: 'Update a current position information' })
  @ApiPatchResponse('Position updated successfully')
  @Can({ action: ACTION_UPDATE, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check in jwt strategy
  updatePosition(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePositionDto: UpdatePositionDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.positionService.updatePosition(
      id,
      updatePositionDto,
      user,
    );
  }
}
