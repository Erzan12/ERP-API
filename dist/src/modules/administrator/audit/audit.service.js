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
var AuditService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../config/prisma/prisma.service");
const client_1 = require("@prisma/client");
let AuditService = AuditService_1 = class AuditService {
    prisma;
    logger = new common_1.Logger(AuditService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async log(data) {
        try {
            const changedFields = data.changed_fields ||
                this.detectChangedFields(data.old_values, data.new_values);
            const severity = data.severity || this.determineSeverity(data);
            const complianceFlag = data.compliance_flag ?? this.isComplianceCritical(data);
            await this.prisma.auditTrail.create({
                data: {
                    user_id: data.user?.id,
                    user_email: data.user?.email,
                    employee_id: await this.getEmployeeId(data.user?.id),
                    action: data.action,
                    resource: data.resource,
                    resource_id: data.resource_id,
                    old_values: data.old_values
                        ? JSON.parse(JSON.stringify(data.old_values))
                        : client_1.Prisma.JsonNull,
                    new_values: data.new_values
                        ? JSON.parse(JSON.stringify(data.new_values))
                        : client_1.Prisma.JsonNull,
                    change_fields: changedFields,
                    ip_address: data.ip_address,
                    user_agent: data.user_agent,
                    endpoint: data.endpoint,
                    http_method: data.http_method,
                    status_code: data.status_code,
                    success: data.success ?? true,
                    error_message: data.error_message,
                    department_id: data.department_id,
                    session_id: data.session_id,
                    request_id: data.request_id,
                    severity,
                    compliance_flag: complianceFlag,
                },
            });
            if (severity === 'CRITICAL' || complianceFlag) {
                this.logger.warn(`CRITICAL AUDIT: ${data.action} on ${data.resource} by user ${data.user?.email}`);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error('Failed to create audit log:', error.message);
            }
            else {
                this.logger.error('Failed to create audit log:', error);
            }
        }
    }
    async getEmployeeId(userId) {
        if (!userId)
            return null;
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { employee_id: true },
            });
            return user?.employee_id || null;
        }
        catch (error) {
            this.logger.error('Failed to fetch employee ID:', error instanceof Error ? error.message : String(error));
            return null;
        }
    }
    detectChangedFields(oldValues, newValues) {
        if (!oldValues || !newValues)
            return [];
        const changed = [];
        const allKeys = new Set([
            ...Object.keys(oldValues),
            ...Object.keys(newValues),
        ]);
        for (const key of allKeys) {
            if (JSON.stringify(oldValues[key]) !==
                JSON.stringify(newValues[key])) {
                changed.push(key);
            }
        }
        return changed;
    }
    determineSeverity(data) {
        if (!data.success ||
            data.action === 'PERMISSION_DENIED' ||
            data.action === 'LOGIN_FAILED' ||
            data.action === 'DELETE' ||
            data.changed_fields?.includes('security_clearance_level') ||
            data.changed_fields?.includes('password')) {
            return 'CRITICAL';
        }
        if (data.action === 'UPDATE' &&
            ['user_account', 'role_permission', 'salary', 'employee'].includes(data.resource)) {
            return 'WARNING';
        }
        return 'INFO';
    }
    isComplianceCritical(data) {
        const criticalResources = [
            'salary',
            'employee',
            'role_permission',
            'user_account',
            'security_clearance',
        ];
        const criticalFields = [
            'salary',
            'password',
            'security_clearance_level',
            'employment_status_id',
        ];
        const criticalActions = ['DELETE', 'PERMISSION_DENIED'];
        return (criticalResources.includes(data.resource) ||
            criticalActions.includes(data.action) ||
            data.changed_fields?.some((field) => criticalFields.includes(field)) ||
            false);
    }
    async logAuth(action, user, ipAddress, userAgent, success = true, errorMessage) {
        await this.log({
            user,
            action,
            resource: 'authentication',
            ip_address: ipAddress,
            user_agent: userAgent,
            success,
            error_message: errorMessage,
            severity: success ? 'INFO' : 'CRITICAL',
        });
    }
    async logUserCreation({ actorUserId, actorEmail, newUser, req, }) {
        try {
            return await this.prisma.auditTrail.create({
                data: {
                    user_id: actorUserId ?? null,
                    user_email: actorEmail ?? null,
                    employee_id: newUser.employee_id ?? null,
                    action: 'CREATE',
                    resource: 'user_account',
                    resource_id: newUser.id,
                    old_values: undefined,
                    new_values: JSON.parse(JSON.stringify(newUser)),
                    change_fields: Object.keys(newUser),
                    ip_address: req.ip ?? undefined,
                    user_agent: req.headers['user-agent'] ?? null,
                    endpoint: `${req.method} ${req.originalUrl}`,
                    http_method: req.method,
                    status_code: 201,
                    success: true,
                },
            });
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error('Failed to create audit log:', error.message);
            }
            else {
                this.logger.error('Failed to create audit log:', error);
            }
        }
    }
    async logPermissionDenied(user, action, resource, ipAddress, endpoint) {
        await this.log({
            user,
            action: 'PERMISSION_DENIED',
            resource,
            ip_address: ipAddress,
            endpoint,
            success: false,
            error_message: `User attemped to ${action} ${resource} without permission`,
            severity: 'CRITICAL',
        });
    }
    async findLogs(filters) {
        const { user_id, employee_id, department_id, resource, action, start_date, end_date, success, severity, compliance_flag, limit = 100, offset = 0, } = filters;
        return this.prisma.auditTrail.findMany({
            where: {
                user_id,
                employee_id,
                department_id,
                resource,
                action,
                success,
                severity,
                compliance_flag,
                created_at: {
                    gte: start_date,
                    lte: end_date,
                },
            },
            orderBy: {
                created_at: 'desc',
            },
            take: limit,
            skip: offset,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        employee_id: true,
                    },
                },
            },
        });
    }
    async getResourceHistory(resource, resource_id) {
        return this.prisma.auditTrail.findMany({
            where: {
                resource,
                resource_id,
            },
            orderBy: {
                created_at: 'desc',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        username: true,
                    },
                },
            },
        });
    }
    async getUserActivity(user_id, days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        return this.prisma.auditTrail.findMany({
            where: {
                user_id,
                created_at: {
                    gte: startDate,
                },
            },
            orderBy: {
                created_at: 'desc',
            },
        });
    }
    async getDepartmentActivity(department_id, days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        return this.prisma.auditTrail.findMany({
            where: {
                department_id,
                created_at: {
                    gte: startDate,
                },
            },
            orderBy: {
                created_at: 'desc',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        username: true,
                    },
                },
            },
        });
    }
    async getComplianceLogs(days = 90) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        return this.prisma.auditTrail.findMany({
            where: {
                compliance_flag: true,
                created_at: {
                    gte: startDate,
                },
            },
            orderBy: {
                created_at: 'desc',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        username: true,
                    },
                },
            },
        });
    }
    async getSecurityIncidents(days = 7) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        return this.prisma.auditTrail.findMany({
            where: {
                OR: [
                    { severity: 'CRITICAL' },
                    { success: false },
                    { action: 'PERMISSION_DENIED' },
                ],
                created_at: {
                    gte: startDate,
                },
            },
            orderBy: {
                created_at: 'desc',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        username: true,
                    },
                },
            },
        });
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = AuditService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditService);
//# sourceMappingURL=audit.service.js.map