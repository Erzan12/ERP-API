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
exports.UpdateUserLocationDto = exports.CreateUserLocationDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateUserLocationDto {
    location_name;
    address_line_1;
    address_line_2;
    city;
    province;
    country;
}
exports.CreateUserLocationDto = CreateUserLocationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: 'Tayud',
        description: 'The name of the place the user located',
    }),
    __metadata("design:type", String)
], CreateUserLocationDto.prototype, "location_name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDefined)(),
    (0, swagger_1.ApiProperty)({
        example: 'Consolacion',
        description: 'The address_line_1 of the location',
    }),
    __metadata("design:type", String)
], CreateUserLocationDto.prototype, "address_line_1", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDefined)(),
    (0, swagger_1.ApiProperty)({
        example: 'Tayud',
        description: 'The address_line_2 of the location',
    }),
    __metadata("design:type", String)
], CreateUserLocationDto.prototype, "address_line_2", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: 'Cebu City',
        description: 'City of the location',
    }),
    __metadata("design:type", String)
], CreateUserLocationDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: 'Province of Cebu',
        description: 'Province of the location',
    }),
    __metadata("design:type", String)
], CreateUserLocationDto.prototype, "province", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: 'Philippines',
        description: 'Country of location',
    }),
    __metadata("design:type", String)
], CreateUserLocationDto.prototype, "country", void 0);
class UpdateUserLocationDto {
    location_name;
    address_line_1;
    address_line_2;
    city;
    province;
    country;
    isActive;
}
exports.UpdateUserLocationDto = UpdateUserLocationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: 'New User Location',
        description: 'If you want to update the User Location name',
    }),
    __metadata("design:type", String)
], UpdateUserLocationDto.prototype, "location_name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDefined)(),
    (0, swagger_1.ApiProperty)({
        example: 'Consolacion',
        description: 'The address_line_1 of the location',
    }),
    __metadata("design:type", String)
], UpdateUserLocationDto.prototype, "address_line_1", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDefined)(),
    (0, swagger_1.ApiProperty)({
        example: 'Tayud',
        description: 'The address_line_2 of the location',
    }),
    __metadata("design:type", String)
], UpdateUserLocationDto.prototype, "address_line_2", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: 'Cebu City',
        description: 'City of the location',
    }),
    __metadata("design:type", String)
], UpdateUserLocationDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: 'Province of Cebu',
        description: 'Province of the location',
    }),
    __metadata("design:type", String)
], UpdateUserLocationDto.prototype, "province", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: 'Philippines',
        description: 'Country of location',
    }),
    __metadata("design:type", String)
], UpdateUserLocationDto.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDefined)(),
    (0, swagger_1.ApiProperty)({
        example: 'true or false',
        description: 'Update the status for the user location',
    }),
    __metadata("design:type", Boolean)
], UpdateUserLocationDto.prototype, "isActive", void 0);
//# sourceMappingURL=user-location.dto.js.map