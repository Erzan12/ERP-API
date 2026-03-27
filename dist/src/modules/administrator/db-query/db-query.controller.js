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
exports.DbQueryControllerV2 = void 0;
const common_1 = require("@nestjs/common");
const ability_constant_1 = require("../../../utils/constants/ability.constant");
const swagger_1 = require("@nestjs/swagger");
const db_query_service_1 = require("./db-query.service");
const can_decorator_1 = require("../../../utils/decorators/can.decorator");
const session_user_decorator_1 = require("../../../utils/decorators/session-user.decorator");
const execute_db_query_dto_1 = require("./dto/execute-db-query.dto");
const swagger_response_helper_1 = require("../../../utils/helpers/swagger-response.helper");
let DbQueryControllerV2 = class DbQueryControllerV2 {
    dbQueryService;
    constructor(dbQueryService) {
        this.dbQueryService = dbQueryService;
    }
    executeQuery(dto, user) {
        return this.dbQueryService.executeQuery(dto, user.id);
    }
    getLogs() {
        return this.dbQueryService.getLogs();
    }
    getLog(id) {
        return this.dbQueryService.getLogById(id);
    }
};
exports.DbQueryControllerV2 = DbQueryControllerV2;
__decorate([
    (0, common_1.Post)('execute'),
    (0, swagger_1.ApiBody)({
        type: execute_db_query_dto_1.ExecuteDbQueryDto,
        description: 'Payload for manual db query',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Execute manual SQL query (Super Admin Only)' }),
    (0, swagger_response_helper_1.ApiPostResponse)('Db manual query successful'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_CREATE, subject: ability_constant_1.SYSTEM_MANAGEMENT }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [execute_db_query_dto_1.ExecuteDbQueryDto, Object]),
    __metadata("design:returntype", void 0)
], DbQueryControllerV2.prototype, "executeQuery", null);
__decorate([
    (0, common_1.Get)('logs'),
    (0, swagger_1.ApiOperation)({ summary: 'Get latest executed manual queries' }),
    (0, swagger_response_helper_1.ApiGetResponse)('Logs for all manual db queries performed'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.SYSTEM_MANAGEMENT }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DbQueryControllerV2.prototype, "getLogs", null);
__decorate([
    (0, common_1.Get)('logs/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get specific manual query log' }),
    (0, swagger_response_helper_1.ApiGetResponse)('Get a specific manual db query log'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.SYSTEM_MANAGEMENT }),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DbQueryControllerV2.prototype, "getLog", null);
exports.DbQueryControllerV2 = DbQueryControllerV2 = __decorate([
    (0, swagger_1.ApiTags)('Administrator - Database Manuel Query'),
    (0, common_1.Controller)({ path: 'administrator/db-query', version: '2' }),
    __metadata("design:paramtypes", [db_query_service_1.DbQueryService])
], DbQueryControllerV2);
//# sourceMappingURL=db-query.controller.js.map