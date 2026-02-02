import { SetMetadata } from '@nestjs/common';

export const SECURITY_CLEARANCE_KEY = 'security_clearance_level';

export const SecurityClearance = (level: number) =>
  SetMetadata(SECURITY_CLEARANCE_KEY, level);
