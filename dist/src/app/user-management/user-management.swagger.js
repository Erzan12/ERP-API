"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupUserSwagger = setupUserSwagger;
const swagger_1 = require("@nestjs/swagger");
const auth_module_1 = require("../../auth/auth.module");
const user_managementV2_module_1 = require("../../modules/manager/user_management/user_managementV2.module");
function setupUserSwagger(app) {
    const optionsV2 = new swagger_1.DocumentBuilder()
        .setTitle('User Management API (v2)')
        .setDescription('API for Companies organization structure. CURRENTLY VIEWING API VERSION 2')
        .setVersion('2.0')
        .addTag('Authentication')
        .addTag('User Management')
        .build();
    const documentV2 = swagger_1.SwaggerModule.createDocument(app, optionsV2, {
        include: [user_managementV2_module_1.UserManagementV2Module, auth_module_1.AuthModule],
    });
    swagger_1.SwaggerModule.setup('docs/user-management/v2', app, documentV2);
    swagger_1.SwaggerModule.setup('docs/user-management', app, documentV2, {
        explorer: true,
        swaggerOptions: {
            urls: [
                { name: 'v2', url: '/docs/user-management/v2-json' },
            ],
            persistAuthorization: true,
            filter: true,
        },
    });
}
//# sourceMappingURL=user-management.swagger.js.map