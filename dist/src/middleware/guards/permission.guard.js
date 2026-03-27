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
var PermissionsGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const casl_service_1 = require("../casl/casl.service");
const can_decorator_1 = require("../../utils/decorators/can.decorator");
const action_map_1 = require("../../utils/constants/action-map");
const public_decorator_1 = require("../../utils/decorators/public.decorator");
const audit_service_1 = require("../../modules/administrator/audit/audit.service");
let PermissionsGuard = PermissionsGuard_1 = class PermissionsGuard {
    reflector;
    caslAbilityService;
    auditService;
    logger = new common_1.Logger(PermissionsGuard_1.name);
    constructor(reflector, caslAbilityService, auditService) {
        this.reflector = reflector;
        this.caslAbilityService = caslAbilityService;
        this.auditService = auditService;
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic)
            return true;
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.ForbiddenException('Please login to access this resource.');
        }
        const permission = this.reflector.get(can_decorator_1.PERMISSIONS_KEY, context.getHandler());
        if (!permission) {
            return true;
        }
        const action = permission.action.toLowerCase().trim();
        const subject = permission.subject.toLowerCase().trim();
        if (!action_map_1.VALID_ACTIONS.includes(action)) {
            throw new common_1.ForbiddenException(`Invalid action "${action}" used in @Can().`);
        }
        const ability = this.caslAbilityService.defineAbilitiesFor(user.roles);
        this.logger.debug('User roles structure: ' + JSON.stringify(user.roles, null, 2));
        const canAccess = ability.can(action, subject);
        if (!canAccess) {
            await this.auditService.logPermissionDenied(user, action, subject, request.ip, request.url);
            throw new common_1.ForbiddenException(`You do not have permission to ${action} ${subject}.`);
        }
        return true;
    }
};
exports.PermissionsGuard = PermissionsGuard;
exports.PermissionsGuard = PermissionsGuard = PermissionsGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        casl_service_1.CaslAbilityService,
        audit_service_1.AuditService])
], PermissionsGuard);
//# sourceMappingURL=permission.guard.js.map