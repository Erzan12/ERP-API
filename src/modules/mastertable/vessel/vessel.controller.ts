import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { VesselService } from './vessel.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiGetResponse,
  ApiPatchResponse,
  ApiPostResponse,
} from 'src/utils/helpers/swagger-response.helper';
import {
  ACTION_CREATE,
  ACTION_READ,
  ACTION_UPDATE,
  EMPLOYEE_MASTERLIST,
  MASTERTABLES,
} from 'src/utils/constants/ability.constant';
import { Can } from 'src/utils/decorators/can.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import {
  CreateVesselWithDetailsDto,
  UpdateVesselWithDetailsDto,
} from './dto/vessel.dto';

@ApiTags('Mastertable - Vessel')
@Controller({ path: 'mastertable', version: '2' })
export class VesselController {
  constructor(private readonly vesselService: VesselService) {}

  @Get('vessels/vessel-user-location-list')
  @Can({ action: ACTION_READ, subject: MASTERTABLES })
  getVesselUserLoc(@SessionUser() user: RequestUser) {
    return this.vesselService.getVesselUserLoc(user);
  }

  @Get('vessels/:vesselId')
  @ApiOperation({ summary: 'Get a single vessel' })
  @ApiGetResponse('Here is the vessel')
  @Can({ action: ACTION_READ, subject: MASTERTABLES })
  getVessel(
    @SessionUser() user: RequestUser,
    @Param('vesselId', new ParseUUIDPipe()) vesselId: string,
  ) {
    return this.vesselService.getVessel(user, vesselId);
  }

  @Get('vessels')
  @ApiOperation({ summary: 'Get all vessels' })
  @ApiGetResponse('List of vessels retrieved')
  @Can({ action: ACTION_READ, subject: MASTERTABLES })
  getVessels(@SessionUser() user: RequestUser) {
    return this.vesselService.getVessels(user);
  }

  @Post('vessels')
  @ApiBody({
    type: CreateVesselWithDetailsDto,
    description: 'Payload to create vessel',
  })
  @ApiOperation({ summary: 'Create a new vessel' })
  @ApiPostResponse('Vessel created successfully')
  @Can({ action: ACTION_CREATE, subject: MASTERTABLES })
  createVessel(
    @SessionUser() user: RequestUser,
    @Body() dto: CreateVesselWithDetailsDto,
  ) {
    return this.vesselService.createVessel(user, dto);
  }

  @Put('vessels/:vesselId')
  @ApiBody({
    type: UpdateVesselWithDetailsDto,
    description: 'Payload to update vessel',
  })
  @ApiOperation({ summary: 'Update a current vessel' })
  @ApiPatchResponse('Vessel updated successfully')
  @Can({ action: ACTION_UPDATE, subject: EMPLOYEE_MASTERLIST })
  updateVessel(
    @SessionUser() user: RequestUser,
    @Body() dto: UpdateVesselWithDetailsDto,
    @Param('vesselId', new ParseUUIDPipe()) vesselId: string,
  ) {
    return this.vesselService.updateVessel(user, dto, vesselId);
  }
}
