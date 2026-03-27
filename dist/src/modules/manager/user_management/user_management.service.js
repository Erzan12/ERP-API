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
exports.UserManagementService = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
const bcrypt = __importStar(require("bcryptjs"));
const mail_service_1 = require("../../../jobs/mail/mail.service");
const prisma_service_1 = require("../../../config/prisma/prisma.service");
const audit_service_1 = require("../../administrator/audit/audit.service");
const auth_service_1 = require("../../../auth/auth.service");
let UserManagementService = class UserManagementService {
    prisma;
    mailService;
    auditService;
    authService;
    constructor(prisma, mailService, auditService, authService) {
        this.prisma = prisma;
        this.mailService = mailService;
        this.auditService = auditService;
        this.authService = authService;
    }
    async viewUserAccount(user) {
        const canViewAllUsers = user.roles.some((role) => role.name === 'Administrator', 'Manager');
        const users = await this.prisma.user.findMany({
            where: canViewAllUsers ? {} : { id: user.id },
            select: {
                id: true,
                username: true,
                user_roles: {
                    select: {
                        role_name: true,
                    },
                },
                is_active: true,
            },
        });
        return {
            status: 'success',
            message: canViewAllUsers ? 'All User Accounts' : 'User Account',
            data: {
                user_accounts: users,
            },
        };
    }
    async createUserAccount(createUserWithRoleDto, user, req, userId) {
        return this.prisma.$transaction(async (tx) => {
            try {
                const plainPassword = createUserWithRoleDto.user_details.password;
                const hashedPassword = await bcrypt.hash(plainPassword, 10);
                const existingUser = await this.prisma.user.findFirst({
                    where: {
                        OR: [
                            { username: createUserWithRoleDto.user_details.username },
                            { email: createUserWithRoleDto.user_details.email },
                        ],
                    },
                });
                if (existingUser) {
                    throw new common_1.BadRequestException('Username or email address already exist!');
                }
                const requestUser = await this.prisma.user.findUnique({
                    where: { id: user.id },
                    include: {
                        employee: {
                            include: {
                                person: true,
                                position: true,
                            },
                        },
                        user_roles: true,
                    },
                });
                if (!requestUser ||
                    !requestUser.employee ||
                    !requestUser.employee.person) {
                    throw new common_1.BadRequestException(`Creator (manager) information not found.`);
                }
                const admin = `${requestUser.employee.person.first_name} ${requestUser.employee.person.last_name}`;
                const adminPos = requestUser.employee.position.name;
                const allowedRoles = [
                    'Administrator',
                    'Super Administrator',
                    'Manager',
                ];
                const isAdmin = requestUser.user_roles.some((role) => allowedRoles.includes(role.role_name));
                if (!isAdmin) {
                    throw new common_1.ForbiddenException('User is not allowed create User Account');
                }
                const employee = await this.prisma.employee.findUnique({
                    where: {
                        employee_id: createUserWithRoleDto.user_details.employee_id,
                    },
                    include: { person: true },
                });
                if (!employee) {
                    throw new common_1.BadRequestException('Employee not found');
                }
                const userExist = await this.prisma.user.findUnique({
                    where: { employee_id: employee.id },
                });
                if (userExist) {
                    throw new common_1.BadRequestException('User already exist');
                }
                const newUser = await tx.user.create({
                    data: {
                        employee_id: employee.id,
                        person_id: employee.person.id,
                        username: createUserWithRoleDto.user_details.username,
                        email: createUserWithRoleDto.user_details.email,
                        password: hashedPassword,
                        is_active: true,
                        require_reset: 1,
                        created_by: admin,
                        created_at: new Date(),
                    },
                    include: {
                        employee: true,
                        user_roles: true,
                    },
                });
                const empDept = await this.prisma.employee.findUnique({
                    where: { id: employee.id },
                    include: { department: true },
                });
                if (!empDept) {
                    throw new common_1.BadRequestException('Employee Department does not exist');
                }
                if (createUserWithRoleDto.role_name) {
                    const role = await tx.role.findFirst({
                        where: {
                            name: createUserWithRoleDto.role_name,
                            is_active: true,
                        },
                    });
                    if (!role) {
                        throw new common_1.BadRequestException('Invalid role name');
                    }
                    const rolePermissions = await tx.rolePermission.findMany({
                        where: {
                            role_id: role.id,
                            is_active: true,
                        },
                    });
                    if (!rolePermissions.length) {
                        throw new common_1.BadRequestException('No permissions found for this role');
                    }
                    const userRole = await tx.userRole.create({
                        data: {
                            user_id: newUser.id,
                            role_id: role.id,
                            role_name: role.name,
                            created_at: new Date(),
                        },
                    });
                    for (const rp of rolePermissions) {
                        await tx.userPermission.create({
                            data: {
                                user_id: newUser.id,
                                user_role_id: userRole.id,
                                role_permission_id: rp.id,
                                action: rp.action,
                            },
                        });
                    }
                }
                const tokenKey = crypto.randomBytes(64).toString('hex');
                const createdToken = await tx.passwordResetToken.create({
                    data: {
                        user_id: newUser.id,
                        password_token: tokenKey,
                        expires_at: new Date(Date.now() + 60 * 60 * 24 * 3 * 1000),
                    },
                });
                const userToken = crypto.randomBytes(64).toString('hex');
                await tx.userToken.create({
                    data: {
                        user_id: newUser.id,
                        user_token: userToken,
                    },
                });
                await this.mailService.sendWelcomeMail(newUser.email, newUser.username, plainPassword, tokenKey);
                const actorUser = await this.prisma.user.findUnique({
                    where: { id: userId },
                });
                await this.auditService.logUserCreation({
                    actorUserId: actorUser?.id,
                    actorEmail: actorUser?.email,
                    newUser,
                    req,
                });
                return {
                    status: 'success',
                    message: `User ${newUser.username} with Employee ID ${newUser.employee?.employee_id} created with temporary password.`,
                    created_by: {
                        id: requestUser.id,
                        name: admin,
                        position: adminPos,
                    },
                    user_id: newUser.id,
                    username: newUser.username,
                    password: plainPassword,
                    reset_token: createdToken.password_token,
                };
            }
            catch (error) {
                console.error('Create user failed:', error);
                throw error;
            }
        });
    }
    async resendInvitation(dto, user) {
        const actingUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: {
                employee: {
                    include: {
                        person: true,
                        position: true,
                    },
                },
                user_roles: true,
            },
        });
        if (!actingUser || !actingUser.employee || !actingUser.employee.person) {
            throw new common_1.BadRequestException(`User does not exist.`);
        }
        const admin = `${actingUser.employee.person.first_name} ${actingUser.employee.person.last_name}`;
        const adminPos = actingUser.employee.position.name;
        const allowedRoles = ['Administrator', 'Super Administrator', 'Manager'];
        const isAdmin = actingUser.user_roles.some((role) => allowedRoles.includes(role.role_name));
        if (!isAdmin) {
            throw new common_1.ForbiddenException('User is not allowed create User Account');
        }
        const invitedUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!invitedUser) {
            throw new common_1.NotFoundException('User not found.');
        }
        if (invitedUser.require_reset === 0) {
            throw new common_1.BadRequestException('User has already completed account setup.');
        }
        const resetToken = await this.authService.generateResetToken(invitedUser.id);
        await this.mailService.sendResetTokenEmail(invitedUser.email, invitedUser.username, resetToken.token.password_token);
        return {
            status: 'success',
            message: `Invitation resent to ${user.email}`,
            user_id: invitedUser.id,
            reset_token: resetToken.token,
            user_name: invitedUser.username,
            updated_by: {
                name: admin,
                position: adminPos,
            },
        };
    }
    async deactivateUserAccount(deactivateUserAccountDto, user) {
        const existingUser = await this.prisma.user.findUnique({
            where: { id: deactivateUserAccountDto.user_id },
        });
        if (!existingUser) {
            throw new common_1.BadRequestException('User not found');
        }
        if (existingUser.is_active === false) {
            throw new common_1.ForbiddenException('User account is already deactivated');
        }
        await this.prisma.user.update({
            where: { id: deactivateUserAccountDto.user_id },
            data: {
                is_active: false,
            },
        });
        return {
            status: 'success',
            message: `User ID ${deactivateUserAccountDto.user_id} has been deactivated`,
            deactivated_by: `User Role ID No. ${user.id}`,
        };
    }
    async reactivateUserAccount(reactivateUserAccountDto, user) {
        const existingDeactivatedUser = await this.prisma.user.findUnique({
            where: { id: reactivateUserAccountDto.user_id },
        });
        if (!existingDeactivatedUser) {
            throw new common_1.BadRequestException('Deactivated User not found');
        }
        if (existingDeactivatedUser.is_active === true) {
            throw new common_1.ConflictException('User Account is still active');
        }
        await this.prisma.user.update({
            where: { id: reactivateUserAccountDto.user_id },
            data: {
                is_active: true,
            },
        });
        return {
            status: 'success',
            message: `User ID ${reactivateUserAccountDto.user_id} has been reactivated!`,
            reactivated_by: `User Role ID No. ${user.id}`,
        };
    }
    async viewNewEmployeeWithoutUserAccount(user) {
        const isAdmin = user.roles.some((role) => role.name === 'Administrator');
        const isManager = user.roles.some((role) => role.name === 'Manager');
        const requestUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            include: {
                employee: true,
            },
        });
        if (!requestUser) {
            throw new common_1.BadRequestException('User does not exist');
        }
        let departmentFilter = {};
        if (!isAdmin) {
            await this.prisma.employee.findUnique({
                where: { id: requestUser.employee.id },
                select: { department_id: true },
            });
            if (!requestUser) {
                throw new common_1.ForbiddenException('User is not linked to an employee profile.');
            }
            if (isManager) {
                departmentFilter = {
                    department_id: requestUser.employee.department_id,
                };
            }
            else {
                throw new common_1.ForbiddenException('Only administrators or department managers can view new employees.');
            }
        }
        const newEmployees = await this.prisma.employee.findMany({
            where: {
                user: null,
                ...departmentFilter,
            },
            select: {
                id: true,
                employee_id: true,
                person: true,
                department: {
                    select: { id: true, name: true },
                },
                user: true,
            },
        });
        if (newEmployees.length === 0) {
            throw new common_1.ForbiddenException('No new employees without user accounts found.');
        }
        return {
            status: 'success',
            message: requestUser
                ? 'All new employees without user accounts'
                : 'New employees in your department without user accounts',
            data: {
                employees: newEmployees,
            },
        };
    }
};
exports.UserManagementService = UserManagementService;
exports.UserManagementService = UserManagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService,
        audit_service_1.AuditService,
        auth_service_1.AuthService])
], UserManagementService);
//# sourceMappingURL=user_management.service.js.map