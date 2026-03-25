import { Body, Param, Put, Controller, ParseUUIDPipe } from '@nestjs/common';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { UpdateSecurityClearanceDto } from './dto/update-security-clearance.dto';
import { Can } from 'src/utils/decorators/can.decorator';
import { SecurityClearanceService } from './security-clearance.service';
import { SessionUser } from 'src/utils/decorators/session-user.decorator';
import {
  ACTION_UPDATE,
  USER_ACCOUNT,
  SEC_LVL_9,
} from 'src/utils/constants/ability.constant';
import { SecurityClearance } from 'src/middleware/security_clearance/security-clearance.decorator';
import { ApiSecurityClearance } from 'src/utils/helpers/swagger-response.helper';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Administrator - Security Clearance')
@Controller({ path: 'administrator', version: '2' })
export class SecurityClearanceControllerV2 {
  constructor(private clearanceService: SecurityClearanceService) {}

  @Put('/security_clearance/:id')
  @ApiOperation({ summary: 'Assign the security clearance level for user' })
  @ApiSecurityClearance(SEC_LVL_9)
  @SecurityClearance(SEC_LVL_9) // admin must be 9+ to update others
  @Can({ action: ACTION_UPDATE, subject: USER_ACCOUNT })
  updateClearance(
    @Param('id', new ParseUUIDPipe()) targetId: string,
    @Body() dto: UpdateSecurityClearanceDto,
    @SessionUser() admin: RequestUser,
  ) {
    return this.clearanceService.updateUserClearance(
      admin.id,
      String(targetId),
      dto.new_level,
      admin.security_clearance_level,
    );
  }
}
