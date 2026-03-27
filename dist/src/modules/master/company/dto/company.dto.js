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
exports.UpdateCompanyDto = exports.CreateCompanyDto = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreateCompanyDto {
    name;
    address;
    telephone_no;
    fax_no;
    company_tin;
    is_top_20000;
    abbreviation;
}
exports.CreateCompanyDto = CreateCompanyDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: 'Avega Bros. Integrated Shipping Corp',
        description: 'Name of the company',
    }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: 'Cebu City, Cebu',
        description: 'Address or location of the company',
    }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: '011-63-45-123-4567',
        description: 'Telephone No. of the company',
    }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "telephone_no", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: '011-63-2-1234567',
        description: 'Fax No. of the company',
    }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "fax_no", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: '11-M1115-1234',
        description: 'Registered Tax Identification No. of the company',
    }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "company_tin", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Expose)({ name: 'is_top_20000' }),
    (0, swagger_1.ApiProperty)({
        example: 'yes or no',
        description: 'yes = 1, no = 0',
    }),
    (0, class_transformer_1.Transform)(({ value }) => {
        console.log('Transforming status:', value);
        if (value === 'yes')
            return 1;
        if (value === 'no')
            return 2;
        throw new common_1.BadRequestException(`Invalid is_top_20000 value ${value}. Allowed values are "yes" or "no"`);
    }),
    __metadata("design:type", Number)
], CreateCompanyDto.prototype, "is_top_20000", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: 'ABISC',
        description: 'Short name or abbreviation of the company',
    }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "abbreviation", void 0);
class UpdateCompanyDto {
    name;
    address;
    telephone_no;
    fax_no;
    company_tin;
    is_top_20000;
    abbreviation;
    is_active;
}
exports.UpdateCompanyDto = UpdateCompanyDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: 'Avega Bros. Integrated Shipping Corp',
        description: 'Update current company name',
    }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: 'Cebu City, Cebu',
        description: 'Update current company location',
    }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: '011-63-45-123-4567',
        description: 'Update current company telephone no.',
    }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "telephone_no", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: '011-63-2-1234567',
        description: 'Update current company fax no.',
    }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "fax_no", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: '11-M1115-1234',
        description: 'Update current company tin no.',
    }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "company_tin", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Expose)({ name: 'is_top_20000' }),
    (0, swagger_1.ApiProperty)({
        example: 'yes or no',
        description: 'Update current company is top 20000?',
    }),
    (0, class_transformer_1.Transform)(({ value }) => {
        console.log('Transforming status:', value);
        if (value === undefined || value === null)
            return undefined;
        if (value === 'yes')
            return 1;
        if (value === 'no')
            return 0;
        throw new common_1.BadRequestException(`Invalid is_top_20000 value ${value}. Allowed values are "yes" or "no"`);
    }),
    __metadata("design:type", Number)
], UpdateCompanyDto.prototype, "is_top_20000", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: 'ABISC',
        description: 'Update current company abbreviation',
    }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "abbreviation", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsDefined)(),
    (0, swagger_1.ApiProperty)({
        example: 'true or false',
        description: 'Update current company status',
    }),
    __metadata("design:type", Boolean)
], UpdateCompanyDto.prototype, "is_active", void 0);
//# sourceMappingURL=company.dto.js.map