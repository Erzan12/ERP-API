import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";
import { writeFileSync } from "fs";

import { setupAdminSwagger } from "./admin/admin.swagger";
import { setupHRISSwagger } from "./hris/hris.swagger";
import { setupManagerSwagger } from "./manager/manager.swagger";
import { setupMasterSwagger } from "./masterstable/mastertables.swagger";

function setupAppSwagger(app: INestApplication): void {
    // All APIs docs
    const options = new DocumentBuilder()
    .setTitle('ABAS v3 API')
    .setVersion('1.0')
    .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(`docs`, app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        }
    });

    writeFileSync(
        './API_documentation/swagger-spec.json',
        JSON.stringify(document, null, 2),
    );

    // API specific docs
    setupAdminSwagger(app);
    setupHRISSwagger(app);
    setupManagerSwagger(app);
    setupMasterSwagger(app);
}

export {setupAppSwagger}