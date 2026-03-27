import { HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';
import { PrismaService } from 'src/config/prisma/prisma.service';
export declare class HealthController {
    private health;
    private db;
    private prisma;
    constructor(health: HealthCheckService, db: PrismaHealthIndicator, prisma: PrismaService);
    live(): {
        status: string;
    };
    ready(): Promise<import("@nestjs/terminus").HealthCheckResult>;
    envCheck(): {
        status: string;
        message: string;
        protocol?: undefined;
        host?: undefined;
        port?: undefined;
        database?: undefined;
        error?: undefined;
    } | {
        status: string;
        protocol: string;
        host: string;
        port: string;
        database: string;
        message?: undefined;
        error?: undefined;
    } | {
        status: string;
        message: string;
        error: unknown;
        protocol?: undefined;
        host?: undefined;
        port?: undefined;
        database?: undefined;
    };
}
