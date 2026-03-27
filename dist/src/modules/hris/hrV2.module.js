"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HrV2Module = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../config/prisma/prisma.service");
const employee_service_1 = require("./employee_masterlist/employee.service");
const employeeV2_controller_1 = require("./employee_masterlist/employeeV2.controller");
const dashboard_service_1 = require("./dashboard/dashboard.service");
const dashboardV2_controller_1 = require("./dashboard/dashboardV2.controller");
const auth_module_1 = require("../../auth/auth.module");
const administratorV2_module_1 = require("../administrator/administratorV2.module");
const career_posting_service_1 = require("./career-posting/career-posting.service");
const career_posting_v2_controller_1 = require("./career-posting/career-posting-v2.controller");
const hiring_pipeline_service_1 = require("./hiring-pipeline/hiring-pipeline.service");
const hiring_pipelineV2_controller_1 = require("./hiring-pipeline/hiring-pipelineV2.controller");
let HrV2Module = class HrV2Module {
};
exports.HrV2Module = HrV2Module;
exports.HrV2Module = HrV2Module = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, administratorV2_module_1.AdministratorV2Module],
        providers: [
            employee_service_1.EmployeeService,
            prisma_service_1.PrismaService,
            dashboard_service_1.DashboardService,
            career_posting_service_1.CareerPostingService,
            hiring_pipeline_service_1.HiringPipelineService,
            hiring_pipeline_service_1.InterviewApplicantService,
        ],
        controllers: [
            employeeV2_controller_1.EmployeeControllerV2,
            dashboardV2_controller_1.DashboardControllerV2,
            career_posting_v2_controller_1.CareerPostingV2Controller,
            hiring_pipelineV2_controller_1.ApplicantsController,
            hiring_pipelineV2_controller_1.InterviewApplicantController,
        ],
        exports: [HrV2Module],
    })
], HrV2Module);
//# sourceMappingURL=hrV2.module.js.map