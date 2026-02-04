import { Body, Param, Put, Controller } from '@nestjs/common';
import { UpdateSecurityClearanceDto } from './dto/update-security-clearance.dto';
import { Can } from 'src/components/decorators/can.decorator';
import { SecurityClearanceService } from './security-clearance.service';
import { SessionUser } from 'src/components/decorators/session-user.decorator';
import {
  ACTION_UPDATE,
  USER_ACCOUNT,
  SEC_LVL_9,
} from 'src/components/constants/ability.constant';
import { SecurityClearance } from 'src/middleware/security_clearance/security-clearance.decorator';
import { ApiSecurityClearance } from 'src/components/helpers/swagger-response.helper';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@ApiTags('Administrator')
@Controller('administrator')
export class SecurityClearanceController {
  constructor(private clearanceService: SecurityClearanceService) {}

  @Put('/security_clearance/:id')
  @ApiOperation({ summary: 'Assign the security clearance level for user' })
  @ApiSecurityClearance(SEC_LVL_9)
  @SecurityClearance(SEC_LVL_9) // admin must be 9+ to update others
  @Can({ action: ACTION_UPDATE, subject: USER_ACCOUNT })
  updateClearance(
    @Param('id') targetId: number,
    @Body() dto: UpdateSecurityClearanceDto,
    @SessionUser() admin,
  ) {
    return this.clearanceService.updateUserClearance(
      admin.id,
      Number(targetId),
      dto.new_level,
      admin.security_clearance_level,
    );
  }
}
