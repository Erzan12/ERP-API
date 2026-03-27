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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditControllerV2 = void 0;
const common_1 = require("@nestjs/common");
const audit_service_1 = require("./audit.service");
const swagger_1 = require("@nestjs/swagger");
const can_decorator_1 = require("../../../utils/decorators/can.decorator");
const security_clearance_decorator_1 = require("../../../middleware/security_clearance/security-clearance.decorator");
const session_user_decorator_1 = require("../../../utils/decorators/session-user.decorator");
const ability_constant_1 = require("../../../utils/constants/ability.constant");
let AuditControllerV2 = class AuditControllerV2 {
    auditService;
    constructor(auditService) {
        this.auditService = auditService;
    }
    getAuditLogs(userId, resource, action, startDate, endDate, success, limit, offset) {
        return this.auditService.findLogs({
            user_id: userId,
            resource,
            action,
            start_date: startDate ? new Date(startDate) : undefined,
            end_date: endDate ? new Date(endDate) : undefined,
            success,
            limit,
            offset,
        });
    }
    getResourceHistory(resource, id) {
        return this.auditService.getResourceHistory(resource, id);
    }
    getUserActivity(userId, days) {
        return this.auditService.getUserActivity(userId, days);
    }
    getMyActivity(user, days) {
        return this.auditService.getUserActivity(user.id, days);
    }
};
exports.AuditControllerV2 = AuditControllerV2;
__decorate([
    (0, common_1.Get)('audit'),
    (0, swagger_1.ApiOperation)({ summary: 'Get audit logs with filters' }),
    (0, security_clearance_decorator_1.SecurityClearance)(ability_constant_1.SEC_LVL_8),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.AUDIT_TRAIL }),
    __param(0, (0, common_1.Query)('user_id')),
    __param(1, (0, common_1.Query)('resource')),
    __param(2, (0, common_1.Query)('action')),
    __param(3, (0, common_1.Query)('start_date')),
    __param(4, (0, common_1.Query)('end_date')),
    __param(5, (0, common_1.Query)('success')),
    __param(6, (0, common_1.Query)('limit')),
    __param(7, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Boolean, Number, Number]),
    __metadata("design:returntype", void 0)
], AuditControllerV2.prototype, "getAuditLogs", null);
__decorate([
    (0, common_1.Get)('audit/resource/:resource/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get audit history fo ra specific resource' }),
    (0, security_clearance_decorator_1.SecurityClearance)(ability_constant_1.SEC_LVL_8),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.AUDIT_TRAIL }),
    __param(0, (0, common_1.Param)('resource')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AuditControllerV2.prototype, "getResourceHistory", null);
__decorate([
    (0, common_1.Get)('audit/user/:id/activity'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user activity report' }),
    (0, security_clearance_decorator_1.SecurityClearance)(ability_constant_1.SEC_LVL_8),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.AUDIT_TRAIL }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], AuditControllerV2.prototype, "getUserActivity", null);
__decorate([
    (0, common_1.Get)('audit/my-activity'),
    (0, swagger_1.ApiOperation)({ summary: 'Get own activity report' }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], AuditControllerV2.prototype, "getMyActivity", null);
exports.AuditControllerV2 = AuditControllerV2 = __decorate([
    (0, swagger_1.ApiTags)('Administrator - Audit'),
    (0, common_1.Controller)({ path: 'administrator', version: '2' }),
    __metadata("design:paramtypes", [audit_service_1.AuditService])
], AuditControllerV2);
//# sourceMappingURL=auditV2.controller.js.map