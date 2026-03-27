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
    async getHRDashboard() {
        const totalActEmp = await this.prisma.user.count({
            where: { is_active: true },
        });
        const totalInActEmp = await this.prisma.user.count({
            where: { is_active: false },
        });
        const totalSepEmp = await this.prisma.employee.count({
            where: {
                employment_status: {
                    code: {
                        in: ['RESIGNED', 'TERMINATED'],
                    },
                },
            },
        });
        const forRegEmp = await this.prisma.employee.count({
            where: {
                employment_status: {
                    code: {
                        in: ['REGULAR'],
                    },
                },
            },
        });
        return {
            status: 'success',
            message: 'Welcome to Human Resources Dashboard',
            data: {
                total_active_employees: totalActEmp,
                total_inactive_employees: totalInActEmp,
                total_separated_employees: totalSepEmp,
                for_regularization_employee: forRegEmp,
                employees_due_for_awol: '',
                overly_extended_crew_transfer: '',
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