"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Can = exports.PERMISSIONS_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.PERMISSIONS_KEY = 'permissions';
const Can = (permission) => (0, common_1.SetMetadata)(exports.PERMISSIONS_KEY, permission);
exports.Can = Can;
//# sourceMappingURL=can.decorator.js.map