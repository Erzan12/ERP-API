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
exports.SecurityClearanceGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const security_clearance_decorator_1 = require("./security-clearance.decorator");
let SecurityClearanceGuard = class SecurityClearanceGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredLevel = this.reflector.get(security_clearance_decorator_1.SECURITY_CLEARANCE_KEY, context.getHandler());
        if (!requiredLevel)
            return true;
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.ForbiddenException('Not authenticated');
        }
        const userLevel = user.security_clearance_level ?? 0;
        if (userLevel < requiredLevel) {
            throw new common_1.ForbiddenException(`Security clearance Level ${requiredLevel} required. You only have Level ${userLevel}.`);
        }
        return true;
    }
};
exports.SecurityClearanceGuard = SecurityClearanceGuard;
exports.SecurityClearanceGuard = SecurityClearanceGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], SecurityClearanceGuard);
//# sourceMappingURL=security-clearance.guard.js.map