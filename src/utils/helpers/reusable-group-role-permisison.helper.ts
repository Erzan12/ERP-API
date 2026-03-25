// A reusable helper to group role_permissions into sub_modules with actions[]
import { RequestUser } from '../types/request-user.interface';

export function mapRolesToRequestUser(
  userRoles: Array<{
    role: {
      id: string;
      name: string;
      role_permissions: Array<{
        action: string;
        sub_module: { id: string; name: string };
      }>;
    };
  }>,
): RequestUser['roles'] {
  return userRoles.map((ur) => {
    const role = ur.role;

    //group actions by sub_module id
    const subModuleMap = new Map<
      string,
      { id: string; name: string; actions: string[] }
    >();

    for (const rp of role.role_permissions) {
      const key = rp.sub_module.id;
      if (!subModuleMap.has(key)) {
        subModuleMap.set(key, {
          id: rp.sub_module.id,
          name: rp.sub_module.name,
          actions: [],
        });
      }
      subModuleMap.get(key)!.actions.push(rp.action.toLowerCase().trim());
    }

    return {
      id: role.id,
      name: role.name,
      sub_modules: [...subModuleMap.values()],
    };
  });
}
