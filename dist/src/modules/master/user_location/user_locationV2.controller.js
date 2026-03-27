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
exports.UserLocationControllerV2 = void 0;
const common_1 = require("@nestjs/common");
const user_location_service_1 = require("./user_location.service");
const swagger_1 = require("@nestjs/swagger");
const user_location_dto_1 = require("./dto/user-location.dto");
const session_user_decorator_1 = require("../../../utils/decorators/session-user.decorator");
const can_decorator_1 = require("../../../utils/decorators/can.decorator");
const ability_constant_1 = require("../../../utils/constants/ability.constant");
const swagger_response_helper_1 = require("../../../utils/helpers/swagger-response.helper");
const pagination_dto_1 = require("../../../utils/dtos/pagination.dto");
let UserLocationControllerV2 = class UserLocationControllerV2 {
    userLocationService;
    constructor(userLocationService) {
        this.userLocationService = userLocationService;
    }
    getUserLocations(user, dto) {
        return this.userLocationService.getUserLocations(user, dto);
    }
    getUserLocation(userLocationId, user) {
        return this.userLocationService.getUserLocation(userLocationId, user);
    }
    createUserLocation(createUserLocationDto, user) {
        return this.userLocationService.createUserLocation(createUserLocationDto, user);
    }
    updateUserLocation(userLocationId, updateUserLocationDto, user) {
        return this.userLocationService.updateUserLocation(userLocationId, updateUserLocationDto, user);
    }
};
exports.UserLocationControllerV2 = UserLocationControllerV2;
__decorate([
    (0, common_1.Get)('user-locations'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all user locations' }),
    (0, swagger_response_helper_1.ApiGetResponse)('List of user locations available'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.MASTERTABLES }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], UserLocationControllerV2.prototype, "getUserLocations", null);
__decorate([
    (0, common_1.Get)('user-locations/:userLocationId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a user locations' }),
    (0, swagger_response_helper_1.ApiGetResponse)('Here is the user location'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.MASTERTABLES }),
    __param(0, (0, common_1.Param)('userLocationId', new common_1.ParseUUIDPipe())),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UserLocationControllerV2.prototype, "getUserLocation", null);
__decorate([
    (0, common_1.Post)('user-locations'),
    (0, swagger_1.ApiBody)({
        type: user_location_dto_1.CreateUserLocationDto,
        description: 'Payload to create User Location',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Create a User Location' }),
    (0, swagger_response_helper_1.ApiPostResponse)('User Location has been created successfully'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_CREATE, subject: ability_constant_1.MASTERTABLES }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_location_dto_1.CreateUserLocationDto, Object]),
    __metadata("design:returntype", void 0)
], UserLocationControllerV2.prototype, "createUserLocation", null);
__decorate([
    (0, common_1.Put)('user-locations/:userLocationId'),
    (0, swagger_1.ApiBody)({
        type: user_location_dto_1.UpdateUserLocationDto,
        description: 'Payload to update User Location information',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Update a current User Location information' }),
    (0, swagger_response_helper_1.ApiPatchResponse)('User Location updated successfully'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_UPDATE, subject: ability_constant_1.MASTERTABLES }),
    __param(0, (0, common_1.Param)('userLocationId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_location_dto_1.UpdateUserLocationDto, Object]),
    __metadata("design:returntype", void 0)
], UserLocationControllerV2.prototype, "updateUserLocation", null);
exports.UserLocationControllerV2 = UserLocationControllerV2 = __decorate([
    (0, swagger_1.ApiTags)('Mastertable - User Location'),
    (0, common_1.Controller)({ path: 'mastertable', version: '2' }),
    __metadata("design:paramtypes", [user_location_service_1.UserLocationService])
], UserLocationControllerV2);
//# sourceMappingURL=user_locationV2.controller.js.map