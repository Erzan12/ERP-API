"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAppSwagger = setupAppSwagger;
const swagger_1 = require("@nestjs/swagger");
const fs_1 = require("fs");
const admin_swagger_1 = require("./admin/admin.swagger");
const hris_swagger_1 = require("./hris/hris.swagger");
const manager_swagger_1 = require("./manager/manager.swagger");
const mastertable_swagger_1 = require("./mastertable/mastertable.swagger");
const administratorV2_module_1 = require("../modules/administrator/administratorV2.module");
const hrV2_module_1 = require("../modules/hris/hrV2.module");
const managerV2_module_1 = require("../modules/manager/managerV2.module");
const masterV2_module_1 = require("../modules/master/masterV2.module");
const user_management_swagger_1 = require("./user-management/user-management.swagger");
function setupAppSwagger(app) {
    const optionsV2 = new swagger_1.DocumentBuilder()
        .setTitle('ABAS v3 API v2')
        .setVersion('1.0')
        .addCookieAuth('accessToken')
        .build();
    const documentV2 = swagger_1.SwaggerModule.createDocument(app, optionsV2, {
        include: [
            administratorV2_module_1.AdministratorV2Module,
            hrV2_module_1.HrV2Module,
            managerV2_module_1.ManagerV2Module,
            masterV2_module_1.MasterV2Module,
        ],
    });
    swagger_1.SwaggerModule.setup('docs/v2', app, documentV2);
    swagger_1.SwaggerModule.setup('docs', app, documentV2, {
        explorer: true,
        swaggerOptions: {
            urls: [
                { name: 'v2', url: '/docs/v2-json' },
                { name: 'v1', url: '/docs/v1-json' },
            ],
            persistAuthorization: true,
            filter: true,
        },
    });
    (0, fs_1.writeFileSync)('./API_documentation/swagger-spec-v2.json', JSON.stringify(documentV2, null, 2));
    (0, admin_swagger_1.setupAdminSwagger)(app);
    (0, hris_swagger_1.setupHRISSwagger)(app);
    (0, manager_swagger_1.setupManagerSwagger)(app);
    (0, mastertable_swagger_1.setupMasterSwagger)(app);
    (0, user_management_swagger_1.setupUserSwagger)(app);
}
//# sourceMappingURL=app.swagger.js.map