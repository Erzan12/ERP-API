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
exports.DepartmentControllerV2 = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const swagger_response_helper_1 = require("../../../utils/helpers/swagger-response.helper");
const ability_constant_1 = require("../../../utils/constants/ability.constant");
const can_decorator_1 = require("../../../utils/decorators/can.decorator");
const session_user_decorator_1 = require("../../../utils/decorators/session-user.decorator");
const department_dto_1 = require("./dto/department.dto");
const pagination_dto_1 = require("../../../utils/dtos/pagination.dto");
const department_service_1 = require("./department.service");
let DepartmentControllerV2 = class DepartmentControllerV2 {
    departmentService;
    constructor(departmentService) {
        this.departmentService = departmentService;
    }
    getDepartments(user, dto) {
        return this.departmentService.getDepartments(user, dto);
    }
    getDepartment(departmentId, user) {
        return this.departmentService.getDepartment(departmentId, user);
    }
    createDepartment(createDepartmentDto, user) {
        return this.departmentService.createDepartment(createDepartmentDto, user);
    }
    updateDepartment(departmentId, updateDeptDto, user) {
        return this.departmentService.updateDepartment(departmentId, updateDeptDto, user);
    }
};
exports.DepartmentControllerV2 = DepartmentControllerV2;
__decorate([
    (0, common_1.Get)('departments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all departments' }),
    (0, swagger_response_helper_1.ApiGetResponse)('List of departments available'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.MASTERTABLES }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], DepartmentControllerV2.prototype, "getDepartments", null);
__decorate([
    (0, common_1.Get)('departments/:departmentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a department' }),
    (0, swagger_response_helper_1.ApiGetResponse)('Here is the department'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.MASTERTABLES }),
    __param(0, (0, common_1.Param)('departmentId', new common_1.ParseUUIDPipe())),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DepartmentControllerV2.prototype, "getDepartment", null);
__decorate([
    (0, common_1.Post)('departments'),
    (0, swagger_1.ApiBody)({
        type: department_dto_1.CreateDepartmentDto,
        description: 'Payload to create Department',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new department' }),
    (0, swagger_response_helper_1.ApiPostResponse)('Department created successfully'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_CREATE, subject: ability_constant_1.MASTERTABLES }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [department_dto_1.CreateDepartmentDto, Object]),
    __metadata("design:returntype", void 0)
], DepartmentControllerV2.prototype, "createDepartment", null);
__decorate([
    (0, common_1.Put)('departments/:departmentId'),
    (0, swagger_1.ApiBody)({
        type: department_dto_1.UpdateDepartmentDto,
        description: 'Payload to update department',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Update a current department information' }),
    (0, swagger_response_helper_1.ApiPatchResponse)('Department updated successfully'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_UPDATE, subject: ability_constant_1.MASTERTABLES }),
    __param(0, (0, common_1.Param)('departmentId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, department_dto_1.UpdateDepartmentDto, Object]),
    __metadata("design:returntype", void 0)
], DepartmentControllerV2.prototype, "updateDepartment", null);
exports.DepartmentControllerV2 = DepartmentControllerV2 = __decorate([
    (0, swagger_1.ApiTags)('Mastertable - Department'),
    (0, common_1.Controller)({ path: 'mastertable', version: '2' }),
    __metadata("design:paramtypes", [department_service_1.DepartmentService])
], DepartmentControllerV2);
//# sourceMappingURL=departmentV2.controller.js.map