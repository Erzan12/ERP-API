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
exports.UpdatePersonDto = exports.CreatePersonDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const global_enums_decorator_1 = require("../../../../utils/decorators/global.enums.decorator");
class CreatePersonDto {
    first_name;
    middle_name;
    last_name;
    date_of_birth;
    gender;
    civil_status;
    email;
}
exports.CreatePersonDto = CreatePersonDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: 'Juan',
        description: 'First name of the employee',
    }),
    __metadata("design:type", String)
], CreatePersonDto.prototype, "first_name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: 'Hindi',
        description: 'Middle name of the employee but it is optional',
    }),
    __metadata("design:type", String)
], CreatePersonDto.prototype, "middle_name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: 'Tamad',
        description: 'Last name of the employee',
    }),
    __metadata("design:type", String)
], CreatePersonDto.prototype, "last_name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    (0, swagger_1.ApiProperty)({
        example: '2025-07-10',
        description: 'Date of birth of the employee',
    }),
    __metadata("design:type", String)
], CreatePersonDto.prototype, "date_of_birth", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => String),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        enum: global_enums_decorator_1.Gender,
        example: global_enums_decorator_1.Gender.MALE,
        description: 'Gender of the employee',
    }),
    (0, class_validator_1.IsEnum)(global_enums_decorator_1.Gender, { message: 'Gender must be male and female' }),
    __metadata("design:type", String)
], CreatePersonDto.prototype, "gender", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => String),
    (0, swagger_1.ApiProperty)({
        enum: global_enums_decorator_1.CivilStatus,
        example: global_enums_decorator_1.CivilStatus.SINGLE,
        description: 'Civil Status of the employee',
    }),
    (0, class_validator_1.IsEnum)(global_enums_decorator_1.CivilStatus, {
        message: 'Civil status must be single, married, separated, or widowed',
    }),
    __metadata("design:type", String)
], CreatePersonDto.prototype, "civil_status", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    (0, swagger_1.ApiProperty)({
        example: 'sample@gmail.com',
        description: 'Email of the employee',
    }),
    __metadata("design:type", String)
], CreatePersonDto.prototype, "email", void 0);
class UpdatePersonDto extends (0, swagger_1.PartialType)(CreatePersonDto) {
}
exports.UpdatePersonDto = UpdatePersonDto;
//# sourceMappingURL=person.dto.js.map