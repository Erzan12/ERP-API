"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupMasterSwagger = setupMasterSwagger;
const swagger_1 = require("@nestjs/swagger");
const auth_module_1 = require("../../auth/auth.module");
const masterV2_module_1 = require("../../modules/master/masterV2.module");
function setupMasterSwagger(app) {
    const optionsV2 = new swagger_1.DocumentBuilder()
        .setTitle('Mastertable API (v2)')
        .setDescription('API for Companies organization structure. CURRENTLY VIEWING API VERSION 2')
        .setVersion('2.0')
        .addTag('Authentication')
        .addTag('Mastertable - Company')
        .addTag('Mastertable - Department')
        .addTag('Mastertable - Division')
        .addTag('Mastertable - Employment Status')
        .addTag('Mastertable - Position')
        .addTag('Mastertable - User Location')
        .build();
    const documentV2 = swagger_1.SwaggerModule.createDocument(app, optionsV2, {
        include: [masterV2_module_1.MasterV2Module, auth_module_1.AuthModule],
    });
    swagger_1.SwaggerModule.setup('docs/mastertable/v2', app, documentV2);
    swagger_1.SwaggerModule.setup('docs/mastertable', app, documentV2, {
        explorer: true,
        swaggerOptions: {
            urls: [
                { name: 'v2', url: '/docs/mastertable/v2-json' },
            ],
            persistAuthorization: true,
            filter: true,
        },
    });
}
//# sourceMappingURL=mastertable.swagger.js.map