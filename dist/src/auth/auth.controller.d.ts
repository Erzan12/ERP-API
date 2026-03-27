import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordWithTokenDto } from './dto/reset-password-with-token.dto';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { Request } from 'express';
import { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, req: Request, res: Response): Promise<{
        new_account?: number | undefined;
        status: number;
        message: string;
        token: string;
    }>;
    logout(requestUser: RequestUser, req: Request, res: Response): Promise<{
        message: string;
    }>;
    passwordResetWithToken(token: string, resetPasswordWithTokenDto: ResetPasswordWithTokenDto): Promise<{
        status: string;
        message: string;
        user: {
            id: string;
            username: string;
            email: string;
        };
    }>;
    verify(requestUser: RequestUser): Promise<{
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
