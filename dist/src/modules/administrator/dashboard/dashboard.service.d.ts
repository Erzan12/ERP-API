import { RequestUser } from 'src/utils/types/request-user.interface';
import { PrismaService } from 'src/config/prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getAdminDashboardStats(user: RequestUser): Promise<{
        status: string;
        message: string;
        data: {
            total_users: number;
            active_users: number;
            inactive_users: number;
            classification_by_roles: {
                role: string;
                total_users: number;
            }[];
            online_users: {
                username: string;
                id: string;
                last_login: Date;
            }[];
        };
    }>;
}
