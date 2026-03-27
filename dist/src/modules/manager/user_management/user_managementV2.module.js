"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManagementV2Module = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const auth_service_1 = require("../../../auth/auth.service");
const auth_module_1 = require("../../../auth/auth.module");
const mail_service_1 = require("../../../jobs/mail/mail.service");
const prisma_service_1 = require("../../../config/prisma/prisma.service");
const jwt_strategy_1 = require("../../../middleware/jwt/jwt.strategy");
const audit_service_1 = require("../../administrator/audit/audit.service");
const user_management_service_1 = require("./user_management.service");
const user_managementV2_controller_1 = require("./user_managementV2.controller");
let UserManagementV2Module = class UserManagementV2Module {
};
exports.UserManagementV2Module = UserManagementV2Module;
exports.UserManagementV2Module = UserManagementV2Module = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        controllers: [user_managementV2_controller_1.UserManagementControllerV2],
        providers: [
            user_management_service_1.UserManagementService,
            prisma_service_1.PrismaService,
            auth_service_1.AuthService,
            jwt_strategy_1.JwtStrategy,
            jwt_1.JwtService,
            mail_service_1.MailService,
            audit_service_1.AuditService,
        ],
        exports: [auth_service_1.AuthService, user_management_service_1.UserManagementService],
    })
], UserManagementV2Module);
//# sourceMappingURL=user_managementV2.module.js.map