import { CreateSubModuleDto } from './dto/create-sub-module.dto';
import { AssignSubModulePermissionDto } from './dto/assign-sub-module-permission.dto';
import { RequestUser } from '../../../utils/types/request-user.interface';
import { SubModuleService } from './sub_module.service';
import { AddSubModulePermissionDto } from './dto/add-sub-module-permission.dto';
import { UpdateSubModulePermisisonDto } from './dto/update-sub-module-permisison.dto';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';
export declare class SubModuleControllerV2 {
    private subModuleService;
    constructor(subModuleService: SubModuleService);
    getSubmodules(user: RequestUser, dto: PaginationDto): Promise<{
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
    createPermission(addSubModuleDto: AddSubModulePermissionDto, user: RequestUser): Promise<{
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
    createSubModulePermission(assignSubModulePermissionDto: AssignSubModulePermissionDto, user: RequestUser): Promise<{
        status: string;
        message: string;
        created_by: {
            id: string;
            name: string;
            position: string;
        };
        data: {
            result: import(".prisma/client").Prisma.BatchPayload;
        };
    }>;
    updatePermission(dto: UpdateSubModulePermisisonDto, user: RequestUser, id: string): Promise<{
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
}
