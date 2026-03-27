import { RequestUser } from '../types/request-user.interface';
export declare function mapRolesToRequestUser(userRoles: Array<{
    role: {
        id: string;
        name: string;
        role_permissions: Array<{
            action: string;
            sub_module: {
                id: string;
                name: string;
            };
        }>;
    };
}>): RequestUser['roles'];
