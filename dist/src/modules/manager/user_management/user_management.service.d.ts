import { MailService } from 'src/jobs/mail/mail.service';
import { CreateUserWithRoleDto } from './dto/create-user-with-role-permission.dto';
import { DeactivateUserAccountDto, ReactivateUserAccountDto } from './dto/user-account-status.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { UserEmailResetTokenDto } from './dto/user-email.reset-token.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { Request } from 'express';
import { AuditService } from 'src/modules/administrator/audit/audit.service';
import { AuthService } from 'src/auth/auth.service';
export declare class UserManagementService {
    private readonly prisma;
    private readonly mailService;
    private readonly auditService;
    private readonly authService;
    constructor(prisma: PrismaService, mailService: MailService, auditService: AuditService, authService: AuthService);
    viewUserAccount(user: RequestUser): Promise<{
        status: string;
        message: string;
        data: {
            user_accounts: {
                username: string;
                id: string;
                is_active: boolean;
                user_roles: {
                    role_name: string;
                }[];
            }[];
        };
    }>;
    createUserAccount(createUserWithRoleDto: CreateUserWithRoleDto, user: RequestUser, req: Request, userId: string): Promise<{
        status: string;
        message: string;
        created_by: {
            id: string;
            name: string;
            position: string;
        };
        user_id: string;
        username: string;
        password: string;
        reset_token: string;
    }>;
    resendInvitation(dto: UserEmailResetTokenDto, user: RequestUser): Promise<{
        status: string;
        message: string;
        user_id: string;
        reset_token: {
            id: string;
            created_at: Date;
            user_id: string;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
            expires_at: Date;
            password_token: string;
            isUsed: boolean;
        };
        user_name: string;
        updated_by: {
            name: string;
            position: string;
        };
    }>;
    deactivateUserAccount(deactivateUserAccountDto: DeactivateUserAccountDto, user: RequestUser): Promise<{
        status: string;
        message: string;
        deactivated_by: string;
    }>;
    reactivateUserAccount(reactivateUserAccountDto: ReactivateUserAccountDto, user: RequestUser): Promise<{
        status: string;
        message: string;
        reactivated_by: string;
    }>;
    viewNewEmployeeWithoutUserAccount(user: RequestUser): Promise<{
        status: string;
        message: string;
        data: {
            employees: {
                person: {
                    id: string;
                    created_at: Date;
                    email: string | null;
                    created_by: string | null;
                    updated_by: string | null;
                    updated_at: Date;
                    first_name: string;
                    last_name: string;
                    middle_name: string | null;
                    suffix: string | null;
                    date_of_birth: Date;
                    gender: string | null;
                    contact_no: string | null;
                    civil_status: string;
                    home_address: string | null;
                    city_provice: string | null;
                    nationality: string | null;
                    country: string | null;
                    zip_code: string | null;
                    emergency_contact_person: string | null;
                    emergency_contact_number: string | null;
                    anonymization_preferences: import("@prisma/client/runtime/client").JsonValue | null;
                    other_person_data: import("@prisma/client/runtime/client").JsonValue | null;
                };
                user: {
                    username: string;
                    password: string;
                    id: string;
                    employee_id: string;
                    created_at: Date;
                    email: string;
                    token_version: number;
                    person_id: string;
                    is_active: boolean;
                    password_reset: string | null;
                    require_reset: number;
                    reports_to: number | null;
                    last_login: Date;
                    security_questions: import("@prisma/client/runtime/client").JsonValue | null;
                    security_clearance_level: number | null;
                    created_by: string | null;
                    updated_by: string | null;
                    updated_at: Date;
                } | null;
                department: {
                    id: string;
                    name: string;
                };
                id: string;
                employee_id: string;
            }[];
        };
    }>;
}
