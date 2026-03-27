import { CreateSubModuleDto } from './dto/create-sub-module.dto';
import { AssignSubModulePermissionDto } from './dto/assign-sub-module-permission.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { AddSubModulePermissionDto } from './dto/add-sub-module-permission.dto';
import { UpdateSubModulePermisisonDto } from './dto/update-sub-module-permisison.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';
import { Prisma } from '@prisma/client';
export declare class SubModuleService {
    private prisma;
    constructor(prisma: PrismaService);
    getSubModules(user: RequestUser, dto: PaginationDto): Promise<{
        status: string;
        message: string;
        count: number;
        page: number;
        perPage: number;
        subModules: {
            id: string;
            created_at: Date;
            name: string;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
            module_id: string;
        }[];
    }>;
    getSubmodule(subModuleId: string, user: RequestUser): Promise<{
        status: string;
        message: string;
        data: {
            subModule: {
                module: {
                    id: string;
                    created_at: Date;
                    name: string;
                    is_active: boolean;
                    created_by: string | null;
                    updated_by: string | null;
                    updated_at: Date;
                };
                role_permission: {
                    id: string;
                    action: string;
                    department_id: string;
                    created_at: Date;
                    is_active: boolean;
                    created_by: string | null;
                    updated_by: string | null;
                    updated_at: Date;
                    position_id: string | null;
                    role_id: string;
                    role_name: string;
                    sub_module_permission_id: string;
                    sub_module_id: string;
                }[];
                sub_module_permissions: {
                    id: string;
                    action: string;
                    created_at: Date;
                    created_by: string | null;
                    updated_by: string | null;
                    updated_at: Date;
                    sub_module_id: string;
                    sub_module_action_id: string;
                }[];
            } & {
                id: string;
                created_at: Date;
                name: string;
                is_active: boolean;
                created_by: string | null;
                updated_by: string | null;
                updated_at: Date;
                module_id: string;
            };
        };
    }>;
    createSubModule(createSubModuleDto: CreateSubModuleDto, user: RequestUser): Promise<{
        status: string;
        message: string;
        created_by: {
            id: string;
            name: string;
            position: string;
        };
        subModule_id: string;
        subModule_name: string;
    }>;
    getSubModuleActions(user: RequestUser): Promise<{
        status: string;
        message: string;
        modules: {
            id: string;
            action: string;
            created_at: Date;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
        }[];
    }>;
    addSubModuleAction(dto: AddSubModulePermissionDto, user: RequestUser): Promise<{
        status: string;
        message: string;
        created_by: {
            id: string;
            name: string;
            position: string;
        };
        count: number;
        actions_added: string[];
    }>;
    updateSubModuleAction(dto: UpdateSubModulePermisisonDto, user: RequestUser, subModulePermissionId: string): Promise<{
        status: string;
        message: string;
        updated_by: {
            id: string;
            name: string;
            position: string;
        };
        data: {
            updateSubModulePermission: {
                id: string;
                action: string;
                created_at: Date;
                is_active: boolean;
                created_by: string | null;
                updated_by: string | null;
                updated_at: Date;
            };
        };
    }>;
    assignSubModulePermissions(dto: AssignSubModulePermissionDto, user: RequestUser): Promise<{
        status: string;
        message: string;
        created_by: {
            id: string;
            name: string;
            position: string;
        };
        data: {
            result: Prisma.BatchPayload;
        };
    }>;
}
