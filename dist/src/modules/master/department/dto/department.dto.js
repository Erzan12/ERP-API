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
exports.UpdateDepartmentDto = exports.CreateDepartmentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateDepartmentDto {
    name;
    sorting;
    division_id;
}
exports.CreateDepartmentDto = CreateDepartmentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    (0, swagger_1.ApiProperty)({
        example: 'Human Resources',
        description: 'The name of the department',
    }),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, swagger_1.ApiProperty)({ example: 2, description: 'Sorting number of the department' }),
    __metadata("design:type", Number)
], CreateDepartmentDto.prototype, "sorting", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, swagger_1.ApiProperty)({
        example: 'Division PK UUID',
        description: 'The Division where the department belongs to',
    }),
    __metadata("design:type", String)
], CreateDepartmentDto.prototype, "division_id", void 0);
class UpdateDepartmentDto {
    name;
    sorting;
    division_id;
    is_active;
}
exports.UpdateDepartmentDto = UpdateDepartmentDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        example: 'New Department name',
        description: 'If you want to update the Department name',
    }),
    __metadata("design:type", String)
], UpdateDepartmentDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, swagger_1.ApiProperty)({ example: 2, description: 'Sorting number of the department' }),
    __metadata("design:type", Number)
], UpdateDepartmentDto.prototype, "sorting", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: 'Division PK UUID',
        description: 'The division where the department belongs to',
    }),
    __metadata("design:type", String)
], UpdateDepartmentDto.prototype, "division_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsDefined)(),
    (0, swagger_1.ApiProperty)({
        example: 'true or false',
        description: 'Update the status of a department',
    }),
    __metadata("design:type", Boolean)
], UpdateDepartmentDto.prototype, "is_active", void 0);
//# sourceMappingURL=department.dto.js.map