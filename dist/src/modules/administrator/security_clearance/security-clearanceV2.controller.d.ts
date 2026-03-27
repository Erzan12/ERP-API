import { RequestUser } from 'src/utils/types/request-user.interface';
import { UpdateSecurityClearanceDto } from './dto/update-security-clearance.dto';
import { SecurityClearanceService } from './security-clearance.service';
export declare class SecurityClearanceControllerV2 {
    private clearanceService;
    constructor(clearanceService: SecurityClearanceService);
    updateClearance(targetId: string, dto: UpdateSecurityClearanceDto, admin: RequestUser): Promise<{
        status: string;
        message: string;
        user: {
            id: string;
            email: string;
            security_clearance_level: number | null;
        };
    }>;
}
