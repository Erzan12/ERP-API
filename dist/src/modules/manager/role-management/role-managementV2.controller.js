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
exports.RoleManagementControllerV2 = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const swagger_response_helper_1 = require("../../../utils/helpers/swagger-response.helper");
const role_management_service_1 = require("./role-management.service");
const can_decorator_1 = require("../../../utils/decorators/can.decorator");
const ability_constant_1 = require("../../../utils/constants/ability.constant");
const session_user_decorator_1 = require("../../../utils/decorators/session-user.decorator");
const security_clearance_decorator_1 = require("../../../middleware/security_clearance/security-clearance.decorator");
const add_user_role_permissions_dto_1 = require("./dto/add-user-role-permissions.dto");
const pagination_dto_1 = require("../../../utils/dtos/pagination.dto");
let RoleManagementControllerV2 = class RoleManagementControllerV2 {
    roleManagementService;
    constructor(roleManagementService) {
        this.roleManagementService = roleManagementService;
    }
    getRoles(user, dto) {
        return this.roleManagementService.getRoles(user, dto);
    }
    getRole(user, roleId) {
        return this.roleManagementService.getRole(roleId, user);
    }
    getMyPermissions(user) {
        return this.roleManagementService.getUserPermissions(user.id);
    }
    addUserRole(requestUser, userId, roleName) {
        return this.roleManagementService.addRoleUser(requestUser, userId, roleName);
    }
    addRolePermission(addUserRolePermissionsDto, user) {
        return this.roleManagementService.addUserRolePermissions(addUserRolePermissionsDto.userId, addUserRolePermissionsDto.rolePermissionIds, user);
    }
};
exports.RoleManagementControllerV2 = RoleManagementControllerV2;
__decorate([
    (0, common_1.Get)('roles'),
    (0, swagger_1.ApiOperation)({ summary: 'Get All Roles' }),
    (0, swagger_response_helper_1.ApiGetResponse)('Here are the list of Roles'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.ROLE_MANAGEMENT }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], RoleManagementControllerV2.prototype, "getRoles", null);
__decorate([
    (0, common_1.Get)('roles/:roleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get All Roles' }),
    (0, swagger_response_helper_1.ApiGetResponse)('Here are the list of Roles'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.ROLE_MANAGEMENT }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Param)('roleId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], RoleManagementControllerV2.prototype, "getRole", null);
__decorate([
    (0, common_1.Get)('me/permissions'),
    (0, swagger_1.ApiOperation)({ summary: 'My User Account' }),
    (0, swagger_response_helper_1.ApiGetResponse)('My user account'),
    (0, swagger_response_helper_1.ApiSecurityClearance)(ability_constant_1.SEC_LVL_5),
    (0, security_clearance_decorator_1.SecurityClearance)(ability_constant_1.SEC_LVL_5),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.ROLE_MANAGEMENT }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RoleManagementControllerV2.prototype, "getMyPermissions", null);
__decorate([
    (0, common_1.Put)('add-role/:userId/:roleName'),
    (0, swagger_1.ApiOperation)({ summary: 'Add Role to user' }),
    (0, swagger_response_helper_1.ApiPostResponse)('Role has been added to the user with permission'),
    (0, swagger_response_helper_1.ApiSecurityClearance)(ability_constant_1.SEC_LVL_5),
    (0, security_clearance_decorator_1.SecurityClearance)(ability_constant_1.SEC_LVL_5),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_CREATE, subject: ability_constant_1.ROLE_MANAGEMENT }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Param)('userId', new common_1.ParseUUIDPipe())),
    __param(2, (0, common_1.Param)('roleName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], RoleManagementControllerV2.prototype, "addUserRole", null);
__decorate([
    (0, common_1.Post)('role_permission'),
    (0, swagger_1.ApiOperation)({ summary: 'Add Role permissions to user' }),
    (0, swagger_response_helper_1.ApiPostResponse)('Role permission added to user successfully'),
    (0, swagger_response_helper_1.ApiSecurityClearance)(ability_constant_1.SEC_LVL_5),
    (0, security_clearance_decorator_1.SecurityClearance)(ability_constant_1.SEC_LVL_5),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_CREATE, subject: ability_constant_1.ROLE_MANAGEMENT }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_user_role_permissions_dto_1.AddUserRolePermissionsDto, Object]),
    __metadata("design:returntype", void 0)
], RoleManagementControllerV2.prototype, "addRolePermission", null);
exports.RoleManagementControllerV2 = RoleManagementControllerV2 = __decorate([
    (0, swagger_1.ApiTags)('Manager - Role Management'),
    (0, common_1.Controller)({ path: 'manager', version: '2' }),
    __metadata("design:paramtypes", [role_management_service_1.RoleManagementService])
], RoleManagementControllerV2);
//# sourceMappingURL=role-managementV2.controller.js.map