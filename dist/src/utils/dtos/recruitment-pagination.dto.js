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
exports.StatusCountDto = exports.RecruitmentPaginationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class RecruitmentPaginationDto {
    search;
    status;
    is_active;
    sortBy = 'id';
    order = 'asc';
    page = 1;
    perPage = 10;
}
exports.RecruitmentPaginationDto = RecruitmentPaginationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiPropertyOptional)({ default: '' }),
    __metadata("design:type", String)
], RecruitmentPaginationDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiPropertyOptional)({ default: '' }),
    __metadata("design:type", String)
], RecruitmentPaginationDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true'),
    (0, swagger_1.ApiPropertyOptional)({ default: '' }),
    __metadata("design:type", Boolean)
], RecruitmentPaginationDto.prototype, "is_active", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiPropertyOptional)({ example: 'id', default: 'id' }),
    __metadata("design:type", String)
], RecruitmentPaginationDto.prototype, "sortBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiPropertyOptional)({ example: 'desc', default: 'desc' }),
    __metadata("design:type", String)
], RecruitmentPaginationDto.prototype, "order", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, swagger_1.ApiPropertyOptional)({ example: 1, default: 1 }),
    __metadata("design:type", Number)
], RecruitmentPaginationDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, swagger_1.ApiPropertyOptional)({ example: 10, default: 10 }),
    __metadata("design:type", Number)
], RecruitmentPaginationDto.prototype, "perPage", void 0);
class StatusCountDto {
    is_active;
}
exports.StatusCountDto = StatusCountDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true'),
    (0, swagger_1.ApiPropertyOptional)({ default: '' }),
    __metadata("design:type", Boolean)
], StatusCountDto.prototype, "is_active", void 0);
//# sourceMappingURL=recruitment-pagination.dto.js.map