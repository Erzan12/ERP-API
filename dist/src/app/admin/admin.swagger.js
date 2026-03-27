"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAdminSwagger = setupAdminSwagger;
const swagger_1 = require("@nestjs/swagger");
const auth_module_1 = require("../../auth/auth.module");
const administratorV2_module_1 = require("../../modules/administrator/administratorV2.module");
function setupAdminSwagger(app) {
    const optionsV2 = new swagger_1.DocumentBuilder()
        .setTitle('Administrators API (v2)')
        .setDescription('API for System Management. CURRENTLY VIEWING API VERSION 2')
        .setVersion('2.0')
        .addTag('Authentication')
        .addTag('Administrator - Dashboard')
        .addTag('Administrator - Database Manuel Query')
        .addTag('Administrator - Audit')
        .addTag('Administrator - Module')
        .addTag('Administrator - Submodule')
        .addTag('Administrator - Role')
        .addTag('Administrator - Security Clearance')
        .build();
    const documentV2 = swagger_1.SwaggerModule.createDocument(app, optionsV2, {
        include: [administratorV2_module_1.AdministratorV2Module, auth_module_1.AuthModule],
    });
    swagger_1.SwaggerModule.setup('docs/admin/v2', app, documentV2);
    swagger_1.SwaggerModule.setup('docs/admin', app, documentV2, {
        explorer: true,
        swaggerOptions: {
            urls: [
                { name: 'v2', url: '/docs/admin/v2-json' },
            ],
            persistAuthorization: true,
            filter: true,
        },
    });
}
//# sourceMappingURL=admin.swagger.js.map