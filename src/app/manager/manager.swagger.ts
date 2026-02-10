import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";

import { ManagerModule } from "src/modules/manager/manager.module";
import { AuthModule } from "src/auth/auth.module";

function managerSwagger(app: INestApplication, prefix = 'api'): void {
    const options = new DocumentBuilder()
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'Authorization',
                description: 'Enter JWT token',
                in: 'header',
            },
            'access-token', // <-- Name of the security scheme
        )
        .setTitle('Managers API')
        .setDescription('API for Managers')
        .setVersion('1.0')
        .addTag('Authentication')
        .addTag('Manager')
        .build();

    const document = SwaggerModule.createDocument(app, options, {
        include: [ManagerModule, AuthModule] 
    });
    SwaggerModule.setup(`${prefix}/docs/manager`, app, document);
}

export {managerSwagger};