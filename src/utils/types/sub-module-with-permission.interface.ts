import { Prisma } from "@prisma/client";

export type SubmoduleWithPermission = Prisma.SubModuleGetPayload<{
    include: {
        sub_module_permissions: {
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
}>