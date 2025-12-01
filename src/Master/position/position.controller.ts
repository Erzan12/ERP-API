import { Controller, Body, Post, Patch, Query } from '@nestjs/common';
import { PositionService } from './position.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { RequestUser } from 'src/Components/types/request-user.interface';
import { SessionUser } from 'src/Components/decorators/session-user.decorator';
import { Can } from 'src/Components/decorators/can.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiPostResponse, ApiPatchResponse } from 'src/Components/helpers/swagger-response.helper';

@ApiBearerAuth('access-token') // matches the name used in .addBearerAuth()
@ApiTags('Mastertables')
@Controller('position')
export class PositionController {
    constructor(private positionService: PositionService) {}

        @Post('positions')
        @ApiBody({ type: CreatePositionDto, description: 'Payload to create Position'})
        @ApiOperation({ summary: 'Create a new position' })
        @ApiPostResponse('Position created successfully')
        @Can({ action: 'create', subject: 'Mastertables' }) // ---> action is permission; subject is submodule; role is check in jwt strategy
        async createPosition(
            @Body() createPositionDto: CreatePositionDto, 
            @SessionUser() user: RequestUser,
        ) {
            console.log('createPositionDto:', createPositionDto);
            console.log('stat:', createPositionDto.stat);
            return this.positionService.createPosition( createPositionDto, user);
        }
    
        @Patch('positions')
        @ApiBody({ type: UpdatePositionDto, description: 'Payload to update Position Info'})
        @ApiOperation({ summary: 'Update a current position information'})
        @ApiPatchResponse('Position updated successfully')
        @Can({ action: 'update', subject: 'Mastertables' }) // ---> action is permission; subject is submodule; role is check in jwt strategy
        async updatePositionInfo(
            @Body() updatePositionDto: UpdatePositionDto,
            @SessionUser() user: RequestUser,
        ) {
            return this.positionService.updatePosition( updatePositionDto, user);
        }
}
