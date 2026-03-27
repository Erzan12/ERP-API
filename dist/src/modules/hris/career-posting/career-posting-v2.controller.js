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
exports.CareerPostingV2Controller = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const swagger_response_helper_1 = require("../../../utils/helpers/swagger-response.helper");
const ability_constant_1 = require("../../../utils/constants/ability.constant");
const recruitment_pagination_dto_1 = require("../../../utils/dtos/recruitment-pagination.dto");
const career_posting_dto_1 = require("./dto/career-posting.dto");
const can_decorator_1 = require("../../../utils/decorators/can.decorator");
const session_user_decorator_1 = require("../../../utils/decorators/session-user.decorator");
const career_posting_service_1 = require("./career-posting.service");
let CareerPostingV2Controller = class CareerPostingV2Controller {
    careerPostingService;
    constructor(careerPostingService) {
        this.careerPostingService = careerPostingService;
    }
    getCareerPostings(user, dto) {
        return this.careerPostingService.getCareerPostings(user, dto);
    }
    getStatusCountActive(user, dto) {
        return this.careerPostingService.statusCount(user, dto);
    }
    getCareerPosting(recruitmentId, user) {
        return this.careerPostingService.getCareerPosting(recruitmentId, user);
    }
    createCareerPosting(dto, user) {
        return this.careerPostingService.createCareerPosting(dto, user);
    }
    updateCareerPosting(recruitmentId, updateCareerPostingDto, user) {
        return this.careerPostingService.updateCareerPosting(recruitmentId, updateCareerPostingDto, user);
    }
};
exports.CareerPostingV2Controller = CareerPostingV2Controller;
__decorate([
    (0, common_1.Get)('recruitments'),
    (0, swagger_1.ApiOperation)({ summary: 'List of all job/career postings' }),
    (0, swagger_response_helper_1.ApiGetResponse)('List of job/career postings'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.EMPLOYEE_MASTERLIST }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, recruitment_pagination_dto_1.RecruitmentPaginationDto]),
    __metadata("design:returntype", void 0)
], CareerPostingV2Controller.prototype, "getCareerPostings", null);
__decorate([
    (0, common_1.Get)('recruitments/status-count'),
    (0, swagger_1.ApiOperation)({ summary: 'List of all job/career postings status' }),
    (0, swagger_response_helper_1.ApiGetResponse)('List of job/career postings status'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.EMPLOYEE_MASTERLIST }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, recruitment_pagination_dto_1.StatusCountDto]),
    __metadata("design:returntype", void 0)
], CareerPostingV2Controller.prototype, "getStatusCountActive", null);
__decorate([
    (0, common_1.Get)('recruitments/:recruitmentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a Job/Career posting' }),
    (0, swagger_response_helper_1.ApiGetResponse)('Get a job/career posting'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.EMPLOYEE_MASTERLIST }),
    __param(0, (0, common_1.Param)('recruitmentId', new common_1.ParseUUIDPipe())),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CareerPostingV2Controller.prototype, "getCareerPosting", null);
__decorate([
    (0, common_1.Post)('recruitments'),
    (0, swagger_1.ApiBody)({
        type: career_posting_dto_1.CreateCareerPostingDto,
        description: 'Payload to create a job/careeer posting',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Job/Career posting' }),
    (0, swagger_response_helper_1.ApiPostResponse)('Career posted successfully'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.EMPLOYEE_MASTERLIST }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [career_posting_dto_1.CreateCareerPostingDto, Object]),
    __metadata("design:returntype", void 0)
], CareerPostingV2Controller.prototype, "createCareerPosting", null);
__decorate([
    (0, common_1.Put)('recruitments/:recruitmentId'),
    (0, swagger_1.ApiBody)({
        type: career_posting_dto_1.UpdateCareerPostingDto,
        description: 'Payload to update career posting',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Update a current company information' }),
    (0, swagger_response_helper_1.ApiPatchResponse)('Career Posting updated successfully'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_UPDATE, subject: ability_constant_1.MASTERTABLES }),
    __param(0, (0, common_1.Param)('recruitmentId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, career_posting_dto_1.UpdateCareerPostingDto, Object]),
    __metadata("design:returntype", void 0)
], CareerPostingV2Controller.prototype, "updateCareerPosting", null);
exports.CareerPostingV2Controller = CareerPostingV2Controller = __decorate([
    (0, swagger_1.ApiTags)('Human Resources - Recruitment and Onboarding (Job/Career Posting)'),
    (0, common_1.Controller)({ path: 'hris', version: '2' }),
    __metadata("design:paramtypes", [career_posting_service_1.CareerPostingService])
], CareerPostingV2Controller);
//# sourceMappingURL=career-posting-v2.controller.js.map