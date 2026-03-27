"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupManagerSwagger = setupManagerSwagger;
const swagger_1 = require("@nestjs/swagger");
const auth_module_1 = require("../../auth/auth.module");
const managerV2_module_1 = require("../../modules/manager/managerV2.module");
function setupManagerSwagger(app) {
    const optionsV2 = new swagger_1.DocumentBuilder()
        .setTitle('Manager API (v2)')
        .setDescription('API for Manager. CURRENTLY VIEWING API VERSION 2')
        .setVersion('2.0')
        .addTag('Authentication')
        .addTag('Manager - Role Management')
        .addTag('Manager - Permission Template')
        .build();
    const documentV2 = swagger_1.SwaggerModule.createDocument(app, optionsV2, {
        include: [managerV2_module_1.ManagerV2Module, auth_module_1.AuthModule],
    });
    swagger_1.SwaggerModule.setup('docs/manager/v2', app, documentV2);
    swagger_1.SwaggerModule.setup('docs/manager', app, documentV2, {
        explorer: true,
        swaggerOptions: {
            urls: [
                { name: 'v2', url: '/docs/manager/v2-json' },
            ],
            persistAuthorization: true,
            filter: true,
        },
    });
}
//# sourceMappingURL=manager.swagger.js.map