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
exports.ModuleControllerV2 = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const swagger_response_helper_1 = require("../../../utils/helpers/swagger-response.helper");
const ability_constant_1 = require("../../../utils/constants/ability.constant");
const can_decorator_1 = require("../../../utils/decorators/can.decorator");
const session_user_decorator_1 = require("../../../utils/decorators/session-user.decorator");
const module_dto_1 = require("./dto/module.dto");
const pagination_dto_1 = require("../../../utils/dtos/pagination.dto");
const module_service_1 = require("./module.service");
let ModuleControllerV2 = class ModuleControllerV2 {
    moduleService;
    constructor(moduleService) {
        this.moduleService = moduleService;
    }
    getModules(user, dto) {
        return this.moduleService.getModules(user, dto);
    }
    getModule(user, moduleId) {
        return this.moduleService.getModule(user, moduleId);
    }
    createModule(createModuleDto, user) {
        return this.moduleService.createModule(createModuleDto, user);
    }
    updateModule(updateModuleDto, user, id) {
        return this.moduleService.updateModude(updateModuleDto, user, id);
    }
};
exports.ModuleControllerV2 = ModuleControllerV2;
__decorate([
    (0, common_1.Get)('modules'),
    (0, swagger_1.ApiOperation)({ summary: 'Get modules' }),
    (0, swagger_response_helper_1.ApiGetResponse)('Here are all the Modules available'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.SYSTEM_MANAGEMENT }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], ModuleControllerV2.prototype, "getModules", null);
__decorate([
    (0, common_1.Get)('modules/:moduleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a module' }),
    (0, swagger_response_helper_1.ApiGetResponse)('Details of the module with submodules'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.SYSTEM_MANAGEMENT }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Param)('moduleId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ModuleControllerV2.prototype, "getModule", null);
__decorate([
    (0, common_1.Post)('modules'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new Module' }),
    (0, swagger_response_helper_1.ApiPostResponse)('Module created successfully'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_CREATE, subject: ability_constant_1.SYSTEM_MANAGEMENT }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [module_dto_1.CreateModuleDto, Object]),
    __metadata("design:returntype", void 0)
], ModuleControllerV2.prototype, "createModule", null);
__decorate([
    (0, common_1.Put)('modules/:id'),
    (0, swagger_1.ApiBody)({
        type: module_dto_1.UpdateModuleDto,
        description: 'Payload to update the module info',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Update current module' }),
    (0, swagger_response_helper_1.ApiPatchResponse)('Module updated successfully'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_UPDATE, subject: ability_constant_1.SYSTEM_MANAGEMENT }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __param(2, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [module_dto_1.UpdateModuleDto, Object, String]),
    __metadata("design:returntype", void 0)
], ModuleControllerV2.prototype, "updateModule", null);
exports.ModuleControllerV2 = ModuleControllerV2 = __decorate([
    (0, swagger_1.ApiTags)('Administrator - Module'),
    (0, common_1.Controller)({ path: 'administrator', version: '2' }),
    __metadata("design:paramtypes", [module_service_1.ModuleService])
], ModuleControllerV2);
//# sourceMappingURL=moduleV2.controller.js.map