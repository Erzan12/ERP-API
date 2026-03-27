import { RoleService } from './role.service';
import { RequestUser } from '../../../utils/types/request-user.interface';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permisisons.dto';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';
export declare class RoleControllerV2 {
    private roleService;
    constructor(roleService: RoleService);
    getRoles(user: RequestUser, dto: PaginationDto): Promise<{
        status: string;
        message: string;
        count: number;
        page: number;
        perPage: number;
        roles: ({
            createdBy: {
                person: {
                    first_name: string;
                    last_name: string;
                    middle_name: string | null;
                };
            } | null;
            updatedBy: {
                person: {
                    first_name: string;
                    last_name: string;
                    middle_name: string | null;
                };
            } | null;
        } & {
            description: string;
            id: string;
            created_at: Date;
            name: string;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
        })[];
    }>;
    getRole(id: string, user: RequestUser): Promise<{
        status: string;
        message: string;
        data: {
            role: {
                createdBy: {
                    person: {
                        first_name: string;
                        last_name: string;
                        middle_name: string | null;
                    };
                } | null;
                updatedBy: {
                    person: {
                        first_name: string;
                        last_name: string;
                        middle_name: string | null;
                    };
                } | null;
                role_permissions: {
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
            } & {
                description: string;
                id: string;
                created_at: Date;
                name: string;
                is_active: boolean;
                created_by: string | null;
                updated_by: string | null;
                updated_at: Date;
            };
        };
    }>;
    createRole(createRoleDto: CreateRoleDto, user: RequestUser): Promise<{
        status: string;
        message: string;
        role: {
            description: string;
            id: string;
            created_at: Date;
            name: string;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
        };
        created_by_user: string;
    }>;
    updateRole(dto: UpdateRoleDto, roleId: string, user: RequestUser): Promise<{
        status: string;
        message: string;
        role: {
            description: string;
            id: string;
            created_at: Date;
            name: string;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
        };
        updated_by_user: string;
    }>;
    createRolePermission(createRolePermissionDto: CreateRolePermissionDto, user: RequestUser): Promise<{
        status: string;
        message: string;
        created_by: {
            id: string;
            name: string;
            department: {
                id: string;
                created_at: Date;
                name: string;
                is_active: boolean;
                created_by: string | null;
                updated_by: string | null;
                updated_at: Date;
                division_id: string;
                sorting: number | null;
                department_head_id: string | null;
            };
            position: string;
            role: string[];
        };
        role_id: string;
        role_name: string;
    }>;
    updateRolePermissions(id: string, updateRolePermissionsDto: UpdateRolePermissionsDto, user: RequestUser): Promise<{
        status: string;
        message: string;
        updated_by: {
            id: string;
            name: string;
            position: string;
        };
        updated_data: {
            results: {
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
        };
    }>;
}
