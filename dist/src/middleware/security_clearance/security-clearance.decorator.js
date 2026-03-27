"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityClearance = exports.SECURITY_CLEARANCE_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.SECURITY_CLEARANCE_KEY = 'security_clearance_level';
const SecurityClearance = (level) => (0, common_1.SetMetadata)(exports.SECURITY_CLEARANCE_KEY, level);
exports.SecurityClearance = SecurityClearance;
//# sourceMappingURL=security-clearance.decorator.js.map