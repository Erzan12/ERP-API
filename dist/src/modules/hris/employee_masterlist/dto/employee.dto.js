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
exports.UpdateEmployeeDto = exports.CreateEmployeeDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateEmployeeDto {
    company_id;
    department_id;
    position_id;
    division_id;
    salary;
    hire_date;
    pay_frequency;
    employment_status_id;
    monthly_equivalent_salary;
    archive_date;
    other_employee_data;
    corporate_rank_id;
}
exports.CreateEmployeeDto = CreateEmployeeDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        name: 'company_id',
        example: 'PK uuid of company',
        description: 'Company of the employee',
    }),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "company_id", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        name: 'department_id',
        example: 'PK uuid of department',
        description: 'Department of the employee',
    }),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "department_id", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        name: 'position_id',
        example: 'PK uuid of position',
        description: 'Position of the employee',
    }),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "position_id", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        name: 'division_id',
        example: 'PK uuid of division',
        description: 'Division of the employee',
    }),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "division_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: 21000,
        description: 'The salary of the employee',
    }),
    __metadata("design:type", Number)
], CreateEmployeeDto.prototype, "salary", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: '2025-07-10',
        description: 'Hired date of the employee',
    }),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "hire_date", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: 'Monthly',
        description: 'Pay frequency of the employee salary',
    }),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "pay_frequency", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDefined)(),
    (0, swagger_1.ApiProperty)({
        name: 'employment_status_id',
        example: 'PK uuid of employment status',
        description: 'The status of employee if Probitionary, Regular, On Leave, Resigned, Terminated',
    }),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "employment_status_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        example: 21000,
        description: 'The equivalent amount of salary per month of the employee',
    }),
    __metadata("design:type", Number)
], CreateEmployeeDto.prototype, "monthly_equivalent_salary", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: 'can be left out for now since its optional',
        description: 'The archived date of this employee record',
    }),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "archive_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, swagger_1.ApiProperty)({
        example: 'Hobbies, Personal Experiences, etc. can be left out for now since its optional',
        description: 'Other personal data or details of the employee',
    }),
    __metadata("design:type", Object)
], CreateEmployeeDto.prototype, "other_employee_data", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: 'can be left out for now since its optional',
        description: 'Rank of the employee in the company',
    }),
    __metadata("design:type", Number)
], CreateEmployeeDto.prototype, "corporate_rank_id", void 0);
class UpdateEmployeeDto extends (0, swagger_1.PartialType)(CreateEmployeeDto) {
}
exports.UpdateEmployeeDto = UpdateEmployeeDto;
//# sourceMappingURL=employee.dto.js.map