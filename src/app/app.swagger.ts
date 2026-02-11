import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";
import { writeFileSync } from "fs";

import { adminSwagger } from "./admin/admin.swagger";
import { hrSwagger } from "./hris/hris.swagger";
import { managerSwagger } from "./manager/manager.swagger";
import { masterSwagger } from "./masterstable/mastertables.swagger";

function appSwagger(app: INestApplication, prefix = 'api'): void {
    // All APIs docs
    const options = new DocumentBuilder()
    .setTitle('ABAS v3 API')
    .setVersion('1.0')
    .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(`${prefix}/docs`, app, document);

    writeFileSync(
        './API_documentation/swagger-spec.json',
        JSON.stringify(document, null, 2),
    );

    // API specific docs
    adminSwagger(app, prefix);
    hrSwagger(app, prefix);
    managerSwagger(app, prefix);
    masterSwagger(app, prefix);
}

export {appSwagger};