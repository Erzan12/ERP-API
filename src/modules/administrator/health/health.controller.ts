import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { Public } from 'src/utils/decorators/public.decorator';

@Public()
@ApiTags('Administrator - Health Check')
@Controller({ path: 'health', version: '2' })
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: PrismaHealthIndicator,
    private prisma: PrismaService,
  ) {}

  @Get('live')
  live() {
    return { status: 'ok' };
  }

  @Get('ready')
  @HealthCheck()
  async ready() {
    try {
      return await this.health.check([
        () => this.db.pingCheck('database', this.prisma),
      ]);
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  @Get('env')
  envCheck() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      return {
        status: 'error',
        message: 'DATABASE_URL is not defined',
      };
    }

    try {
      const parsed = new URL(databaseUrl);

      return {
        status: 'ok',
        protocol: parsed.protocol,
        host: parsed.hostname,
        port: parsed.port,
        database: parsed.pathname.replace('/', ''),
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'DATABASE_URL is malformed',
        error,
      };
    }
  }
}
