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
exports.DashboardControllerv2 = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const can_decorator_1 = require("../../../utils/decorators/can.decorator");
const session_user_decorator_1 = require("../../../utils/decorators/session-user.decorator");
const ability_constant_1 = require("../../../utils/constants/ability.constant");
const swagger_response_helper_1 = require("../../../utils/helpers/swagger-response.helper");
const dashboard_service_1 = require("./dashboard.service");
let DashboardControllerv2 = class DashboardControllerv2 {
    dashboardService;
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    getAdminDashboard(user) {
        return this.dashboardService.getAdminDashboardStats(user);
    }
};
exports.DashboardControllerv2 = DashboardControllerv2;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Summary of Users' }),
    (0, swagger_response_helper_1.ApiGetResponse)('Adminstrator Dashboard'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.DASHBOARD }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DashboardControllerv2.prototype, "getAdminDashboard", null);
exports.DashboardControllerv2 = DashboardControllerv2 = __decorate([
    (0, swagger_1.ApiTags)('Administrator - Dashboard'),
    (0, common_1.Controller)({ path: 'administrator', version: '2' }),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardControllerv2);
//# sourceMappingURL=dashboardV2.controller.js.map