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
exports.BulkAssignInterviewDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class BulkAssignInterviewDto {
    applicant_id;
    interviewer_ids;
    date_of_interview;
    remarks = '';
}
exports.BulkAssignInterviewDto = BulkAssignInterviewDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: 'Applicant uuid',
        description: 'The uuid of the applicant',
    }),
    __metadata("design:type", String)
], BulkAssignInterviewDto.prototype, "applicant_id", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    (0, class_validator_1.ArrayMinSize)(3),
    (0, class_validator_1.ArrayMaxSize)(3),
    (0, swagger_1.ApiProperty)({ example: ['uuid-1', 'uuid-2', 'uuid-3'] }),
    __metadata("design:type", Array)
], BulkAssignInterviewDto.prototype, "interviewer_ids", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: '',
        description: 'The date of interview of the applicant',
    }),
    __metadata("design:type", String)
], BulkAssignInterviewDto.prototype, "date_of_interview", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({ example: '', description: 'The interviewees personal remark' }),
    __metadata("design:type", String)
], BulkAssignInterviewDto.prototype, "remarks", void 0);
//# sourceMappingURL=bulk-assign-interviewer.dto.js.map