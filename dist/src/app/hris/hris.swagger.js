"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupHRISSwagger = setupHRISSwagger;
const swagger_1 = require("@nestjs/swagger");
const auth_module_1 = require("../../auth/auth.module");
const hrV2_module_1 = require("../../modules/hris/hrV2.module");
function setupHRISSwagger(app) {
    const optionsV2 = new swagger_1.DocumentBuilder()
        .setTitle('HRIS API (v2)')
        .setDescription('API for HRIS employee lifecycle. CURRENTLY VIEWING API VERSION 2')
        .setVersion('2.0')
        .addTag('Authentication')
        .addTag('Human Resources - Dashboard')
        .addTag('Human Resources - Employees')
        .build();
    const documentV2 = swagger_1.SwaggerModule.createDocument(app, optionsV2, {
        include: [hrV2_module_1.HrV2Module, auth_module_1.AuthModule],
    });
    swagger_1.SwaggerModule.setup('docs/hris/v2', app, documentV2);
    swagger_1.SwaggerModule.setup('docs/hris', app, documentV2, {
        explorer: true,
        swaggerOptions: {
            urls: [
                { name: 'v2', url: '/docs/hris/v2-json' },
            ],
            persistAuthorization: true,
            filter: true,
        },
    });
}
//# sourceMappingURL=hris.swagger.js.map