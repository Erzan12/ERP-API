import { Prisma } from '@prisma/client';

export type RoleWithPermissions = Prisma.RoleGetPayload<{
  include: {
    role_permissions: {
      select: {
        id: true,
        role: {
          select: {
            id: true;
            name: true;
            department: {
              select: {
                id: true;
                name: true;
              };
            };
          };
        };
        // sub_module_permission: {
        //   select: {
        //     id: true;
        //     actions: {
        //       role_permission_id: string;
        //       sub_module_permission_id: string;
        //       action: string;
        //     }[];
        //     sub_module_action_id: true;
        //     sub_module: {
        //       select: {
        //         id: true;
        //         name: true;
        //       };
        //     };
        //   };
        // };
        sub_module_permission: {
          select: {
            id: true;
            action: true;
            sub_module_action_id: true;
            sub_module: {
              select: {
                id: true;
                name: true;
              };
            };
          };
        }
      };
    };
  };
}>;

export type UserRolePermissions = Prisma.RoleGetPayload<{
  select: {
    id: true,
    sub_module_permission_id: true,
    is_active: true,
    // sub_module_permission: {
    //   select: {
    //     id: true;
    //     actions: {
    //       role_permission_id: string;
    //       sub_module_permission_id: string;
    //       action: string;
    //     }[];
    //     sub_module_action_id: true;
    //     sub_module: {
    //       select: {
    //         id: true;
    //         name: true;
    //       };
    //     };
    //   };
    // };
    role: {
      select: {
        id: true;
        name: true;
        department: {
          select: {
            id: true;
            name: true;
          };
        };
      };
    };
    sub_module_permission: {
      select: {
        id: true;
        action: true;
        sub_module_action_id: true;
        sub_module: {
          select: {
            id: true;
            name: true;
          };
        };
      };
    }
  };
}>;
