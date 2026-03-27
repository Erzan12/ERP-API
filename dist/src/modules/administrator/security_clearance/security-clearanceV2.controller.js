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
exports.SecurityClearanceControllerV2 = void 0;
const common_1 = require("@nestjs/common");
const update_security_clearance_dto_1 = require("./dto/update-security-clearance.dto");
const can_decorator_1 = require("../../../utils/decorators/can.decorator");
const security_clearance_service_1 = require("./security-clearance.service");
const session_user_decorator_1 = require("../../../utils/decorators/session-user.decorator");
const ability_constant_1 = require("../../../utils/constants/ability.constant");
const security_clearance_decorator_1 = require("../../../middleware/security_clearance/security-clearance.decorator");
const swagger_response_helper_1 = require("../../../utils/helpers/swagger-response.helper");
const swagger_1 = require("@nestjs/swagger");
let SecurityClearanceControllerV2 = class SecurityClearanceControllerV2 {
    clearanceService;
    constructor(clearanceService) {
        this.clearanceService = clearanceService;
    }
    updateClearance(targetId, dto, admin) {
        return this.clearanceService.updateUserClearance(admin.id, String(targetId), dto.new_level, admin.security_clearance_level);
    }
};
exports.SecurityClearanceControllerV2 = SecurityClearanceControllerV2;
__decorate([
    (0, common_1.Put)('/security_clearance/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign the security clearance level for user' }),
    (0, swagger_response_helper_1.ApiSecurityClearance)(ability_constant_1.SEC_LVL_9),
    (0, security_clearance_decorator_1.SecurityClearance)(ability_constant_1.SEC_LVL_9),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_UPDATE, subject: ability_constant_1.USER_ACCOUNT }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_security_clearance_dto_1.UpdateSecurityClearanceDto, Object]),
    __metadata("design:returntype", void 0)
], SecurityClearanceControllerV2.prototype, "updateClearance", null);
exports.SecurityClearanceControllerV2 = SecurityClearanceControllerV2 = __decorate([
    (0, swagger_1.ApiTags)('Administrator - Security Clearance'),
    (0, common_1.Controller)({ path: 'administrator', version: '2' }),
    __metadata("design:paramtypes", [security_clearance_service_1.SecurityClearanceService])
], SecurityClearanceControllerV2);
//# sourceMappingURL=security-clearanceV2.controller.js.map