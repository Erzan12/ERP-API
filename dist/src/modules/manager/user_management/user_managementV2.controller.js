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
exports.UserManagementControllerV2 = void 0;
const common_1 = require("@nestjs/common");
const user_management_service_1 = require("./user_management.service");
const swagger_1 = require("@nestjs/swagger");
const swagger_response_helper_1 = require("../../../utils/helpers/swagger-response.helper");
const user_account_status_dto_1 = require("./dto/user-account-status.dto");
const create_user_with_role_permission_dto_1 = require("./dto/create-user-with-role-permission.dto");
const user_email_reset_token_dto_1 = require("./dto/user-email.reset-token.dto");
const ability_constant_1 = require("../../../utils/constants/ability.constant");
const security_clearance_decorator_1 = require("../../../middleware/security_clearance/security-clearance.decorator");
const can_decorator_1 = require("../../../utils/decorators/can.decorator");
const session_user_decorator_1 = require("../../../utils/decorators/session-user.decorator");
let UserManagementControllerV2 = class UserManagementControllerV2 {
    userManagementService;
    constructor(userManagementService) {
        this.userManagementService = userManagementService;
    }
    viewUsers(user) {
        return this.userManagementService.viewUserAccount(user);
    }
    createUser(createUserWithRoleDto, user, req, userId) {
        return this.userManagementService.createUserAccount(createUserWithRoleDto, user, req, userId);
    }
    newResetToken(dto, user) {
        return this.userManagementService.resendInvitation(dto, user);
    }
    deactivateUser(deactivateUserAccountDto, user) {
        return this.userManagementService.deactivateUserAccount(deactivateUserAccountDto, user);
    }
    reactivateUser(reactivateUserAccountDto, user) {
        return this.userManagementService.reactivateUserAccount(reactivateUserAccountDto, user);
    }
    viewNewEmployees(user) {
        return this.userManagementService.viewNewEmployeeWithoutUserAccount(user);
    }
};
exports.UserManagementControllerV2 = UserManagementControllerV2;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get User Accounts' }),
    (0, swagger_response_helper_1.ApiGetResponse)('Here are all the User Accounts available'),
    (0, swagger_response_helper_1.ApiSecurityClearance)(ability_constant_1.SEC_LVL_5),
    (0, security_clearance_decorator_1.SecurityClearance)(ability_constant_1.SEC_LVL_5),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.USER_ACCOUNT }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserManagementControllerV2.prototype, "viewUsers", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBody)({
        type: create_user_with_role_permission_dto_1.CreateUserWithRoleDto,
        description: 'Payload to create User Account',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new user account' }),
    (0, swagger_response_helper_1.ApiPostResponse)('User Account created successfully'),
    (0, swagger_response_helper_1.ApiSecurityClearance)(ability_constant_1.SEC_LVL_5),
    (0, security_clearance_decorator_1.SecurityClearance)(ability_constant_1.SEC_LVL_5),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_CREATE, subject: ability_constant_1.USER_ACCOUNT }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Param)('userId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_with_role_permission_dto_1.CreateUserWithRoleDto, Object, Object, String]),
    __metadata("design:returntype", void 0)
], UserManagementControllerV2.prototype, "createUser", null);
__decorate([
    (0, common_1.Post)('resend-invitation'),
    (0, swagger_1.ApiBody)({
        type: user_email_reset_token_dto_1.UserEmailResetTokenDto,
        description: 'Payload for new user reset token',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Reset token for first time log in' }),
    (0, swagger_response_helper_1.ApiPostResponse)('Password reset done! you can now log in!'),
    (0, swagger_response_helper_1.ApiSecurityClearance)(ability_constant_1.SEC_LVL_5),
    (0, security_clearance_decorator_1.SecurityClearance)(ability_constant_1.SEC_LVL_5),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_CREATE, subject: ability_constant_1.USER_TOKEN_KEY }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_email_reset_token_dto_1.UserEmailResetTokenDto, Object]),
    __metadata("design:returntype", void 0)
], UserManagementControllerV2.prototype, "newResetToken", null);
__decorate([
    (0, common_1.Put)('deactivate'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate the user account' }),
    (0, swagger_response_helper_1.ApiDeactivateResponse)('User account deactivated successfully'),
    (0, swagger_response_helper_1.ApiSecurityClearance)(ability_constant_1.SEC_LVL_5),
    (0, security_clearance_decorator_1.SecurityClearance)(ability_constant_1.SEC_LVL_5),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_account_status_dto_1.DeactivateUserAccountDto, Object]),
    __metadata("design:returntype", void 0)
], UserManagementControllerV2.prototype, "deactivateUser", null);
__decorate([
    (0, common_1.Put)('reactivate'),
    (0, swagger_1.ApiOperation)({ summary: 'Reactivate the user account' }),
    (0, swagger_response_helper_1.ApiActivateResponse)('User account reactivated successfully'),
    (0, swagger_response_helper_1.ApiSecurityClearance)(ability_constant_1.SEC_LVL_5),
    (0, security_clearance_decorator_1.SecurityClearance)(ability_constant_1.SEC_LVL_5),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_account_status_dto_1.ReactivateUserAccountDto, Object]),
    __metadata("design:returntype", void 0)
], UserManagementControllerV2.prototype, "reactivateUser", null);
__decorate([
    (0, common_1.Get)('new_employees'),
    (0, swagger_1.ApiOperation)({ summary: 'Get the new employees without user accounts' }),
    (0, swagger_response_helper_1.ApiGetResponse)('Here are the list of new employees without user accounts'),
    (0, swagger_response_helper_1.ApiSecurityClearance)(ability_constant_1.SEC_LVL_5),
    (0, security_clearance_decorator_1.SecurityClearance)(ability_constant_1.SEC_LVL_5),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserManagementControllerV2.prototype, "viewNewEmployees", null);
exports.UserManagementControllerV2 = UserManagementControllerV2 = __decorate([
    (0, swagger_1.ApiTags)('User Management'),
    (0, common_1.Controller)({ path: 'users', version: '2' }),
    __metadata("design:paramtypes", [user_management_service_1.UserManagementService])
], UserManagementControllerV2);
//# sourceMappingURL=user_managementV2.controller.js.map