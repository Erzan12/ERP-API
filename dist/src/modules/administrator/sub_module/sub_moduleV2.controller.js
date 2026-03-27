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
exports.SubModuleControllerV2 = void 0;
const common_1 = require("@nestjs/common");
const can_decorator_1 = require("../../../utils/decorators/can.decorator");
const create_sub_module_dto_1 = require("./dto/create-sub-module.dto");
const assign_sub_module_permission_dto_1 = require("./dto/assign-sub-module-permission.dto");
const session_user_decorator_1 = require("../../../utils/decorators/session-user.decorator");
const sub_module_service_1 = require("./sub_module.service");
const swagger_1 = require("@nestjs/swagger");
const add_sub_module_permission_dto_1 = require("./dto/add-sub-module-permission.dto");
const swagger_response_helper_1 = require("../../../utils/helpers/swagger-response.helper");
const update_sub_module_permisison_dto_1 = require("./dto/update-sub-module-permisison.dto");
const ability_constant_1 = require("../../../utils/constants/ability.constant");
const pagination_dto_1 = require("../../../utils/dtos/pagination.dto");
let SubModuleControllerV2 = class SubModuleControllerV2 {
    subModuleService;
    constructor(subModuleService) {
        this.subModuleService = subModuleService;
    }
    getSubmodules(user, dto) {
        return this.subModuleService.getSubModules(user, dto);
    }
    getSubModuleActions(user) {
        return this.subModuleService.getSubModuleActions(user);
    }
    getSubmodule(subModuleId, user) {
        return this.subModuleService.getSubmodule(subModuleId, user);
    }
    createSubModule(createSubModuleDto, user) {
        return this.subModuleService.createSubModule(createSubModuleDto, user);
    }
    createPermission(addSubModuleDto, user) {
        console.log('createSubModuleDto:', add_sub_module_permission_dto_1.AddSubModulePermissionDto);
        return this.subModuleService.addSubModuleAction(addSubModuleDto, user);
    }
    createSubModulePermission(assignSubModulePermissionDto, user) {
        return this.subModuleService.assignSubModulePermissions(assignSubModulePermissionDto, user);
    }
    updatePermission(dto, user, id) {
        return this.subModuleService.updateSubModuleAction(dto, user, id);
    }
};
exports.SubModuleControllerV2 = SubModuleControllerV2;
__decorate([
    (0, common_1.Get)('sub-modules'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Submodules' }),
    (0, swagger_response_helper_1.ApiGetResponse)('Here are all the Sub modules available'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.SYSTEM_MANAGEMENT }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], SubModuleControllerV2.prototype, "getSubmodules", null);
__decorate([
    (0, common_1.Get)('sub-modules/permissions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Submodule actions/permissions' }),
    (0, swagger_response_helper_1.ApiGetResponse)('Here are the list of Submodule actions/permissions available'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.SYSTEM_MANAGEMENT }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SubModuleControllerV2.prototype, "getSubModuleActions", null);
__decorate([
    (0, common_1.Get)('sub-modules/:subModuleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a Submodule' }),
    (0, swagger_response_helper_1.ApiGetResponse)('status: Success!'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.SYSTEM_MANAGEMENT }),
    __param(0, (0, common_1.Param)('subModuleId', new common_1.ParseUUIDPipe())),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SubModuleControllerV2.prototype, "getSubmodule", null);
__decorate([
    (0, common_1.Post)('sub-modules'),
    (0, swagger_1.ApiBody)({
        type: create_sub_module_dto_1.CreateSubModuleDto,
        description: 'Payload to create Submodule',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new Submodule' }),
    (0, swagger_response_helper_1.ApiPostResponse)('Submodule created successfully'),
    (0, can_decorator_1.Can)({ action: 'create', subject: 'System Management' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sub_module_dto_1.CreateSubModuleDto, Object]),
    __metadata("design:returntype", void 0)
], SubModuleControllerV2.prototype, "createSubModule", null);
__decorate([
    (0, common_1.Post)('sub-modules/permissions'),
    (0, swagger_1.ApiBody)({
        type: add_sub_module_permission_dto_1.AddSubModulePermissionDto,
        description: 'Payload to create permissions for submodule',
    }),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new permissions/actions for submodule(acts as inventory of actions for submodules)',
    }),
    (0, swagger_response_helper_1.ApiPostResponse)('Permission created successfully'),
    (0, can_decorator_1.Can)({ action: 'create', subject: 'System Management' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_sub_module_permission_dto_1.AddSubModulePermissionDto, Object]),
    __metadata("design:returntype", void 0)
], SubModuleControllerV2.prototype, "createPermission", null);
__decorate([
    (0, common_1.Put)('sub-modules/permissions'),
    (0, swagger_1.ApiBody)({
        type: assign_sub_module_permission_dto_1.AssignSubModulePermissionDto,
        description: 'Payload to assign permissions for submodule',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Assign a new permission for submodule' }),
    (0, swagger_response_helper_1.ApiPostResponse)('Permission assigned to a submodule successfully'),
    (0, can_decorator_1.Can)({ action: 'create', subject: 'System Management' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assign_sub_module_permission_dto_1.AssignSubModulePermissionDto, Object]),
    __metadata("design:returntype", void 0)
], SubModuleControllerV2.prototype, "createSubModulePermission", null);
__decorate([
    (0, common_1.Put)('sub-module/permissions/:id'),
    (0, swagger_1.ApiBody)({
        type: update_sub_module_permisison_dto_1.UpdateSubModulePermisisonDto,
        description: 'Payload to update the current sub module permission',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Update a current sub module permission' }),
    (0, swagger_response_helper_1.ApiPatchResponse)('Sub module permission updated successfully'),
    (0, can_decorator_1.Can)({ action: 'update', subject: 'System Management' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __param(2, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_sub_module_permisison_dto_1.UpdateSubModulePermisisonDto, Object, String]),
    __metadata("design:returntype", void 0)
], SubModuleControllerV2.prototype, "updatePermission", null);
exports.SubModuleControllerV2 = SubModuleControllerV2 = __decorate([
    (0, swagger_1.ApiTags)('Administrator - Submodule'),
    (0, common_1.Controller)({ path: 'administrator', version: '2' }),
    __metadata("design:paramtypes", [sub_module_service_1.SubModuleService])
], SubModuleControllerV2);
//# sourceMappingURL=sub_moduleV2.controller.js.map