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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../config/prisma/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAdminDashboardStats(user) {
        const totalUsers = await this.prisma.user.count();
        const activeUsers = await this.prisma.user.count({
            where: { is_active: true },
        });
        const inActiceUsers = await this.prisma.user.count({
            where: { is_active: false },
        });
        const roles = await this.prisma.role.findMany({
            include: {
                _count: {
                    select: { user_roles: true },
                },
            },
        });
        const rolesSummary = roles.map((role) => ({
            role: role.name,
            total_users: role._count.user_roles,
        }));
        const onlineUsers = await this.prisma.user.findMany({
            where: {
                last_login: {
                    gte: new Date(Date.now() - 1000 * 60 * 5),
                },
            },
            select: {
                id: true,
                username: true,
                last_login: true,
            },
        });
        const requestUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: {
                employee: {
                    include: {
                        person: true,
                        position: true,
                    },
                },
                user_roles: true,
            },
        });
        if (!requestUser || !requestUser.employee || !requestUser.employee.person) {
            throw new common_1.BadRequestException(`User does not exist.`);
        }
        const isAdmin = requestUser.user_roles.some((role) => role.role_name === 'Administrator' || 'Super Administrator');
        if (!isAdmin) {
            throw new common_1.ForbiddenException('You are not allowed to perform this action');
        }
        return {
            status: 'success',
            message: 'Welcome to Administrator Dashboard',
            data: {
                total_users: totalUsers,
                active_users: activeUsers,
                inactive_users: inActiceUsers,
                classification_by_roles: rolesSummary,
                online_users: onlineUsers,
            },
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map