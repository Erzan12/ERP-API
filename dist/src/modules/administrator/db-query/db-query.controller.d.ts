import { DbQueryService } from './db-query.service';
import { RequestUser } from 'src/utils/types/request-user.interface';
import { ExecuteDbQueryDto } from './dto/execute-db-query.dto';
export declare class DbQueryControllerV2 {
    private readonly dbQueryService;
    constructor(dbQueryService: DbQueryService);
    executeQuery(dto: ExecuteDbQueryDto, user: RequestUser): Promise<{
        executionMs: number;
        result: Record<string, unknown>[];
    }>;
    getLogs(): Promise<{
        id: string;
        success: boolean;
        error_message: string | null;
        sql: string;
        purpose: string;
        adminId: string;
        executedAt: Date;
        executionMs: number;
    }[]>;
    getLog(id: string): Promise<{
        id: string;
        success: boolean;
        error_message: string | null;
        sql: string;
        purpose: string;
        adminId: string;
        executedAt: Date;
        executionMs: number;
    } | null>;
}
