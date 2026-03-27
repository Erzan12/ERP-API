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
exports.DashboardControllerV2 = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dashboard_service_1 = require("./dashboard.service");
const swagger_response_helper_1 = require("../../../utils/helpers/swagger-response.helper");
const can_decorator_1 = require("../../../utils/decorators/can.decorator");
const ability_constant_1 = require("../../../utils/constants/ability.constant");
let DashboardControllerV2 = class DashboardControllerV2 {
    dashboardService;
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    getHrDashboard() {
        return this.dashboardService.getHRDashboard();
    }
};
exports.DashboardControllerV2 = DashboardControllerV2;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Summary of the employees' }),
    (0, swagger_response_helper_1.ApiGetResponse)('Dashboard'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.EMPLOYEE_MASTERLIST }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardControllerV2.prototype, "getHrDashboard", null);
exports.DashboardControllerV2 = DashboardControllerV2 = __decorate([
    (0, swagger_1.ApiTags)('Human Resources - Dashboard'),
    (0, common_1.Controller)({ path: 'hris', version: '2' }),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardControllerV2);
//# sourceMappingURL=dashboardV2.controller.js.map