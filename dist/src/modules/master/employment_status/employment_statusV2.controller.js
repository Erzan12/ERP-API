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
exports.EmploymentStatusControllerV2 = void 0;
const common_1 = require("@nestjs/common");
const employment_status_service_1 = require("./employment_status.service");
const can_decorator_1 = require("../../../utils/decorators/can.decorator");
const session_user_decorator_1 = require("../../../utils/decorators/session-user.decorator");
const employee_status_dto_1 = require("./dto/employee-status.dto");
const swagger_1 = require("@nestjs/swagger");
const swagger_response_helper_1 = require("../../../utils/helpers/swagger-response.helper");
const ability_constant_1 = require("../../../utils/constants/ability.constant");
const pagination_dto_1 = require("../../../utils/dtos/pagination.dto");
let EmploymentStatusControllerV2 = class EmploymentStatusControllerV2 {
    employmentStatusService;
    constructor(employmentStatusService) {
        this.employmentStatusService = employmentStatusService;
    }
    getEmployeeStats(user, dto) {
        return this.employmentStatusService.getEmployeeStats(user, dto);
    }
    getEmployeeStat(employeeStatusId, user) {
        return this.employmentStatusService.getEmployeeStat(employeeStatusId, user);
    }
    createEmployeeStatus(createEmpStat, user) {
        return this.employmentStatusService.createEmployeeStatus(createEmpStat, user);
    }
    updateEmployeeStatus(employeeStatusId, updateEmployeeStatusDto, user) {
        return this.employmentStatusService.updateEmployeeStatus(employeeStatusId, updateEmployeeStatusDto, user);
    }
};
exports.EmploymentStatusControllerV2 = EmploymentStatusControllerV2;
__decorate([
    (0, common_1.Get)('employment_status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all employment status' }),
    (0, swagger_response_helper_1.ApiGetResponse)('Here are the list of available employment status'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.MASTERTABLES }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], EmploymentStatusControllerV2.prototype, "getEmployeeStats", null);
__decorate([
    (0, common_1.Get)('employment_status/:employeeStatusId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get an employment status.' }),
    (0, swagger_response_helper_1.ApiGetResponse)('Here is the employment status.'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.MASTERTABLES }),
    __param(0, (0, common_1.Param)('employeeStatusId', new common_1.ParseUUIDPipe())),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EmploymentStatusControllerV2.prototype, "getEmployeeStat", null);
__decorate([
    (0, common_1.Post)('employment_status/'),
    (0, swagger_1.ApiBody)({
        type: employee_status_dto_1.CreateEmployeeStatusDto,
        description: 'Payload to create employee status.',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Create new employee status.' }),
    (0, swagger_response_helper_1.ApiPostResponse)('Employee status created successfully.'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.MASTERTABLES }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [employee_status_dto_1.CreateEmployeeStatusDto, Object]),
    __metadata("design:returntype", void 0)
], EmploymentStatusControllerV2.prototype, "createEmployeeStatus", null);
__decorate([
    (0, common_1.Put)('employment_status/:employeeStatusId'),
    (0, swagger_1.ApiOperation)({ summary: 'Updating employee status details.' }),
    (0, swagger_response_helper_1.ApiPatchResponse)('Employee status details updated successfully.'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_UPDATE, subject: ability_constant_1.MASTERTABLES }),
    __param(0, (0, common_1.Param)('employeeStatusId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, employee_status_dto_1.UpdateEmployeeStatusDto, Object]),
    __metadata("design:returntype", void 0)
], EmploymentStatusControllerV2.prototype, "updateEmployeeStatus", null);
exports.EmploymentStatusControllerV2 = EmploymentStatusControllerV2 = __decorate([
    (0, swagger_1.ApiTags)('Mastertable - Employment Status'),
    (0, common_1.Controller)({ path: 'mastertable', version: '2' }),
    __metadata("design:paramtypes", [employment_status_service_1.EmploymentStatusService])
], EmploymentStatusControllerV2);
//# sourceMappingURL=employment_statusV2.controller.js.map