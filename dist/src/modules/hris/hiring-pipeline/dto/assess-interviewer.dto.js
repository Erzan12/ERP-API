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
exports.AssessInterviewDto = exports.ExaminationRatingDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class ExaminationRatingDto {
    exam_name;
    result;
    remarks;
}
exports.ExaminationRatingDto = ExaminationRatingDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: 'Written Exam',
        description: 'The name of the exam',
    }),
    __metadata("design:type", String)
], ExaminationRatingDto.prototype, "exam_name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: '',
        description: 'The result of the exam',
    }),
    __metadata("design:type", String)
], ExaminationRatingDto.prototype, "result", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: '',
        description: 'The remarks of the interviewer to the applicant',
    }),
    __metadata("design:type", String)
], ExaminationRatingDto.prototype, "remarks", void 0);
class AssessInterviewDto {
    interviewer_id;
    remarks;
    stage;
    total_points;
    recommendations;
    ratings;
}
exports.AssessInterviewDto = AssessInterviewDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: '',
        description: 'The interviewers uuid',
    }),
    __metadata("design:type", String)
], AssessInterviewDto.prototype, "interviewer_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: 'Interviewer remarks',
        description: 'The remark of the interviewer',
    }),
    __metadata("design:type", String)
], AssessInterviewDto.prototype, "remarks", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.InterviewStage, {
        message: 'Interview stage initial, second and final',
    }),
    (0, class_transformer_1.Type)(() => String),
    (0, swagger_1.ApiProperty)({
        enum: client_1.InterviewStage,
        example: client_1.InterviewStage.initial,
        description: 'The interview stage for the interviewer',
    }),
    __metadata("design:type", String)
], AssessInterviewDto.prototype, "stage", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: 'Points',
        description: 'total points of the applicant',
    }),
    __metadata("design:type", Number)
], AssessInterviewDto.prototype, "total_points", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: 'Recommendations',
        description: 'What are the recommendations from interviewer',
    }),
    __metadata("design:type", String)
], AssessInterviewDto.prototype, "recommendations", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ExaminationRatingDto),
    (0, swagger_1.ApiProperty)({ type: [ExaminationRatingDto] }),
    __metadata("design:type", Array)
], AssessInterviewDto.prototype, "ratings", void 0);
//# sourceMappingURL=assess-interviewer.dto.js.map