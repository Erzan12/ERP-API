"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapFriendlyNameToUUID = MapFriendlyNameToUUID;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
function MapFriendlyNameToUUID(map, propertyName) {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value !== 'string' || !value) {
            throw new common_1.BadRequestException(`${propertyName || 'value'} is required`);
        }
        if (value in map)
            return map[value];
        throw new common_1.BadRequestException(`Invalid ${propertyName || 'value'}: ${value}. Allowed values: ${Object.keys(map).join(', ')}`);
    });
}
//# sourceMappingURL=uuid-mapper.helper.js.map