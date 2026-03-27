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
exports.SecurityClearanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../config/prisma/prisma.service");
let SecurityClearanceService = class SecurityClearanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async updateUserClearance(adminId, targetUserId, newClearanceLevel, adminClearanceLevel) {
        if (adminClearanceLevel < 9) {
            throw new common_1.ForbiddenException('Only administrators with security clearance level 9 can modify clearance levels.');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: targetUserId },
        });
        if (!user) {
            throw new common_1.NotFoundException('Target user not found');
        }
        if (user.id === adminId) {
            throw new common_1.ForbiddenException('You cannot change your own clearance level.');
        }
        if (user.security_clearance_level === newClearanceLevel) {
            throw new common_1.BadRequestException(`User already has security clearance level ${newClearanceLevel}.`);
        }
        const updated = await this.prisma.user.update({
            where: { id: targetUserId },
            data: {
                security_clearance_level: newClearanceLevel,
            },
            include: {
                person: true,
            },
        });
        return {
            status: 'success',
            message: `Security clearance updated to level ${newClearanceLevel}, for user ${updated.person.first_name} ${updated.person.last_name}`,
            user: {
                id: updated.id,
                email: updated.email,
                security_clearance_level: updated.security_clearance_level,
            },
        };
    }
};
exports.SecurityClearanceService = SecurityClearanceService;
exports.SecurityClearanceService = SecurityClearanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SecurityClearanceService);
//# sourceMappingURL=security-clearance.service.js.map