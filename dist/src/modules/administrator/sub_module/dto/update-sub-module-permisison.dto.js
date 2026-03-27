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
exports.UpdateSubModulePermisisonDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpdateSubModulePermisisonDto {
    action;
    is_active;
}
exports.UpdateSubModulePermisisonDto = UpdateSubModulePermisisonDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        example: 'view, create, update, note, delete',
        description: 'if you want to update the current actions',
    }),
    __metadata("design:type", String)
], UpdateSubModulePermisisonDto.prototype, "action", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsDefined)(),
    (0, swagger_1.ApiProperty)({
        example: 'true or false',
        description: 'If you want to update the status of the action ',
    }),
    __metadata("design:type", Boolean)
], UpdateSubModulePermisisonDto.prototype, "is_active", void 0);
//# sourceMappingURL=update-sub-module-permisison.dto.js.map