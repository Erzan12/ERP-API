import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { ACTION_READ, EMPLOYEE_MASTERLIST } from 'src/utils/constants/ability.constant';
import { Can } from 'src/utils/decorators/can.decorator';

@ApiTags('Administrator - Health Check')
@Controller({ path: 'administrator', version: '2' })
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: PrismaHealthIndicator,
    private prisma: PrismaService,
  ) {}

  @Get('health/live')
  @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
  live() {
    return { status: 'ok' };
  }

  @Get('health/ready')
  @HealthCheck()
  @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
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

  @Get('health/env')
  @Can({ action: ACTION_READ, subject: EMPLOYEE_MASTERLIST })
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
