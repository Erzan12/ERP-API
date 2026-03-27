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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateApplicantDto = exports.CreateApplicantDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const global_enums_decorator_1 = require("../../../../utils/decorators/global.enums.decorator");
const applicant_document_dto_1 = require("./applicant-document.dto");
class CreateApplicantDto {
    career_id;
    first_name;
    middle_name;
    last_name;
    email;
    mobile_number;
    application_source;
    application_status;
    date_applied;
    documents;
}
exports.CreateApplicantDto = CreateApplicantDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: 'Job/Career posting PK UUID',
        description: 'UUID of career posting',
    }),
    __metadata("design:type", String)
], CreateApplicantDto.prototype, "career_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: 'Juan',
        description: 'First name of applicant',
    }),
    __metadata("design:type", String)
], CreateApplicantDto.prototype, "first_name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: 'Doe',
        description: 'Middlename can be optional',
    }),
    __metadata("design:type", String)
], CreateApplicantDto.prototype, "middle_name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: 'Dee',
        description: 'Last name of the applicant',
    }),
    __metadata("design:type", String)
], CreateApplicantDto.prototype, "last_name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: 'juandoe@gmail.com',
        description: 'Email of the applicant',
    }),
    __metadata("design:type", String)
], CreateApplicantDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: '09633416290',
        description: 'Mobile no. of the applicant',
    }),
    __metadata("design:type", String)
], CreateApplicantDto.prototype, "mobile_number", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(global_enums_decorator_1.ApplicationSource, {
        message: 'Application Source must be company_website, walk_in, referral, linkedIn, jobstreet',
    }),
    (0, class_transformer_1.Type)(() => String),
    (0, swagger_1.ApiProperty)({
        enum: global_enums_decorator_1.ApplicationSource,
        example: global_enums_decorator_1.ApplicationSource.COMPANY_WEBSITE,
        description: 'The application source of the applicant',
    }),
    __metadata("design:type", String)
], CreateApplicantDto.prototype, "application_source", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(global_enums_decorator_1.ApplicationStatus, {
        message: 'Application Status must be applied, screening, for_interview, accepted, rejected, onboarding',
    }),
    (0, class_transformer_1.Type)(() => String),
    (0, swagger_1.ApiProperty)({
        enum: global_enums_decorator_1.ApplicationStatus,
        example: global_enums_decorator_1.ApplicationStatus.FOR_INTERVIEW,
        description: 'The status of application of the applicant',
    }),
    __metadata("design:type", String)
], CreateApplicantDto.prototype, "application_status", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: '2026-03-05',
        description: 'The date of application of the applicant',
    }),
    __metadata("design:type", String)
], CreateApplicantDto.prototype, "date_applied", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => applicant_document_dto_1.ApplicantDocumentDto),
    (0, swagger_1.ApiProperty)({
        type: [applicant_document_dto_1.ApplicantDocumentDto],
        description: 'List of applicant documents',
    }),
    __metadata("design:type", Array)
], CreateApplicantDto.prototype, "documents", void 0);
class UpdateApplicantDto {
    career_id;
    first_name;
    middle_name;
    last_name;
    email;
    mobile_number;
    application_source;
    application_status;
    date_applied;
    isActive;
}
exports.UpdateApplicantDto = UpdateApplicantDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: 'Job/Career posting PK UUID',
        description: 'UUID of career posting',
    }),
    __metadata("design:type", String)
], UpdateApplicantDto.prototype, "career_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: 'Juan',
        description: 'First name of applicant',
    }),
    __metadata("design:type", String)
], UpdateApplicantDto.prototype, "first_name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: 'Doe',
        description: 'Middlename can be optional',
    }),
    __metadata("design:type", String)
], UpdateApplicantDto.prototype, "middle_name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: 'Dee',
        description: 'Last name of the applicant',
    }),
    __metadata("design:type", String)
], UpdateApplicantDto.prototype, "last_name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: 'juandoe@gmail.com',
        description: 'Email of the applicant',
    }),
    __metadata("design:type", String)
], UpdateApplicantDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: '09633416290',
        description: 'Mobile no. of the applicant',
    }),
    __metadata("design:type", String)
], UpdateApplicantDto.prototype, "mobile_number", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(global_enums_decorator_1.ApplicationSource, {
        message: 'Application Source must be company_website, walk_in, referral, linkedIn, jobstreet',
    }),
    (0, class_transformer_1.Type)(() => String),
    (0, swagger_1.ApiProperty)({
        enum: global_enums_decorator_1.ApplicationSource,
        example: global_enums_decorator_1.ApplicationSource.COMPANY_WEBSITE,
        description: 'The application source of the applicant',
    }),
    __metadata("design:type", String)
], UpdateApplicantDto.prototype, "application_source", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(global_enums_decorator_1.ApplicationStatus, {
        message: 'Application Status must be applied, screening, for_interview, accepted, rejected, onboarding',
    }),
    (0, class_transformer_1.Type)(() => String),
    (0, swagger_1.ApiProperty)({
        enum: global_enums_decorator_1.ApplicationStatus,
        example: global_enums_decorator_1.ApplicationStatus.FOR_INTERVIEW,
        description: 'The status of application of the applicant',
    }),
    __metadata("design:type", String)
], UpdateApplicantDto.prototype, "application_status", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: '2026-03-05',
        description: 'The date of application of the applicant',
    }),
    __metadata("design:type", String)
], UpdateApplicantDto.prototype, "date_applied", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: 'true or false',
        description: 'If this application is active',
    }),
    __metadata("design:type", Boolean)
], UpdateApplicantDto.prototype, "isActive", void 0);
//# sourceMappingURL=applicant.dto.js.map