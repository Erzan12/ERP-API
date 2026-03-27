"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authenticated = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const security_clearance_guard_1 = require("../../middleware/security_clearance/security-clearance.guard");
const permission_guard_1 = require("../../middleware/guards/permission.guard");
const Authenticated = () => (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), permission_guard_1.PermissionsGuard, security_clearance_guard_1.SecurityClearanceGuard);
exports.Authenticated = Authenticated;
//# sourceMappingURL=auth-guard.decorator.js.map