// A reusable helper to group role_permissions into sub_modules with actions[]
import { RequestUser } from '../types/request-user.interface';

export function mapRolesToRequestUser(
  userRoles: Array<{
    id: string;
    role_name: string;
    user_permissions: Array<{
      action: string;
      role_permission: {
        sub_module_permission: {
          sub_module: {
            id: string;
            name: string;
          };
        };
      } | null;

      sub_module_permission: {
        sub_module: {
          id: string;
          name: string;
        };
      } | null;
    }>;
  }>,
): RequestUser['roles'] {
  return userRoles.map((ur) => {
    //group actions by sub_module id
    const subModuleMap = new Map<
      string,
      { id: string; name: string; actions: string[] }
    >();

    for (const up of ur.user_permissions) {
      // const subModule = up.role_permission.sub_module_permission.sub_module;
      const subModule =
        up.role_permission?.sub_module_permission?.sub_module ??
        up.sub_module_permission?.sub_module;

      if (!subModule) {
        continue;
      }

      const key = subModule.id;

      if (!subModuleMap.has(key)) {
        subModuleMap.set(key, {
          id: subModule.id,
          name: subModule.name,
          actions: [],
        });
      }

      subModuleMap.get(key)!.actions.push(
        up.action.toLowerCase().trim(),
      );
    }

    return {
      id: ur.id,
      name: ur.role_name,
      sub_modules: [...subModuleMap.values()],
    };
  });
}
