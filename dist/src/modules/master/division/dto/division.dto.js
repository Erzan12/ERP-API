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
exports.UpdateDivisionDto = exports.CreateDivisionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateDivisionDto {
    name;
    division_head_id;
}
exports.CreateDivisionDto = CreateDivisionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        example: 'Cebu Air Inc',
        description: 'The name of the division',
    }),
    __metadata("design:type", String)
], CreateDivisionDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, swagger_1.ApiProperty)({
        example: 'Division UUID',
        description: 'ID number of the division head it belongs to',
    }),
    __metadata("design:type", String)
], CreateDivisionDto.prototype, "division_head_id", void 0);
class UpdateDivisionDto {
    name;
    is_active;
}
exports.UpdateDivisionDto = UpdateDivisionDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        example: 'New Division Name',
        description: 'If you want to update the Division name',
    }),
    __metadata("design:type", String)
], UpdateDivisionDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsDefined)(),
    (0, swagger_1.ApiProperty)({
        example: 'true or false',
        description: 'Update the status of the division',
    }),
    __metadata("design:type", Boolean)
], UpdateDivisionDto.prototype, "is_active", void 0);
//# sourceMappingURL=division.dto.js.map