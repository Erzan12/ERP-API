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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const swagger_1 = require("@nestjs/swagger");
const swagger_response_helper_1 = require("../utils/helpers/swagger-response.helper");
const login_dto_1 = require("./dto/login.dto");
const reset_password_with_token_dto_1 = require("./dto/reset-password-with-token.dto");
const public_decorator_1 = require("../utils/decorators/public.decorator");
const session_user_decorator_1 = require("../utils/decorators/session-user.decorator");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginDto, req, res) {
        const ipAddress = req.ip || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];
        const result = await this.authService.login(loginDto, ipAddress, userAgent);
        res.cookie('accessToken', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600000,
            path: '/',
        });
        return result;
    }
    logout(requestUser, req, res) {
        const ipAddress = req.ip || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
        });
        return this.authService.logout(requestUser, ipAddress, userAgent);
    }
    passwordResetWithToken(token, resetPasswordWithTokenDto) {
        return this.authService.resetPasswordWithToken(resetPasswordWithTokenDto, token);
    }
    async verify(requestUser) {
        return this.authService.getUser(requestUser);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'User authorized login' }),
    (0, swagger_response_helper_1.ApiLoginResponse)('User login successful'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, swagger_1.ApiOperation)({ summary: 'User will logout' }),
    (0, swagger_response_helper_1.ApiPostResponse)('User logout successfully'),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('reset-password'),
    (0, swagger_1.ApiOperation)({ summary: 'User reset password' }),
    (0, swagger_response_helper_1.ApiPostResponse)('User reset password successfully'),
    __param(0, (0, common_1.Query)('token')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reset_password_with_token_dto_1.ResetPasswordWithTokenDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "passwordResetWithToken", null);
__decorate([
    (0, common_1.Get)('/verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify user' }),
    (0, swagger_response_helper_1.ApiLoginResponse)('User has been verified'),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verify", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)({ path: 'auth', version: '2' }),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map