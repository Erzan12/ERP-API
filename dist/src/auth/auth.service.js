"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const crypto = __importStar(require("crypto"));
const bcrypt = __importStar(require("bcryptjs"));
const prisma_service_1 = require("../config/prisma/prisma.service");
const audit_service_1 = require("../modules/administrator/audit/audit.service");
const reusable_group_role_permisison_helper_1 = require("../utils/helpers/reusable-group-role-permisison.helper");
let AuthService = class AuthService {
    prisma;
    jwtService;
    auditService;
    constructor(prisma, jwtService, auditService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.auditService = auditService;
    }
    async resetPasswordWithToken(dto, token) {
        if (!token) {
            throw new common_1.BadRequestException('Reset token is required.');
        }
        const passwordResetToken = await this.prisma.passwordResetToken.findFirst({
            where: { password_token: token },
            include: { user: true },
        });
        if (!passwordResetToken) {
            throw new common_1.BadRequestException('Invalid or expired reset token.');
        }
        if (passwordResetToken.isUsed) {
            throw new common_1.BadRequestException('Reset token has already been used.');
        }
        if (passwordResetToken.expires_at < new Date()) {
            throw new common_1.BadRequestException('Reset token has expired.');
        }
        const user = passwordResetToken.user;
        const isSamePassword = await bcrypt.compare(dto.newPassword, user.password);
        if (isSamePassword) {
            throw new common_1.BadRequestException('New password cannot be the same as the old password, Please add a new one!');
        }
        const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
        const updatedUser = await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                require_reset: 0,
            },
        });
        await this.prisma.passwordResetToken.update({
            where: { id: passwordResetToken.id },
            data: {
                isUsed: true,
            },
        });
        return {
            status: 'success',
            message: `Password has been reset. You may now log in!`,
            user: {
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
            },
        };
    }
    async generateResetToken(userId) {
        await this.prisma.passwordResetToken.deleteMany({
            where: {
                user_id: userId,
                isUsed: false,
            },
        });
        const tokenKey = crypto.randomBytes(64).toString('hex');
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3);
        const token = await this.prisma.passwordResetToken.create({
            data: {
                user_id: userId,
                password_token: tokenKey,
                expires_at: expiresAt,
            },
        });
        return {
            status: 'success',
            message: 'Reset Token generated successfully',
            token,
        };
    }
    async validateUser(username, password) {
        const user = await this.prisma.user.findUnique({
            where: { username },
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
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Entered password:', password);
        console.log('Stored hashed password:', user.password);
        console.log('Password valid?', isPasswordValid);
        if (!isPasswordValid)
            throw new common_1.UnauthorizedException('Invalid password');
        return user;
    }
    async login(loginDto, ipAddress, userAgent) {
        const { username, password } = loginDto;
        const userAudit = await this.prisma.user.findUnique({
            where: { username },
            include: {
                user_roles: {
                    include: {
                        role: true,
                        user_permissions: {
                            include: {
                                role_permission: {
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
        if (!userAudit || !(await bcrypt.compare(password, userAudit.password))) {
            await this.auditService.logAuth('LOGIN_FAILED', undefined, ipAddress, userAgent, false, `Failed login attempt for username: ${username}`);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const userValidate = await this.validateUser(username, password);
        if (userValidate.require_reset === 1) {
            throw new common_1.BadRequestException('You must reset your password first for first time login!');
        }
        if (userValidate.is_active !== true) {
            throw new common_1.BadRequestException('Your account was deactivated.');
        }
        if (userValidate.password_reset && userValidate.password_reset !== '') {
            await this.prisma.user.update({
                where: { id: userValidate.id },
                data: { password_reset: '' },
            });
        }
        const resetToken = await this.prisma.passwordResetToken.findFirst({
            where: { user_id: userValidate.id },
        });
        if (!resetToken) {
            throw new common_1.BadRequestException('No token assigned to this user.');
        }
        const issuedAt = Math.floor(Date.now() / 1000);
        const payload = {
            userUUID: userValidate.id,
            tokenVersion: userValidate.token_version,
            department_id: userValidate.employee.department_id,
            name: userValidate.username,
            issuedAt: issuedAt,
        };
        const token = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '8h',
        });
        await this.prisma.user.update({
            where: { id: userValidate.id },
            data: {
                last_login: new Date(),
            },
        });
        const requestUser = {
            id: userValidate.id,
            email: userValidate.email,
            department_id: userValidate.employee.department_id,
            security_clearance_level: userValidate.security_clearance_level ?? 0,
            roles: (0, reusable_group_role_permisison_helper_1.mapRolesToRequestUser)(userValidate.user_roles),
        };
        await this.auditService.logAuth('LOGIN', requestUser, ipAddress, userAgent, true);
        const isNewAccount = password === 'avegabros' ||
            userValidate.password_reset ||
            userValidate.require_reset === 1;
        return {
            status: 1,
            message: 'Login successful',
            token,
            ...(isNewAccount && { new_account: 1 }),
        };
    }
    async logout(requestUser, ipAddress, userAgent) {
        await this.prisma.user.update({
            where: { id: requestUser.id },
            data: {
                token_version: { increment: 1 },
            },
        });
        await this.auditService.logAuth('LOGOUT', requestUser, ipAddress, userAgent, true);
        return { message: 'User logged out successfully' };
    }
    async getUser(requestUser) {
        if (!requestUser?.id) {
            throw new common_1.UnauthorizedException('Invalid or missing token');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: requestUser.id },
            include: {
                employee: {
                    include: {
                        person: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        division: true,
                        company: true,
                        employment_status: true,
                        position: true,
                    },
                },
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
        const employee = user.employee;
        return {
            status: 'success',
            message: 'User is validated successfully',
            data: {
                id: user.id,
                full_name: [
                    employee.person.first_name,
                    employee.person.middle_name,
                    employee.person.last_name,
                ]
                    .filter(Boolean)
                    .join(' '),
                email: user.email,
                department: employee.department
                    ? {
                        id: employee.department.id,
                        name: employee.department.name,
                    }
                    : null,
                company: employee.company.name,
                division: employee.division.name,
                position: employee.position.name,
                security_clearance_level: user.security_clearance_level ?? 0,
                roles: user.user_roles.map((ur) => {
                    const uniqueSubmodules = [
                        ...new Map(ur.role.role_permissions.map((rp) => [
                            rp.sub_module.id,
                            {
                                id: rp.sub_module.id,
                                name: rp.sub_module.name,
                            },
                        ])).values(),
                    ];
                    return {
                        id: ur.role?.id ?? 0,
                        role_name: ur.role?.name ?? 'Unknown Role',
                        isActive: ur.is_active ?? 'false',
                        sub_modules: uniqueSubmodules,
                    };
                }),
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        audit_service_1.AuditService])
], AuthService);
//# sourceMappingURL=auth.service.js.map