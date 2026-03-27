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
exports.InterviewApplicantController = exports.ApplicantsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const hiring_pipeline_service_1 = require("./hiring-pipeline.service");
const applicant_dto_1 = require("./dto/applicant.dto");
const swagger_response_helper_1 = require("../../../utils/helpers/swagger-response.helper");
const ability_constant_1 = require("../../../utils/constants/ability.constant");
const session_user_decorator_1 = require("../../../utils/decorators/session-user.decorator");
const can_decorator_1 = require("../../../utils/decorators/can.decorator");
const recruitment_pagination_dto_1 = require("../../../utils/dtos/recruitment-pagination.dto");
const bulk_assign_interviewer_dto_1 = require("./dto/bulk-assign-interviewer.dto");
const assess_interviewer_dto_1 = require("./dto/assess-interviewer.dto");
let ApplicantsController = class ApplicantsController {
    hiringPipelineService;
    interviewApplicantService;
    constructor(hiringPipelineService, interviewApplicantService) {
        this.hiringPipelineService = hiringPipelineService;
        this.interviewApplicantService = interviewApplicantService;
    }
    getCareerPostings(user, dto) {
        return this.hiringPipelineService.getApplicants(user, dto);
    }
    getStatusCountActive(user, dto) {
        return this.hiringPipelineService.statusCount(user, dto);
    }
    getCareerPosting(applicantId, user) {
        return this.hiringPipelineService.getApplicant(applicantId, user);
    }
    createApplicant(dto, user) {
        return this.hiringPipelineService.createApplicant(dto, user);
    }
    updateCareerPosting(applicationId, updateApplicantDto, user) {
        return this.hiringPipelineService.updateApplicant(applicationId, updateApplicantDto, user);
    }
};
exports.ApplicantsController = ApplicantsController;
__decorate([
    (0, common_1.Get)('applicants'),
    (0, swagger_1.ApiOperation)({ summary: 'List of all applicant posted' }),
    (0, swagger_response_helper_1.ApiGetResponse)('List of employees'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.EMPLOYEE_MASTERLIST }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, recruitment_pagination_dto_1.RecruitmentPaginationDto]),
    __metadata("design:returntype", void 0)
], ApplicantsController.prototype, "getCareerPostings", null);
__decorate([
    (0, common_1.Get)('applicants/status-count'),
    (0, swagger_1.ApiOperation)({ summary: 'List of all Applicants status' }),
    (0, swagger_response_helper_1.ApiGetResponse)('List of all Applicants status'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.EMPLOYEE_MASTERLIST }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, recruitment_pagination_dto_1.StatusCountDto]),
    __metadata("design:returntype", void 0)
], ApplicantsController.prototype, "getStatusCountActive", null);
__decorate([
    (0, common_1.Get)('applicants/:applicantId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a Applicant' }),
    (0, swagger_response_helper_1.ApiGetResponse)('Get a Applicant'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_READ, subject: ability_constant_1.EMPLOYEE_MASTERLIST }),
    __param(0, (0, common_1.Param)('applicantId', new common_1.ParseUUIDPipe())),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ApplicantsController.prototype, "getCareerPosting", null);
__decorate([
    (0, common_1.Post)('applicants'),
    (0, swagger_1.ApiBody)({
        type: applicant_dto_1.CreateApplicantDto,
        description: 'Payload to create Applicant',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Applicant posting' }),
    (0, swagger_response_helper_1.ApiPostResponse)('Applicant posted successfully'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_CREATE, subject: ability_constant_1.EMPLOYEE_MASTERLIST }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [applicant_dto_1.CreateApplicantDto, Object]),
    __metadata("design:returntype", void 0)
], ApplicantsController.prototype, "createApplicant", null);
__decorate([
    (0, common_1.Put)('applicants/:applicationId'),
    (0, swagger_1.ApiBody)({
        type: applicant_dto_1.UpdateApplicantDto,
        description: 'Payload to update career posting',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Update a current company information' }),
    (0, swagger_response_helper_1.ApiPatchResponse)('Career Posting updated successfully'),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_UPDATE, subject: ability_constant_1.EMPLOYEE_MASTERLIST }),
    __param(0, (0, common_1.Param)('applicationId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, applicant_dto_1.UpdateApplicantDto, Object]),
    __metadata("design:returntype", void 0)
], ApplicantsController.prototype, "updateCareerPosting", null);
exports.ApplicantsController = ApplicantsController = __decorate([
    (0, swagger_1.ApiTags)('Human Resources - Recruitment and Onboarding (Applicants)'),
    (0, common_1.Controller)({ path: 'hris', version: '2' }),
    __metadata("design:paramtypes", [hiring_pipeline_service_1.HiringPipelineService, hiring_pipeline_service_1.InterviewApplicantService])
], ApplicantsController);
let InterviewApplicantController = class InterviewApplicantController {
    interviewApplicantService;
    constructor(interviewApplicantService) {
        this.interviewApplicantService = interviewApplicantService;
    }
    assignInterviewer(dto, user) {
        return this.interviewApplicantService.assignInterviewPanel(user, dto);
    }
    async assessInterview(interviewerId, dto, user) {
        return this.interviewApplicantService.assessInterviewPanel(user, {
            ...dto,
            interviewer_id: interviewerId,
        });
    }
};
exports.InterviewApplicantController = InterviewApplicantController;
__decorate([
    (0, common_1.Post)('applicants/interview/assign-interview-panel'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign the full interview panel to an applicant' }),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_UPDATE, subject: ability_constant_1.EMPLOYEE_MASTERLIST }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_assign_interviewer_dto_1.BulkAssignInterviewDto, Object]),
    __metadata("design:returntype", void 0)
], InterviewApplicantController.prototype, "assignInterviewer", null);
__decorate([
    (0, common_1.Patch)('applicants/interview/assess-interview/:interviewerId'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit assessment for a specific interview stage' }),
    (0, can_decorator_1.Can)({ action: ability_constant_1.ACTION_UPDATE, subject: ability_constant_1.EMPLOYEE_MASTERLIST }),
    __param(0, (0, common_1.Param)('interviewerId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assess_interviewer_dto_1.AssessInterviewDto, Object]),
    __metadata("design:returntype", Promise)
], InterviewApplicantController.prototype, "assessInterview", null);
exports.InterviewApplicantController = InterviewApplicantController = __decorate([
    (0, swagger_1.ApiTags)('Human Resources - Recruitment and Onboarding (Interview Applicant)'),
    (0, common_1.Controller)({ path: 'hris', version: '2' }),
    __metadata("design:paramtypes", [hiring_pipeline_service_1.InterviewApplicantService])
], InterviewApplicantController);
//# sourceMappingURL=hiring-pipelineV2.controller.js.map