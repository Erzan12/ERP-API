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
exports.UpdatePermissionTemplateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdatePermissionTemplateDto {
    name;
    department_id;
    position_id;
    role_permission_ids;
}
exports.UpdatePermissionTemplateDto = UpdatePermissionTemplateDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({ example: 'Accounting Clerk Template' }),
    __metadata("design:type", String)
], UpdatePermissionTemplateDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsInt)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'ID of the department for this permission template',
    }),
    __metadata("design:type", String)
], UpdatePermissionTemplateDto.prototype, "department_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'ID of the position for this permission template',
    }),
    __metadata("design:type", String)
], UpdatePermissionTemplateDto.prototype, "position_id", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsInt)({ each: true }),
    (0, swagger_1.ApiProperty)({
        example: [1, 2, 3],
        description: 'List of role_permission IDs to associate with the template',
    }),
    __metadata("design:type", Array)
], UpdatePermissionTemplateDto.prototype, "role_permission_ids", void 0);
//# sourceMappingURL=update-permission-template.dto.js.map