import { PrismaService } from 'src/config/prisma/prisma.service';
export declare class SecurityClearanceService {
    private prisma;
    constructor(prisma: PrismaService);
    updateUserClearance(adminId: string, targetUserId: string, newClearanceLevel: number, adminClearanceLevel: number): Promise<{
        status: string;
        message: string;
        user: {
            id: string;
            email: string;
            security_clearance_level: number | null;
        };
    }>;
}
