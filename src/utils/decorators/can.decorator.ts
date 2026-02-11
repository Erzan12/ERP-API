import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

//module is now remove
export interface PermissionMetadata {
  action: string;
  subject: string;
  // module?: string | string[]; → remove this
}

export const Can = (permission: PermissionMetadata) =>
  SetMetadata(PERMISSIONS_KEY, permission);
