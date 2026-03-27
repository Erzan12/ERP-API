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
exports.UpdateEmployeeWithDetailsDto = exports.CreateEmployeeWithDetailsDto = void 0;
const employee_dto_1 = require("./employee.dto");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const person_dto_1 = require("./person.dto");
class CreateEmployeeWithDetailsDto {
    person;
    employee;
}
exports.CreateEmployeeWithDetailsDto = CreateEmployeeWithDetailsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => person_dto_1.CreatePersonDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => person_dto_1.CreatePersonDto),
    __metadata("design:type", person_dto_1.CreatePersonDto)
], CreateEmployeeWithDetailsDto.prototype, "person", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => employee_dto_1.CreateEmployeeDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => employee_dto_1.CreateEmployeeDto),
    __metadata("design:type", employee_dto_1.CreateEmployeeDto)
], CreateEmployeeWithDetailsDto.prototype, "employee", void 0);
class UpdateEmployeeWithDetailsDto {
    person;
    employee;
}
exports.UpdateEmployeeWithDetailsDto = UpdateEmployeeWithDetailsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => person_dto_1.UpdatePersonDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => person_dto_1.UpdatePersonDto),
    __metadata("design:type", person_dto_1.UpdatePersonDto)
], UpdateEmployeeWithDetailsDto.prototype, "person", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => employee_dto_1.UpdateEmployeeDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => employee_dto_1.UpdateEmployeeDto),
    __metadata("design:type", employee_dto_1.UpdateEmployeeDto)
], UpdateEmployeeWithDetailsDto.prototype, "employee", void 0);
//# sourceMappingURL=employee-person.dto.js.map