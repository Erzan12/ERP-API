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
import { DivisionService } from './division.service';
import {
  ApiGetResponse,
  ApiPatchResponse,
  ApiPostResponse,
} from 'src/components/helpers/swagger-response.helper';
import { Can } from 'src/components/decorators/can.decorator';
import {
  ACTION_CREATE,
  ACTION_READ,
  ACTION_UPDATE,
  MASTERTABLES,
} from 'src/components/constants/ability.constant';
import { SessionUser } from 'src/components/decorators/session-user.decorator';
import { RequestUser } from 'src/components/types/request-user.interface';
import { CreateDivisionDto } from './dto/create-division.dto';
import { UpdateDivisionDto } from './dto/update-division.dto.';

@ApiBearerAuth('access-token') // matches the name used in .addBearerAuth()
@ApiTags('Mastertables')
@Controller('mastertables')
export class DivisionController {
  constructor(private divisionService: DivisionService) {}

  //get all available divisions
  @Get('divisions')
  @ApiOperation({ summary: 'Get all divisions' })
  @ApiGetResponse('List of divisions retrieved')
  @Can({ action: ACTION_READ, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check in jwt strategy
  getDivisions(@SessionUser() user: RequestUser) {
    return this.divisionService.getDivisions(user);
  }

  //get selected division
  @Get('divisions/:id')
  @ApiOperation({ summary: 'Get a division' })
  @ApiGetResponse('Here is the division')
  @Can({ action: ACTION_READ, subject: MASTERTABLES })
  getDivision(
    @Param('id', ParseIntPipe) id: number,
    @SessionUser() user: RequestUser,
  ) {
    return this.divisionService.getDivision(id, user);
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
    console.log('stat:', createDivisionDto.stat);
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
    @Param('divisionId', ParseIntPipe) divisionId: number,
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
