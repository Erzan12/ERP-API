"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const prisma_service_1 = require("../config/prisma/prisma.service");
const jwt_strategy_1 = require("../middleware/jwt/jwt.strategy");
const mail_service_1 = require("../jobs/mail/mail.service");
const audit_service_1 = require("../modules/administrator/audit/audit.service");
const casl_service_1 = require("../middleware/casl/casl.service");
const casl_module_1 = require("../middleware/casl/casl.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [casl_module_1.CaslModule],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            prisma_service_1.PrismaService,
            jwt_strategy_1.JwtStrategy,
            jwt_1.JwtService,
            mail_service_1.MailService,
            config_1.ConfigService,
            audit_service_1.AuditService,
            casl_service_1.CaslAbilityService,
        ],
        exports: [AuthModule, jwt_strategy_1.JwtStrategy],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map