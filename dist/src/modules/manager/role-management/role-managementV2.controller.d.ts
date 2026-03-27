import { RoleManagementService } from './role-management.service';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { AddUserRolePermissionsDto } from './dto/add-user-role-permissions.dto';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';
export declare class RoleManagementControllerV2 {
    private roleManagementService;
    constructor(roleManagementService: RoleManagementService);
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
    getRole(user: RequestUser, roleId: string): Promise<{
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
    getMyPermissions(user: RequestUser): Promise<{
        user_id: string;
        username: string;
        email: string;
        roles: {
            id: string;
            name: string;
        }[];
        permissions: {
            role_id: string;
            role_name: string;
            action: string;
            sub_module: string;
            sub_module_id: string | null;
        }[];
    }>;
    addUserRole(requestUser: RequestUser, userId: string, roleName: string): Promise<{
        status: string;
        message: string;
        added_by: {
            id: string;
            name: string;
            position: string;
        };
        role: string;
        user_role_id: string;
    }>;
    addRolePermission(addUserRolePermissionsDto: AddUserRolePermissionsDto, user: RequestUser): Promise<{
        message: string;
        roles: {
            description: string;
            id: string;
            created_at: Date;
            name: string;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
        }[];
    }>;
}
