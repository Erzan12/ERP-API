import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
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
  async getAllPositions(@SessionUser() user: RequestUser) {
    return this.positionService.getAllPositions(user);
  }

  //get single position
  @Get('positions/:positionId')
  @ApiOperation({ summary: 'Get a position.' })
  @ApiGetResponse('Here is the position.')
  @Can({ action: ACTION_READ, subject: MASTERTABLES })
  async getPosition(
    @Param('positionId', ParseIntPipe) positionId: number,
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
  async createPosition(
    @Body() createPositionDto: CreatePositionDto,
    @SessionUser() user: RequestUser,
  ) {
    console.log('createPositionDto:', createPositionDto);
    console.log('stat:', createPositionDto.stat);
    return this.positionService.createPosition(createPositionDto, user);
  }

  @Patch('positions/:positionId')
  @ApiBody({
    type: UpdatePositionDto,
    description: 'Payload to update Position information',
  })
  @ApiOperation({ summary: 'Update a current position information' })
  @ApiPatchResponse('Position updated successfully')
  @Can({ action: ACTION_UPDATE, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check in jwt strategy
  async updatePositionInfo(
    @Param('positionId', ParseIntPipe) positionId: number,
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
