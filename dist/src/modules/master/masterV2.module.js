"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterV2Module = void 0;
const common_1 = require("@nestjs/common");
const position_service_1 = require("./position/position.service");
const position_dto_1 = require("./position/dto/position.dto");
const department_service_1 = require("./department/department.service");
const department_dto_1 = require("./department/dto/department.dto");
const company_service_1 = require("./company/company.service");
const company_dto_1 = require("./company/dto/company.dto");
const division_service_1 = require("./division/division.service");
const division_dto_1 = require("./division/dto/division.dto");
const positionV2_controller_1 = require("./position/positionV2.controller");
const departmentV2_controller_1 = require("./department/departmentV2.controller");
const companyV2_controller_1 = require("./company/companyV2.controller");
const divisionV2_controller_1 = require("./division/divisionV2.controller");
const employment_status_service_1 = require("./employment_status/employment_status.service");
const employment_statusV2_controller_1 = require("./employment_status/employment_statusV2.controller");
const prisma_service_1 = require("../../config/prisma/prisma.service");
const user_location_service_1 = require("./user_location/user_location.service");
const auth_module_1 = require("../../auth/auth.module");
const user_locationV2_controller_1 = require("./user_location/user_locationV2.controller");
let MasterV2Module = class MasterV2Module {
};
exports.MasterV2Module = MasterV2Module;
exports.MasterV2Module = MasterV2Module = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        providers: [
            prisma_service_1.PrismaService,
            position_service_1.PositionService,
            department_service_1.DepartmentService,
            company_service_1.CompanyService,
            division_service_1.DivisionService,
            employment_status_service_1.EmploymentStatusService,
            division_dto_1.CreateDivisionDto,
            department_dto_1.CreateDepartmentDto,
            position_dto_1.CreatePositionDto,
            company_dto_1.CreateCompanyDto,
            user_location_service_1.UserLocationService,
        ],
        controllers: [
            positionV2_controller_1.PositionControllerV2,
            departmentV2_controller_1.DepartmentControllerV2,
            companyV2_controller_1.CompanyControllerV2,
            divisionV2_controller_1.DivisionControllerV2,
            employment_statusV2_controller_1.EmploymentStatusControllerV2,
            user_locationV2_controller_1.UserLocationControllerV2,
        ],
        exports: [],
    })
], MasterV2Module);
//# sourceMappingURL=masterV2.module.js.map