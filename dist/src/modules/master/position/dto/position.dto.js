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
exports.UpdatePositionDto = exports.CreatePositionDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreatePositionDto {
    name;
    hierarchy;
    job_description;
    sorting;
    department_id;
}
exports.CreatePositionDto = CreatePositionDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        example: 'Software Engineer',
        description: 'The name of the position',
    }),
    __metadata("design:type", String)
], CreatePositionDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        example: 'Supervisor',
        description: 'The hierarchy of this position',
    }),
    __metadata("design:type", String)
], CreatePositionDto.prototype, "hierarchy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        example: 'Supervises the development and life cycle of systems',
        description: 'The job description fit for this position',
    }),
    __metadata("design:type", String)
], CreatePositionDto.prototype, "job_description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, swagger_1.ApiProperty)({ example: 2, description: 'Sorting number of the position' }),
    __metadata("design:type", Number)
], CreatePositionDto.prototype, "sorting", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, swagger_1.ApiProperty)({
        example: 'Department PK UUID',
        description: 'The Department where the position is available',
    }),
    __metadata("design:type", String)
], CreatePositionDto.prototype, "department_id", void 0);
class UpdatePositionDto {
    name;
    hierarchy;
    job_description;
    sorting;
    department_id;
    is_active;
}
exports.UpdatePositionDto = UpdatePositionDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        example: 'New Position name',
        description: 'If you want to update the Position Name',
    }),
    __metadata("design:type", String)
], UpdatePositionDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        example: 'Supervisor',
        description: 'The hierarchy of this position',
    }),
    __metadata("design:type", String)
], UpdatePositionDto.prototype, "hierarchy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        example: 'Supervises the development and life cycle of systems',
        description: 'The job description fit for this position',
    }),
    __metadata("design:type", String)
], UpdatePositionDto.prototype, "job_description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, swagger_1.ApiProperty)({ example: 2, description: 'Sorting number of the position' }),
    __metadata("design:type", Number)
], UpdatePositionDto.prototype, "sorting", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, swagger_1.ApiProperty)({
        example: 'Department PK UUID',
        description: 'The Department where the position is available',
    }),
    __metadata("design:type", String)
], UpdatePositionDto.prototype, "department_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({
        example: 'true or false',
        description: 'true if active and false if set to inactive',
    }),
    __metadata("design:type", Boolean)
], UpdatePositionDto.prototype, "is_active", void 0);
//# sourceMappingURL=position.dto.js.map