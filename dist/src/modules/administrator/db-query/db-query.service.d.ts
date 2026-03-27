import { PrismaService } from 'src/config/prisma/prisma.service';
import { ExecuteDbQueryDto } from './dto/execute-db-query.dto';
import { SlackService } from 'src/jobs/slack/slack.service';
export declare class DbQueryService {
    private readonly prisma;
    private readonly slackService;
    constructor(prisma: PrismaService, slackService: SlackService);
    private validateSql;
    executeQuery(dto: ExecuteDbQueryDto, adminId: string): Promise<{
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
    getLogById(id: string): Promise<{
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
