import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SecurityClearanceGuard } from '../../middleware/security_clearance/security-clearance.guard';
import { PermissionsGuard } from 'src/middleware/guards/permission.guard';

export const Authenticated = () =>
  UseGuards(AuthGuard('jwt'), PermissionsGuard, SecurityClearanceGuard); // guardlogic for jwt token and auth
