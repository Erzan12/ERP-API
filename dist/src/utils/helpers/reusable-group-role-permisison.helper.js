"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapRolesToRequestUser = mapRolesToRequestUser;
function mapRolesToRequestUser(userRoles) {
    return userRoles.map((ur) => {
        const role = ur.role;
        const subModuleMap = new Map();
        for (const rp of role.role_permissions) {
            const key = rp.sub_module.id;
            if (!subModuleMap.has(key)) {
                subModuleMap.set(key, {
                    id: rp.sub_module.id,
                    name: rp.sub_module.name,
                    actions: [],
                });
            }
            subModuleMap.get(key).actions.push(rp.action.toLowerCase().trim());
        }
        return {
            id: role.id,
            name: role.name,
            sub_modules: [...subModuleMap.values()],
        };
    });
}
//# sourceMappingURL=reusable-group-role-permisison.helper.js.map