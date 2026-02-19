import { Controller, Post, Body, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ACTION_CREATE, ACTION_READ, SYSTEM_MANAGEMENT } from 'src/utils/constants/ability.constant';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DbQueryService } from './db-query.service';
import { Can } from 'src/utils/decorators/can.decorator';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { ExecuteDbQueryDto } from './dto/execute-db-query.dto';

@ApiBearerAuth('access-token')
@ApiTags('Administrator - Database Manuel Query')
@Controller({path:'administrator/db-query', version: '2'})
export class DbQueryControllerV2 {
    constructor(private readonly dbQueryService: DbQueryService) {}

    @Post('execute')
    @ApiOperation({ summary: 'Execute manual SQL query (Super Admin Only)' })
    @Can({ action: ACTION_CREATE, subject: SYSTEM_MANAGEMENT })
    executeQuery(
        @Body() dto: ExecuteDbQueryDto,
        @SessionUser() user: RequestUser,
    ) {
        return this.dbQueryService.executeQuery(dto, user.id)
    }

    @Get('logs')
    @ApiOperation({ summary: 'Get latest executed manual queries' })
    @Can({ action: ACTION_READ, subject: SYSTEM_MANAGEMENT })
    getLogs() {
        return this.dbQueryService.getLogs();
    }

    @Get('logs/:id')
    @ApiOperation({ summary: 'Get specific manual query log'})
    @Can({ action: ACTION_READ, subject: SYSTEM_MANAGEMENT })
    getLog(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.dbQueryService.getLogById(id);
    }
}
