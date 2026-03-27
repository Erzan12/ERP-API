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
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const prisma_service_1 = require("../../config/prisma/prisma.service");
const reusable_group_role_permisison_helper_1 = require("../../utils/helpers/reusable-group-role-permisison.helper");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    prisma;
    constructor(prisma) {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET environment variable is not defined');
        }
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([
                (request) => {
                    return typeof request.cookies?.['accessToken'] === 'string'
                        ? request.cookies['accessToken']
                        : null;
                },
            ]),
            secretOrKey: secret,
        });
        this.prisma = prisma;
    }
    async validate(payload) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.userUUID },
            include: {
                employee: true,
                user_roles: {
                    where: { is_active: true },
                    include: {
                        role: {
                            include: {
                                role_permissions: {
                                    where: { is_active: true },
                                    include: {
                                        sub_module: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!user || user.is_active !== true) {
            throw new common_1.UnauthorizedException('User not found or invalid token');
        }
        if (payload.tokenVersion !== user.token_version) {
            throw new common_1.UnauthorizedException('Token has been invalidated');
        }
        return {
            id: user.id,
            email: user.email,
            department_id: user.employee.department_id,
            security_clearance_level: user.security_clearance_level ?? 0,
            roles: (0, reusable_group_role_permisison_helper_1.mapRolesToRequestUser)(user.user_roles),
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map