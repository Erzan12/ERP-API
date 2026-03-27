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
exports.CompanyControllerV2 = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const swagger_response_helper_1 = require("../../../utils/helpers/swagger-response.helper");
const ability_constant_1 = require("../../../utils/constants/ability.constant");
const can_decorator_1 = require("../../../utils/decorators/can.decorator");
const session_user_decorator_1 = require("../../../utils/decorators/session-user.decorator");
const company_dto_1 = require("./dto/company.dto");
const pagination_dto_1 = require("../../../utils/dtos/pagination.dto");
const company_service_1 = require("./company.service");
let CompanyControllerV2 = class CompanyControllerV2 {
    companyService;
    constructor(companyService) {
        this.companyService = companyService;
    }
    getCompanies(user, dto) {
        return this.companyService.getCompanies(user, dto);
    }
    getCompany(companyId, user) {
        return this.companyService.getCompany(companyId, user);
    }
    createCompany(createCompanyDto, user) {
        return this.companyService.createCompany(createCompanyDto, user);
    }
    updateCompany(companyId, updateCompanyDto, user) {
        return this.companyService.updateCompany(companyId, updateCompanyDto, user);
    }
};
exports.CompanyControllerV2 = CompanyControllerV2;
__decorate([
    (0, common_1.Get)('companies'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all companies' }),
    (0, swagger_response_helper_1.ApiGetResponse)('List of companies retrieved'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.MASTERTABLES }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], CompanyControllerV2.prototype, "getCompanies", null);
__decorate([
    (0, common_1.Get)('companies/:companyId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a company' }),
    (0, swagger_response_helper_1.ApiGetResponse)('Here is the company'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.MASTERTABLES }),
    __param(0, (0, common_1.Param)('companyId', new common_1.ParseUUIDPipe())),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CompanyControllerV2.prototype, "getCompany", null);
__decorate([
    (0, common_1.Post)('companies'),
    (0, swagger_1.ApiBody)({ type: company_dto_1.CreateCompanyDto, description: 'Payload to create company' }),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new company' }),
    (0, swagger_response_helper_1.ApiPostResponse)('Company created successfully'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_CREATE, subject: ability_constant_1.MASTERTABLES }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [company_dto_1.CreateCompanyDto, Object]),
    __metadata("design:returntype", void 0)
], CompanyControllerV2.prototype, "createCompany", null);
__decorate([
    (0, common_1.Put)('companies/:companyId'),
    (0, swagger_1.ApiBody)({ type: company_dto_1.UpdateCompanyDto, description: 'Payload to update company' }),
    (0, swagger_1.ApiOperation)({ summary: 'Update a current company information' }),
    (0, swagger_response_helper_1.ApiPatchResponse)('Company updated successfully'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_UPDATE, subject: ability_constant_1.MASTERTABLES }),
    __param(0, (0, common_1.Param)('companyId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, company_dto_1.UpdateCompanyDto, Object]),
    __metadata("design:returntype", void 0)
], CompanyControllerV2.prototype, "updateCompany", null);
exports.CompanyControllerV2 = CompanyControllerV2 = __decorate([
    (0, swagger_1.ApiTags)('Mastertable - Company'),
    (0, common_1.Controller)({ path: 'mastertable', version: '2' }),
    __metadata("design:paramtypes", [company_service_1.CompanyService])
], CompanyControllerV2);
//# sourceMappingURL=companyV2.controller.js.map