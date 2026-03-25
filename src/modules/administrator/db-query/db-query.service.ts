import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ExecuteDbQueryDto } from './dto/execute-db-query.dto';
import { SlackService } from 'src/jobs/slack/slack.service';

@Injectable()
export class DbQueryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly slackService: SlackService,
  ) {}

  private validateSql(sql: string) {
    const forbiddenKeywords = [
      'DROP DATABASE',
      'ALTER ROLE',
      'CREATE ROLE',
      'GRANT ALL',
    ];

    const upperSql = sql.toUpperCase();

    if (forbiddenKeywords.some((k) => upperSql.includes(k))) {
      throw new ForbiddenException('This SQL operation is not allowed.');
    }
  }

  async executeQuery(dto: ExecuteDbQueryDto, adminId: string) {
    this.validateSql(dto.sql);
    const start = Date.now();
    let success = true;
    let errorMessage: string | null = null;
    let result: unknown = null;

    try {
      result = await this.prisma.$queryRawUnsafe(dto.sql);
    } catch (error) {
      success = false;

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = 'Unknown error occured';
      }
    }

    const executionMs = Date.now() - start;

    await this.prisma.adminDBQueryLog.create({
      data: {
        adminId,
        sql: dto.sql,
        purpose: dto.purpose,
        // confirm: true,
        executionMs,
        success,
        error_message: errorMessage,
      },
    });

    if (!success) {
      throw new BadRequestException(errorMessage);
    }

    await this.slackService.notify(
      // `Admin ${adminId} executed manual SQL:\n${dto.purpose}`
      `🚨 Manual SQL executed
      Admin: ${adminId}
      Purpose: ${dto.purpose}
      Success: ${success}
      Time: ${executionMs}ms`,
    );

    return {
      executionMs,
      result: result as Record<string, unknown>[],
    };
  }

  async getLogs() {
    return this.prisma.adminDBQueryLog.findMany({
      orderBy: { executedAt: 'desc' },
      take: 50,
    });
  }

  async getLogById(id: string) {
    return this.prisma.adminDBQueryLog.findUnique({
      where: { id },
    });
  }
}
