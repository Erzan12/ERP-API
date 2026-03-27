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
exports.UpdateCareerPostingDto = exports.CreateCareerPostingDto = void 0;
const class_validator_1 = require("class-validator");
const global_enums_decorator_1 = require("../../../../utils/decorators/global.enums.decorator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class CreateCareerPostingDto {
    position_id;
    slots;
    department_id;
    employee_type;
    employment_type;
    user_location_id;
}
exports.CreateCareerPostingDto = CreateCareerPostingDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: 'Position PK UUID',
        description: 'The PK uuid of the position',
    }),
    __metadata("design:type", String)
], CreateCareerPostingDto.prototype, "position_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: 5,
        description: 'The number of slots for this position',
    }),
    __metadata("design:type", Number)
], CreateCareerPostingDto.prototype, "slots", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: 'Deparment PK UUID',
        description: 'The PK uuid of the department',
    }),
    __metadata("design:type", String)
], CreateCareerPostingDto.prototype, "department_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(global_enums_decorator_1.EmployeeType, {
        message: 'Employment type must be land_based or sea_based',
    }),
    (0, class_transformer_1.Type)(() => String),
    (0, swagger_1.ApiProperty)({
        enum: global_enums_decorator_1.EmployeeType,
        example: global_enums_decorator_1.EmployeeType.LAND_BASED,
        description: 'The employee type of this career posting',
    }),
    __metadata("design:type", String)
], CreateCareerPostingDto.prototype, "employee_type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(global_enums_decorator_1.EmploymentType, {
        message: 'Employment type must be full_time or part_time',
    }),
    (0, class_transformer_1.Type)(() => String),
    (0, swagger_1.ApiProperty)({
        enum: global_enums_decorator_1.EmploymentType,
        example: global_enums_decorator_1.EmploymentType.FULL_TIME,
        description: 'The employment type of this career posting',
    }),
    __metadata("design:type", String)
], CreateCareerPostingDto.prototype, "employment_type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: 'User Location PK UUID',
        description: 'The PK uuid of the user location',
    }),
    __metadata("design:type", String)
], CreateCareerPostingDto.prototype, "user_location_id", void 0);
class UpdateCareerPostingDto {
    position_id;
    slots;
    job_description;
    department_id;
    employee_type;
    isPublished;
    is_active;
    employment_type;
    user_location_id;
}
exports.UpdateCareerPostingDto = UpdateCareerPostingDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: 'Position PK UUID',
        description: 'The PK uuid of the position',
    }),
    __metadata("design:type", String)
], UpdateCareerPostingDto.prototype, "position_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: 5,
        description: 'The number of slots for this position',
    }),
    __metadata("design:type", Number)
], UpdateCareerPostingDto.prototype, "slots", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: 'Manages the development team',
        description: 'The description of the position',
    }),
    __metadata("design:type", String)
], UpdateCareerPostingDto.prototype, "job_description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: 'Deparment PK UUID',
        description: 'The PK uuid of the department',
    }),
    __metadata("design:type", String)
], UpdateCareerPostingDto.prototype, "department_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(global_enums_decorator_1.EmployeeType, {
        message: 'Employment type must be land_based or sea_based',
    }),
    (0, class_transformer_1.Type)(() => String),
    (0, swagger_1.ApiProperty)({
        enum: global_enums_decorator_1.EmployeeType,
        example: global_enums_decorator_1.EmployeeType.LAND_BASED,
        description: 'The employee type of this career posting',
    }),
    __metadata("design:type", String)
], UpdateCareerPostingDto.prototype, "employee_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({
        example: 'true or false',
        description: 'true if want to published and false if unpublished',
    }),
    __metadata("design:type", Boolean)
], UpdateCareerPostingDto.prototype, "isPublished", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({
        example: 'true or false',
        description: 'true if active and false if set to inactive',
    }),
    __metadata("design:type", Boolean)
], UpdateCareerPostingDto.prototype, "is_active", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(global_enums_decorator_1.EmploymentType, {
        message: 'Employment type must be full_time or part_time',
    }),
    (0, class_transformer_1.Type)(() => String),
    (0, swagger_1.ApiProperty)({
        enum: global_enums_decorator_1.EmploymentType,
        example: global_enums_decorator_1.EmploymentType.FULL_TIME,
        description: 'The employment type of this career posting',
    }),
    __metadata("design:type", String)
], UpdateCareerPostingDto.prototype, "employment_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: 'User Location PK UUID',
        description: 'The PK uuid of the user location',
    }),
    __metadata("design:type", String)
], UpdateCareerPostingDto.prototype, "user_location_id", void 0);
//# sourceMappingURL=career-posting.dto.js.map