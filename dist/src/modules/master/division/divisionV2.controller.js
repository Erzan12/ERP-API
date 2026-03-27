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
exports.DivisionControllerV2 = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const swagger_response_helper_1 = require("../../../utils/helpers/swagger-response.helper");
const can_decorator_1 = require("../../../utils/decorators/can.decorator");
const ability_constant_1 = require("../../../utils/constants/ability.constant");
const division_service_1 = require("./division.service");
const session_user_decorator_1 = require("../../../utils/decorators/session-user.decorator");
const division_dto_1 = require("./dto/division.dto");
const pagination_dto_1 = require("../../../utils/dtos/pagination.dto");
let DivisionControllerV2 = class DivisionControllerV2 {
    divisionService;
    constructor(divisionService) {
        this.divisionService = divisionService;
    }
    getDivisions(user, dto) {
        return this.divisionService.getDivisions(user, dto);
    }
    getDivision(divisionId, user) {
        return this.divisionService.getDivision(divisionId, user);
    }
    createDivision(createDivisionDto, user) {
        console.log('createDivisionDto:', createDivisionDto);
        return this.divisionService.createDivision(createDivisionDto, user);
    }
    updateDivision(divisionId, updateDivisiionDto, user) {
        return this.divisionService.updateDivision(divisionId, updateDivisiionDto, user);
    }
};
exports.DivisionControllerV2 = DivisionControllerV2;
__decorate([
    (0, common_1.Get)('divisions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all divisions' }),
    (0, swagger_response_helper_1.ApiGetResponse)('List of divisions retrieved'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.MASTERTABLES }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], DivisionControllerV2.prototype, "getDivisions", null);
__decorate([
    (0, common_1.Get)('divisions/:divisionId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a division' }),
    (0, swagger_response_helper_1.ApiGetResponse)('Here is the division'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.MASTERTABLES }),
    __param(0, (0, common_1.Param)('divisionId', new common_1.ParseUUIDPipe())),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DivisionControllerV2.prototype, "getDivision", null);
__decorate([
    (0, common_1.Post)('divisions'),
    (0, swagger_1.ApiBody)({
        type: division_dto_1.CreateDivisionDto,
        description: 'Payload to create Division',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new division' }),
    (0, swagger_response_helper_1.ApiPostResponse)('Division created successfully'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_CREATE, subject: ability_constant_1.MASTERTABLES }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [division_dto_1.CreateDivisionDto, Object]),
    __metadata("design:returntype", void 0)
], DivisionControllerV2.prototype, "createDivision", null);
__decorate([
    (0, common_1.Put)('divisions/:divisionId'),
    (0, swagger_1.ApiBody)({
        type: division_dto_1.UpdateDivisionDto,
        description: 'Payload to update division',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Update a current division information' }),
    (0, swagger_response_helper_1.ApiPatchResponse)('Division updated successfully'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_UPDATE, subject: ability_constant_1.MASTERTABLES }),
    __param(0, (0, common_1.Param)('divisionId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, division_dto_1.UpdateDivisionDto, Object]),
    __metadata("design:returntype", void 0)
], DivisionControllerV2.prototype, "updateDivision", null);
exports.DivisionControllerV2 = DivisionControllerV2 = __decorate([
    (0, swagger_1.ApiTags)('Mastertable - Division'),
    (0, common_1.Controller)({ path: 'mastertable', version: '2' }),
    __metadata("design:paramtypes", [division_service_1.DivisionService])
], DivisionControllerV2);
//# sourceMappingURL=divisionV2.controller.js.map