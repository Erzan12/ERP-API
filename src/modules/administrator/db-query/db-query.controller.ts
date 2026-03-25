import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ACTION_CREATE,
  ACTION_READ,
  SYSTEM_MANAGEMENT,
} from 'src/utils/constants/ability.constant';
import { ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import { DbQueryService } from './db-query.service';
import { Can } from 'src/utils/decorators/can.decorator';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { ExecuteDbQueryDto } from './dto/execute-db-query.dto';
import {
  ApiPostResponse,
  ApiGetResponse,
} from 'src/utils/helpers/swagger-response.helper';

@ApiTags('Administrator - Database Manuel Query')
@Controller({ path: 'administrator/db-query', version: '2' })
export class DbQueryControllerV2 {
  constructor(private readonly dbQueryService: DbQueryService) {}

  @Post('execute')
  @ApiBody({
    type: ExecuteDbQueryDto,
    description: 'Payload for manual db query',
  })
  @ApiOperation({ summary: 'Execute manual SQL query (Super Admin Only)' })
  @ApiPostResponse('Db manual query successful')
  @Can({ action: ACTION_CREATE, subject: SYSTEM_MANAGEMENT })
  executeQuery(
    @Body() dto: ExecuteDbQueryDto,
    @SessionUser() user: RequestUser,
  ) {
    return this.dbQueryService.executeQuery(dto, user.id);
  }

  @Get('logs')
  @ApiOperation({ summary: 'Get latest executed manual queries' })
  @ApiGetResponse('Logs for all manual db queries performed')
  @Can({ action: ACTION_READ, subject: SYSTEM_MANAGEMENT })
  getLogs() {
    return this.dbQueryService.getLogs();
  }

  @Get('logs/:id')
  @ApiOperation({ summary: 'Get specific manual query log' })
  @ApiGetResponse('Get a specific manual db query log')
  @Can({ action: ACTION_READ, subject: SYSTEM_MANAGEMENT })
  getLog(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.dbQueryService.getLogById(id);
  }
}
