import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, HttpHealthIndicator, PrismaHealthIndicator } from '@nestjs/terminus';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { Public } from 'src/utils/decorators/public.decorator';

@Public()
@ApiTags('Administrator - Health Check')
@Controller({path:'administrator', version: '2'})
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private db: PrismaHealthIndicator,
        private prisma: PrismaService
    ) {}

    @Get('health/live')
    live() {
        return { status: 'ok' };
    }

    @Get('health/ready')
    @HealthCheck()
    ready() {
        return this.health.check([
            () => this.db.pingCheck('database', this.prisma), // pass prisma
        ]);
    }
}
