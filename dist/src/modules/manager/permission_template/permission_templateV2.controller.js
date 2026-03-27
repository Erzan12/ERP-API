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
exports.PermissionTemplateControllerV2 = void 0;
const common_1 = require("@nestjs/common");
const permission_template_service_1 = require("./permission_template.service");
const can_decorator_1 = require("../../../utils/decorators/can.decorator");
const session_user_decorator_1 = require("../../../utils/decorators/session-user.decorator");
const create_permission_template_dto_1 = require("./dto/create-permission-template.dto");
const swagger_1 = require("@nestjs/swagger");
const swagger_response_helper_1 = require("../../../utils/helpers/swagger-response.helper");
const ability_constant_1 = require("../../../utils/constants/ability.constant");
const assign_template_dto_1 = require("./dto/assign-template.dto");
const update_permission_template_dto_1 = require("./dto/update-permission-template.dto");
let PermissionTemplateControllerV2 = class PermissionTemplateControllerV2 {
    permissionTemplateService;
    constructor(permissionTemplateService) {
        this.permissionTemplateService = permissionTemplateService;
    }
    getPermissionTemplates(user) {
        return this.permissionTemplateService.getPermissionTemplates(user);
    }
    getPermissionTemplate(id, user) {
        return this.permissionTemplateService.getPermissionTemplate(id, user);
    }
    getUserPermissionTemplate(userPermissionTemplateId, user) {
        return this.permissionTemplateService.getUserPermissionTemplate(userPermissionTemplateId, user);
    }
    createPermissionTemplate(dto, user) {
        return this.permissionTemplateService.createPermissionTemplate(dto, user);
    }
    assignPermTemplate(dto, user) {
        return this.permissionTemplateService.assignTemplateToUser(dto, user);
    }
    updatePermissionTemplate(dto, id, user) {
        return this.permissionTemplateService.updatePermissionTemplate(id, dto, user);
    }
};
exports.PermissionTemplateControllerV2 = PermissionTemplateControllerV2;
__decorate([
    (0, common_1.Get)('permission-template'),
    (0, swagger_1.ApiOperation)({ summary: 'Get permission templates' }),
    (0, swagger_response_helper_1.ApiGetResponse)('Here are all the permission templates available'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.PERMISSION_TEMPLATE }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PermissionTemplateControllerV2.prototype, "getPermissionTemplates", null);
__decorate([
    (0, common_1.Get)('permission-template/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a permission template' }),
    (0, swagger_response_helper_1.ApiGetResponse)('Here is the permission template'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.PERMISSION_TEMPLATE }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PermissionTemplateControllerV2.prototype, "getPermissionTemplate", null);
__decorate([
    (0, common_1.Get)('permission-template/user/:userPermissionTemplateId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available permission templates to user' }),
    (0, swagger_response_helper_1.ApiGetResponse)('Here are the list of permission templates available'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.PERMISSION_TEMPLATE }),
    __param(0, (0, common_1.Param)('userPermissionTemplateId', new common_1.ParseUUIDPipe())),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PermissionTemplateControllerV2.prototype, "getUserPermissionTemplate", null);
__decorate([
    (0, common_1.Post)('permission-template'),
    (0, swagger_1.ApiBody)({
        type: create_permission_template_dto_1.CreatePermissionTemplateDto,
        description: 'Payload to create Permission Template',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Create new permission template' }),
    (0, swagger_response_helper_1.ApiPostResponse)('Permission template created successfully'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_CREATE, subject: ability_constant_1.PERMISSION_TEMPLATE }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_permission_template_dto_1.CreatePermissionTemplateDto, Object]),
    __metadata("design:returntype", void 0)
], PermissionTemplateControllerV2.prototype, "createPermissionTemplate", null);
__decorate([
    (0, common_1.Post)('permission-template/user/:id'),
    (0, swagger_1.ApiBody)({
        type: assign_template_dto_1.AssignTemplateDto,
        description: 'Payload to assign permission template to user',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Assign Permission template to user' }),
    (0, swagger_response_helper_1.ApiPostResponse)('Permission Template assigned to user successfully'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_CREATE, subject: ability_constant_1.PERMISSION_TEMPLATE }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assign_template_dto_1.AssignTemplateDto, Object]),
    __metadata("design:returntype", void 0)
], PermissionTemplateControllerV2.prototype, "assignPermTemplate", null);
__decorate([
    (0, common_1.Put)('permission-template/:id'),
    (0, swagger_1.ApiBody)({
        type: update_permission_template_dto_1.UpdatePermissionTemplateDto,
        description: 'Payload to update Permission Template',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Get available permissin templates to user' }),
    (0, swagger_response_helper_1.ApiPatchResponse)('Permissin Template has been updated.'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_UPDATE, subject: ability_constant_1.PERMISSION_TEMPLATE }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(2, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_permission_template_dto_1.UpdatePermissionTemplateDto, String, Object]),
    __metadata("design:returntype", void 0)
], PermissionTemplateControllerV2.prototype, "updatePermissionTemplate", null);
exports.PermissionTemplateControllerV2 = PermissionTemplateControllerV2 = __decorate([
    (0, swagger_1.ApiTags)('Manager - Permission Template'),
    (0, common_1.Controller)({ path: 'manager', version: '2' }),
    __metadata("design:paramtypes", [permission_template_service_1.PermissionTemplateService])
], PermissionTemplateControllerV2);
//# sourceMappingURL=permission_templateV2.controller.js.map