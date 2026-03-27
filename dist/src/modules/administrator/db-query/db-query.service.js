"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbQueryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../config/prisma/prisma.service");
const client_1 = require("@prisma/client");
const slack_service_1 = require("../../../jobs/slack/slack.service");
let DbQueryService = class DbQueryService {
    prisma;
    slackService;
    constructor(prisma, slackService) {
        this.prisma = prisma;
        this.slackService = slackService;
    }
    validateSql(sql) {
        const forbiddenKeywords = [
            'DROP DATABASE',
            'ALTER ROLE',
            'CREATE ROLE',
            'GRANT ALL',
        ];
        const upperSql = sql.toUpperCase();
        if (forbiddenKeywords.some((k) => upperSql.includes(k))) {
            throw new common_1.ForbiddenException('This SQL operation is not allowed.');
        }
    }
    async executeQuery(dto, adminId) {
        this.validateSql(dto.sql);
        const start = Date.now();
        let success = true;
        let errorMessage = null;
        let result = null;
        try {
            result = await this.prisma.$queryRawUnsafe(dto.sql);
        }
        catch (error) {
            success = false;
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                errorMessage = error.message;
            }
            else if (error instanceof Error) {
                errorMessage = error.message;
            }
            else {
                errorMessage = 'Unknown error occured';
            }
        }
        const executionMs = Date.now() - start;
        await this.prisma.adminDBQueryLog.create({
            data: {
                adminId,
                sql: dto.sql,
                purpose: dto.purpose,
                executionMs,
                success,
                error_message: errorMessage,
            },
        });
        if (!success) {
            throw new common_1.BadRequestException(errorMessage);
        }
        await this.slackService.notify(`🚨 Manual SQL executed
      Admin: ${adminId}
      Purpose: ${dto.purpose}
      Success: ${success}
      Time: ${executionMs}ms`);
        return {
            executionMs,
            result: result,
        };
    }
    async getLogs() {
        return this.prisma.adminDBQueryLog.findMany({
            orderBy: { executedAt: 'desc' },
            take: 50,
        });
    }
    async getLogById(id) {
        return this.prisma.adminDBQueryLog.findUnique({
            where: { id },
        });
    }
};
exports.DbQueryService = DbQueryService;
exports.DbQueryService = DbQueryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        slack_service_1.SlackService])
], DbQueryService);
//# sourceMappingURL=db-query.service.js.map