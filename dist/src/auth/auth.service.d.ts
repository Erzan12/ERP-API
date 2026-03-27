import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordWithTokenDto } from './dto/reset-password-with-token.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { AuditService } from 'src/modules/administrator/audit/audit.service';
import { RequestUser } from 'src/utils/types/request-user.interface';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly auditService;
    constructor(prisma: PrismaService, jwtService: JwtService, auditService: AuditService);
    resetPasswordWithToken(dto: ResetPasswordWithTokenDto, token: string): Promise<{
        status: string;
        message: string;
        user: {
            id: string;
            username: string;
            email: string;
        };
    }>;
    generateResetToken(userId: string): Promise<{
        status: string;
        message: string;
        token: {
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
    }>;
    validateUser(username: string, password: string): Promise<{
        employee: {
            id: string;
            employee_id: string;
            department_id: string;
            created_at: Date;
            person_id: string;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
            salary: import("@prisma/client-runtime-utils").Decimal;
            employment_status_id: string;
            company_id: string;
            position_id: string;
            division_id: string;
            hire_date: Date;
            pay_frequency: string;
            monthly_equivalent_salary: import("@prisma/client-runtime-utils").Decimal;
            archive_date: Date | null;
            other_employee_data: import("@prisma/client/runtime/client").JsonValue | null;
            corporate_rank_id: number | null;
        };
        user_roles: ({
            role: {
                role_permissions: ({
                    sub_module: {
                        id: string;
                        created_at: Date;
                        name: string;
                        is_active: boolean;
                        created_by: string | null;
                        updated_by: string | null;
                        updated_at: Date;
                        module_id: string;
                    };
                } & {
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
                })[];
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
        } & {
            id: string;
            created_at: Date;
            user_id: string;
            is_active: boolean;
            created_by: string | null;
            updated_by: string | null;
            updated_at: Date;
            role_id: string;
            role_name: string;
        })[];
    } & {
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
    }>;
    login(loginDto: LoginDto, ipAddress?: string, userAgent?: string): Promise<{
        new_account?: number | undefined;
        status: number;
        message: string;
        token: string;
    }>;
    logout(requestUser: RequestUser, ipAddress?: string, userAgent?: string): Promise<{
        message: string;
    }>;
    getUser(requestUser: RequestUser): Promise<{
        status: string;
        message: string;
        data: {
            id: string;
            full_name: string;
            email: string;
            department: {
                id: string;
                name: string;
            } | null;
            company: string;
            division: string;
            position: string;
            security_clearance_level: number;
            roles: {
                id: string;
                role_name: string;
                isActive: boolean;
                sub_modules: {
                    id: string;
                    name: string;
                }[];
            }[];
        };
    }>;
}
