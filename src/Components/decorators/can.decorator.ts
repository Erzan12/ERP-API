import { SetMetadata,  } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

export interface PermissionMetadata {
  action: string;
  subject: string;
  module?: string | string[]; // optional, but useful if multiple modules are allowed to access a submodule
}

//check the module array
export function Permissions(options: PermissionMetadata): MethodDecorator {
  return (target, key, descriptor) => {
    if (!descriptor || !descriptor.value) {
      throw new Error('Permissions decorator must be used on a method');
    }
    Reflect.defineMetadata('permissions', options, descriptor.value);
    return descriptor;
  };
}

export const Can = (permission: PermissionMetadata) =>
  SetMetadata(PERMISSIONS_KEY, permission);