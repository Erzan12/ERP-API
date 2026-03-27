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
exports.CreateUserWithRoleDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const user_details_dto_1 = require("./user-details.dto");
const swagger_1 = require("@nestjs/swagger");
class CreateUserWithRoleDto {
    user_details;
    role_name;
}
exports.CreateUserWithRoleDto = CreateUserWithRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => user_details_dto_1.UserDetailsDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => user_details_dto_1.UserDetailsDto),
    __metadata("design:type", user_details_dto_1.UserDetailsDto)
], CreateUserWithRoleDto.prototype, "user_details", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        example: 'Administrator',
        description: 'The role to be assign to a user',
    }),
    __metadata("design:type", String)
], CreateUserWithRoleDto.prototype, "role_name", void 0);
//# sourceMappingURL=create-user-with-role-permission.dto.js.map