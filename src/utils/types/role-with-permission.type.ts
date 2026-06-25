import { Prisma } from '@prisma/client';

export type RoleWithPermissions = Prisma.RoleGetPayload<{
  include: {
    role_permissions: {
      select: {
        sub_module_permission: {
          select: {
            id: true;
            action: true;
            sub_module_action_id: true;
            sub_module: {
                select: {
                    id: true,
                    name: true,
                };
            };
          };
        };
      };
    };
  };
}>;