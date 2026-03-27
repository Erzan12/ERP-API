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
exports.AssignInterviewerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const global_enums_decorator_1 = require("../../../../utils/decorators/global.enums.decorator");
class AssignInterviewerDto {
    employee_id;
    applicant_id;
    interview_stage;
    date_of_interview;
    remarks;
    total_points;
    recommendation;
}
exports.AssignInterviewerDto = AssignInterviewerDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AssignInterviewerDto.prototype, "employee_id", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AssignInterviewerDto.prototype, "applicant_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(global_enums_decorator_1.InterviewStage, {
        message: 'Interview stage must be Initial, Second, and Final',
    }),
    (0, class_transformer_1.Type)(() => String),
    (0, swagger_1.ApiProperty)({
        enum: global_enums_decorator_1.InterviewStage,
        example: global_enums_decorator_1.InterviewStage.INITIAL,
        description: 'The interview stage of the applicant',
    }),
    __metadata("design:type", String)
], AssignInterviewerDto.prototype, "interview_stage", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: '2026-03-21',
        description: 'The date of applicant interview',
    }),
    __metadata("design:type", String)
], AssignInterviewerDto.prototype, "date_of_interview", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AssignInterviewerDto.prototype, "remarks", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], AssignInterviewerDto.prototype, "total_points", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AssignInterviewerDto.prototype, "recommendation", void 0);
//# sourceMappingURL=assign-interviewer.dto.js.map