import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Post,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DivisionService } from '../division.service';
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
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { CreateDivisionDto } from '../dto/create-division.dto';
import { UpdateDivisionDto } from '../dto/update-division.dto.';

@ApiBearerAuth('access-token') // matches the name used in .addBearerAuth()
@ApiTags('Masterstable - Division')
@Controller({path:'masterstable',version:'1'})
export class DivisionControllerV1 {
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
    @Param('id', new ParseUUIDPipe) id: string,
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

  @Put('divisions/:id')
  @ApiBody({
    type: UpdateDivisionDto,
    description: 'Payload to update division',
  })
  @ApiOperation({ summary: 'Update a current division information' })
  @ApiPatchResponse('Division updated successfully')
  @Can({ action: ACTION_UPDATE, subject: MASTERTABLES }) // ---> action is permission; subject is submodule; role is check in jwt strategy
  updateDivision(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateDivisiionDto: UpdateDivisionDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.divisionService.updateDivision(
      id,
      updateDivisiionDto,
      user,
    );
  }
}
