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
exports.EmployeeControllerV2 = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const swagger_response_helper_1 = require("../../../utils/helpers/swagger-response.helper");
const ability_constant_1 = require("../../../utils/constants/ability.constant");
const employee_person_dto_1 = require("./dto/employee-person.dto");
const pagination_dto_1 = require("../../../utils/dtos/pagination.dto");
const can_decorator_1 = require("../../../utils/decorators/can.decorator");
const session_user_decorator_1 = require("../../../utils/decorators/session-user.decorator");
const employee_service_1 = require("./employee.service");
let EmployeeControllerV2 = class EmployeeControllerV2 {
    employeeService;
    constructor(employeeService) {
        this.employeeService = employeeService;
    }
    getEmployees(user, dto) {
        return this.employeeService.getEmployees(user, dto);
    }
    getEmployee(id, user) {
        return this.employeeService.getEmployee(id, user);
    }
    createEmployee(createDto, user) {
        return this.employeeService.createEmployee(createDto, user);
    }
    updateEmployee(id, updateEmployeeWithDetailsDto, user) {
        return this.employeeService.updateEmployee(id, updateEmployeeWithDetailsDto, user);
    }
};
exports.EmployeeControllerV2 = EmployeeControllerV2;
__decorate([
    (0, common_1.Get)('employees'),
    (0, swagger_1.ApiOperation)({ summary: 'List of all employees' }),
    (0, swagger_response_helper_1.ApiGetResponse)('List of employees'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.EMPLOYEE_MASTERLIST }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], EmployeeControllerV2.prototype, "getEmployees", null);
__decorate([
    (0, common_1.Get)('employees/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'View employee profile' }),
    (0, swagger_response_helper_1.ApiGetResponse)('Employees information'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.EMPLOYEE_MASTERLIST }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EmployeeControllerV2.prototype, "getEmployee", null);
__decorate([
    (0, common_1.Post)('employees'),
    (0, swagger_1.ApiBody)({
        type: employee_person_dto_1.CreateEmployeeWithDetailsDto,
        description: 'Payload to create a new employee',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new Employee' }),
    (0, swagger_response_helper_1.ApiPostResponse)('Employee created successfully'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_CREATE, subject: ability_constant_1.EMPLOYEE_MASTERLIST }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [employee_person_dto_1.CreateEmployeeWithDetailsDto, Object]),
    __metadata("design:returntype", void 0)
], EmployeeControllerV2.prototype, "createEmployee", null);
__decorate([
    (0, common_1.Put)('employees/:id'),
    (0, swagger_1.ApiBody)({
        type: employee_person_dto_1.UpdateEmployeeWithDetailsDto,
        description: 'Payload to update a current employee',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Update a current Employee' }),
    (0, swagger_response_helper_1.ApiPatchResponse)('Employee information updated successfully'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_UPDATE, subject: ability_constant_1.EMPLOYEE_MASTERLIST }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, employee_person_dto_1.UpdateEmployeeWithDetailsDto, Object]),
    __metadata("design:returntype", void 0)
], EmployeeControllerV2.prototype, "updateEmployee", null);
exports.EmployeeControllerV2 = EmployeeControllerV2 = __decorate([
    (0, swagger_1.ApiTags)('Human Resources - Employees'),
    (0, common_1.Controller)({ path: 'hris', version: '2' }),
    __metadata("design:paramtypes", [employee_service_1.EmployeeService])
], EmployeeControllerV2);
//# sourceMappingURL=employeeV2.controller.js.map