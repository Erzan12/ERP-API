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
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const terminus_1 = require("@nestjs/terminus");
const prisma_service_1 = require("../../../config/prisma/prisma.service");
let HealthController = class HealthController {
    health;
    db;
    prisma;
    constructor(health, db, prisma) {
        this.health = health;
        this.db = db;
        this.prisma = prisma;
    }
    live() {
        return { status: 'ok' };
    }
    async ready() {
        try {
            return await this.health.check([
                () => this.db.pingCheck('database', this.prisma),
            ]);
        }
        catch (error) {
            console.error('Health check failed:', error);
            throw error;
        }
    }
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
        }
        catch (error) {
            return {
                status: 'error',
                message: 'DATABASE_URL is malformed',
                error,
            };
        }
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)('health/live'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "live", null);
__decorate([
    (0, common_1.Get)('health/ready'),
    (0, terminus_1.HealthCheck)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "ready", null);
__decorate([
    (0, common_1.Get)('health/env'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "envCheck", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('Administrator - Health Check'),
    (0, common_1.Controller)({ path: 'administrator', version: '2' }),
    __metadata("design:paramtypes", [terminus_1.HealthCheckService,
        terminus_1.PrismaHealthIndicator,
        prisma_service_1.PrismaService])
], HealthController);
//# sourceMappingURL=health.controller.js.map