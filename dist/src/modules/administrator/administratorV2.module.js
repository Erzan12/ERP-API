"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdministratorV2Module = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../../auth/auth.module");
const jwt_1 = require("@nestjs/jwt");
const mail_service_1 = require("../../jobs/mail/mail.service");
const sub_module_service_1 = require("./sub_module/sub_module.service");
const roleV2_controller_1 = require("./role/roleV2.controller");
const role_service_1 = require("./role/role.service");
const module_service_1 = require("./module/module.service");
const moduleV2_controller_1 = require("./module/moduleV2.controller");
const sub_moduleV2_controller_1 = require("./sub_module/sub_moduleV2.controller");
const security_clearance_service_1 = require("./security_clearance/security-clearance.service");
const security_clearanceV2_controller_1 = require("./security_clearance/security-clearanceV2.controller");
const prisma_service_1 = require("../../config/prisma/prisma.service");
const employment_status_service_1 = require("../master/employment_status/employment_status.service");
const jwt_strategy_1 = require("../../middleware/jwt/jwt.strategy");
const auditV2_controller_1 = require("./audit/auditV2.controller");
const audit_service_1 = require("./audit/audit.service");
const dashboardV2_controller_1 = require("./dashboard/dashboardV2.controller");
const dashboard_service_1 = require("./dashboard/dashboard.service");
const health_controller_1 = require("./health/health.controller");
const terminus_1 = require("@nestjs/terminus");
const db_query_controller_1 = require("./db-query/db-query.controller");
const db_query_service_1 = require("./db-query/db-query.service");
const slack_module_1 = require("../../jobs/slack/slack.module");
const axios_1 = require("@nestjs/axios");
const slack_service_1 = require("../../jobs/slack/slack.service");
let AdministratorV2Module = class AdministratorV2Module {
};
exports.AdministratorV2Module = AdministratorV2Module;
exports.AdministratorV2Module = AdministratorV2Module = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, terminus_1.TerminusModule, slack_module_1.SlackModule, axios_1.HttpModule],
        controllers: [
            sub_moduleV2_controller_1.SubModuleControllerV2,
            moduleV2_controller_1.ModuleControllerV2,
            roleV2_controller_1.RoleControllerV2,
            security_clearanceV2_controller_1.SecurityClearanceControllerV2,
            dashboardV2_controller_1.DashboardControllerv2,
            auditV2_controller_1.AuditControllerV2,
            health_controller_1.HealthController,
            db_query_controller_1.DbQueryControllerV2,
        ],
        providers: [
            jwt_strategy_1.JwtStrategy,
            jwt_1.JwtService,
            prisma_service_1.PrismaService,
            mail_service_1.MailService,
            sub_module_service_1.SubModuleService,
            module_service_1.ModuleService,
            role_service_1.RoleService,
            employment_status_service_1.EmploymentStatusService,
            security_clearance_service_1.SecurityClearanceService,
            dashboard_service_1.DashboardService,
            audit_service_1.AuditService,
            db_query_service_1.DbQueryService,
            slack_service_1.SlackService,
        ],
        exports: [AdministratorV2Module],
    })
], AdministratorV2Module);
//# sourceMappingURL=administratorV2.module.js.map