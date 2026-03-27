"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./config/prisma/prisma.module");
const casl_module_1 = require("./middleware/casl/casl.module");
const landing_module_1 = require("./landing/landing.module");
const auth_module_1 = require("./auth/auth.module");
const jwt_1 = require("@nestjs/jwt");
const administratorV2_module_1 = require("./modules/administrator/administratorV2.module");
const hrV2_module_1 = require("./modules/hris/hrV2.module");
const managerV2_module_1 = require("./modules/manager/managerV2.module");
const masterV2_module_1 = require("./modules/master/masterV2.module");
const user_managementV2_module_1 = require("./modules/manager/user_management/user_managementV2.module");
const permission_guard_1 = require("./middleware/guards/permission.guard");
const jwt_auth_guard_1 = require("./middleware/jwt/jwt.auth.guard");
const security_clearance_guard_1 = require("./middleware/security_clearance/security-clearance.guard");
const core_1 = require("@nestjs/core");
const auth_controller_1 = require("./auth/auth.controller");
const user_management_service_1 = require("./modules/manager/user_management/user_management.service");
const audit_service_1 = require("./modules/administrator/audit/audit.service");
const position_service_1 = require("./modules/master/position/position.service");
const employee_service_1 = require("./modules/hris/employee_masterlist/employee.service");
const casl_service_1 = require("./middleware/casl/casl.service");
const department_service_1 = require("./modules/master/department/department.service");
const employment_status_service_1 = require("./modules/master/employment_status/employment_status.service");
const company_service_1 = require("./modules/master/company/company.service");
const prisma_service_1 = require("./config/prisma/prisma.service");
const division_service_1 = require("./modules/master/division/division.service");
const mail_service_1 = require("./jobs/mail/mail.service");
const user_location_service_1 = require("./modules/master/user_location/user_location.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            landing_module_1.LandingModule,
            auth_module_1.AuthModule,
            jwt_1.JwtModule,
            administratorV2_module_1.AdministratorV2Module,
            masterV2_module_1.MasterV2Module,
            casl_module_1.CaslModule,
            hrV2_module_1.HrV2Module,
            managerV2_module_1.ManagerV2Module,
            user_managementV2_module_1.UserManagementV2Module,
            prisma_module_1.PrismaModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.CustomJwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: permission_guard_1.PermissionsGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: security_clearance_guard_1.SecurityClearanceGuard,
            },
            user_management_service_1.UserManagementService,
            prisma_service_1.PrismaService,
            audit_service_1.AuditService,
            mail_service_1.MailService,
            employee_service_1.EmployeeService,
            position_service_1.PositionService,
            department_service_1.DepartmentService,
            casl_service_1.CaslAbilityService,
            division_service_1.DivisionService,
            company_service_1.CompanyService,
            employment_status_service_1.EmploymentStatusService,
            user_location_service_1.UserLocationService,
        ],
        controllers: [
            auth_controller_1.AuthController,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map