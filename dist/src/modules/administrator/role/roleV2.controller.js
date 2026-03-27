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
exports.RoleControllerV2 = void 0;
const common_1 = require("@nestjs/common");
const role_service_1 = require("./role.service");
const can_decorator_1 = require("../../../utils/decorators/can.decorator");
const session_user_decorator_1 = require("../../../utils/decorators/session-user.decorator");
const role_dto_1 = require("./dto/role.dto");
const create_role_permission_dto_1 = require("./dto/create-role-permission.dto");
const update_role_permisisons_dto_1 = require("./dto/update-role-permisisons.dto");
const swagger_1 = require("@nestjs/swagger");
const swagger_response_helper_1 = require("../../../utils/helpers/swagger-response.helper");
const ability_constant_1 = require("../../../utils/constants/ability.constant");
const pagination_dto_1 = require("../../../utils/dtos/pagination.dto");
let RoleControllerV2 = class RoleControllerV2 {
    roleService;
    constructor(roleService) {
        this.roleService = roleService;
    }
    getRoles(user, dto) {
        return this.roleService.getRoles(user, dto);
    }
    getRole(id, user) {
        return this.roleService.getRole(id, user);
    }
    createRole(createRoleDto, user) {
        return this.roleService.createRole(createRoleDto, user);
    }
    updateRole(dto, roleId, user) {
        return this.roleService.updateRole(dto, user, roleId);
    }
    createRolePermission(createRolePermissionDto, user) {
        return this.roleService.createRolePermissions(createRolePermissionDto, user);
    }
    updateRolePermissions(id, updateRolePermissionsDto, user) {
        return this.roleService.updateRolePermissions(id, updateRolePermissionsDto, user);
    }
};
exports.RoleControllerV2 = RoleControllerV2;
__decorate([
    (0, common_1.Get)('roles'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all Roles' }),
    (0, swagger_response_helper_1.ApiGetResponse)('Here are the list of Roles'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.SYSTEM_MANAGEMENT }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], RoleControllerV2.prototype, "getRoles", null);
__decorate([
    (0, common_1.Get)('roles/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a role' }),
    (0, swagger_response_helper_1.ApiGetResponse)('Here is the Role'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.SYSTEM_MANAGEMENT }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RoleControllerV2.prototype, "getRole", null);
__decorate([
    (0, common_1.Post)('roles'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new role' }),
    (0, swagger_response_helper_1.ApiPostResponse)('Role created successfully'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_CREATE, subject: ability_constant_1.SYSTEM_MANAGEMENT }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [role_dto_1.CreateRoleDto, Object]),
    __metadata("design:returntype", void 0)
], RoleControllerV2.prototype, "createRole", null);
__decorate([
    (0, common_1.Put)('roles/:roleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update current role' }),
    (0, swagger_response_helper_1.ApiPostResponse)('Role updated successfully'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_UPDATE, subject: ability_constant_1.SYSTEM_MANAGEMENT }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('roleId', new common_1.ParseUUIDPipe())),
    __param(2, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [role_dto_1.UpdateRoleDto, String, Object]),
    __metadata("design:returntype", void 0)
], RoleControllerV2.prototype, "updateRole", null);
__decorate([
    (0, common_1.Put)('roles/role_permission'),
    (0, swagger_1.ApiOperation)({ summary: 'Adding permission to role' }),
    (0, swagger_response_helper_1.ApiPostResponse)('Permissions added to role'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_CREATE, subject: ability_constant_1.SYSTEM_MANAGEMENT }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_role_permission_dto_1.CreateRolePermissionDto, Object]),
    __metadata("design:returntype", void 0)
], RoleControllerV2.prototype, "createRolePermission", null);
__decorate([
    (0, common_1.Put)('roles/role_permission/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Updating current permission to role' }),
    (0, swagger_response_helper_1.ApiPatchResponse)('Permissions updated to role'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_UPDATE, subject: ability_constant_1.SYSTEM_MANAGEMENT }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_role_permisisons_dto_1.UpdateRolePermissionsDto, Object]),
    __metadata("design:returntype", void 0)
], RoleControllerV2.prototype, "updateRolePermissions", null);
exports.RoleControllerV2 = RoleControllerV2 = __decorate([
    (0, swagger_1.ApiTags)('Administrator - Role'),
    (0, common_1.Controller)({ path: 'administrator', version: '2' }),
    __metadata("design:paramtypes", [role_service_1.RoleService])
], RoleControllerV2);
//# sourceMappingURL=roleV2.controller.js.map