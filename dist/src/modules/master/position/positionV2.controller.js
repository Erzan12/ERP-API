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
exports.PositionControllerV2 = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const swagger_response_helper_1 = require("../../../utils/helpers/swagger-response.helper");
const can_decorator_1 = require("../../../utils/decorators/can.decorator");
const ability_constant_1 = require("../../../utils/constants/ability.constant");
const session_user_decorator_1 = require("../../../utils/decorators/session-user.decorator");
const position_dto_1 = require("./dto/position.dto");
const pagination_dto_1 = require("../../../utils/dtos/pagination.dto");
const position_service_1 = require("./position.service");
let PositionControllerV2 = class PositionControllerV2 {
    positionService;
    constructor(positionService) {
        this.positionService = positionService;
    }
    getPositions(user, dto) {
        return this.positionService.getPositions(user, dto);
    }
    getPosition(positionId, user) {
        return this.positionService.getPosition(positionId, user);
    }
    createPosition(createPositionDto, user) {
        return this.positionService.createPosition(createPositionDto, user);
    }
    updatePosition(positionId, updatePositionDto, user) {
        return this.positionService.updatePosition(positionId, updatePositionDto, user);
    }
};
exports.PositionControllerV2 = PositionControllerV2;
__decorate([
    (0, common_1.Get)('positions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all positions' }),
    (0, swagger_response_helper_1.ApiGetResponse)('List of positions retrieve'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.MASTERTABLES }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], PositionControllerV2.prototype, "getPositions", null);
__decorate([
    (0, common_1.Get)('positions/:positionId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a position.' }),
    (0, swagger_response_helper_1.ApiGetResponse)('Here is the position.'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.MASTERTABLES }),
    __param(0, (0, common_1.Param)('positionId', new common_1.ParseUUIDPipe())),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PositionControllerV2.prototype, "getPosition", null);
__decorate([
    (0, common_1.Post)('positions'),
    (0, swagger_1.ApiBody)({
        type: position_dto_1.CreatePositionDto,
        description: 'Payload to create Position',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new position' }),
    (0, swagger_response_helper_1.ApiPostResponse)('Position created successfully'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_CREATE, subject: ability_constant_1.MASTERTABLES }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [position_dto_1.CreatePositionDto, Object]),
    __metadata("design:returntype", void 0)
], PositionControllerV2.prototype, "createPosition", null);
__decorate([
    (0, common_1.Put)('positions/:positionId'),
    (0, swagger_1.ApiBody)({
        type: position_dto_1.UpdatePositionDto,
        description: 'Payload to update Position information',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Update a current position information' }),
    (0, swagger_response_helper_1.ApiPatchResponse)('Position updated successfully'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_UPDATE, subject: ability_constant_1.MASTERTABLES }),
    __param(0, (0, common_1.Param)('positionId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, position_dto_1.UpdatePositionDto, Object]),
    __metadata("design:returntype", void 0)
], PositionControllerV2.prototype, "updatePosition", null);
exports.PositionControllerV2 = PositionControllerV2 = __decorate([
    (0, swagger_1.ApiTags)('Mastertable - Position'),
    (0, common_1.Controller)({ path: 'mastertable', version: '2' }),
    __metadata("design:paramtypes", [position_service_1.PositionService])
], PositionControllerV2);
//# sourceMappingURL=positionV2.controller.js.map