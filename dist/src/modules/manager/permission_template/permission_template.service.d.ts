import { CreatePermissionTemplateDto } from 'src/modules/manager/permission_template/dto/create-permission-template.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { AssignTemplateDto } from './dto/assign-template.dto';
import { UpdatePermissionTemplateDto } from './dto/update-permission-template.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';
export declare class PermissionTemplateService {
    private prisma;
    constructor(prisma: PrismaService);
    getPermissionTemplates(user: RequestUser): Promise<{
        status: string;
        message: string;
        data: {
            existingPermTemplate: {
                id: string;
                department_id: string;
                created_at: Date;
                name: string;
                is_active: boolean;
                created_by: string | null;
                updated_by: string | null;
                updated_at: Date;
            }[];
        };
    }>;
    getPermissionTemplate(id: string, user: RequestUser): Promise<{
        status: string;
        message: string;
        data: {
            permissionTemplate: {
                id: string;
                department_id: string;
                created_at: Date;
                name: string;
                is_active: boolean;
                created_by: string | null;
                updated_by: string | null;
                updated_at: Date;
            };
        };
    }>;
    createPermissionTemplate(dto: CreatePermissionTemplateDto, user: RequestUser): Promise<{
        message: string;
        template_id: string;
        name: string;
    }>;
    updatePermissionTemplate(permissionTemplateId: string, dto: UpdatePermissionTemplateDto, user: RequestUser): Promise<{
        message: string;
        template_id: string;
        name: string;
    }>;
    assignTemplateToUser(dto: AssignTemplateDto, user: RequestUser): Promise<{
        message: string;
    }>;
    getUserPermissionTemplate(userPermissionTemplateId: string, user: RequestUser): Promise<{
        status: string;
        message: string;
        userPermissionTemplate: ({
            role_permissions: ({
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
                };
            } & {
                id: string;
                created_at: Date;
                created_by: string | null;
                updated_by: string | null;
                updated_at: Date;
                permission_template_id: string;
                role_permission_id: string;
                permission_template_department_id: string;
            })[];
            departments: {
                id: string;
                department_id: string;
                created_at: Date;
                user_id: string;
                created_by: string | null;
                updated_by: string | null;
                updated_at: Date;
                position_id: string | null;
                permission_template_id: string;
            }[];
        } & {
            id: string;
            department_id: string;
            created_at: Date;
            name: string;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
        })[];
    }>;
}
