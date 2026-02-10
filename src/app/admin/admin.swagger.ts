import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";

import { AdministratorModule } from "src/modules/administrator/administrator.module";
import { AuthModule } from "src/auth/auth.module";

function adminSwagger(app: INestApplication, prefix = 'api'):void {
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
        .setTitle('Administrators API')
        .setDescription('API for System Management.')
        .setVersion('1.0')
        .addTag('Authentication')
        .addTag('Admin')
        .build();

    const document = SwaggerModule.createDocument(app, options, {
        include: [AdministratorModule, AuthModule]
    });
    SwaggerModule.setup(`${prefix}/docs/admin`, app, document);
}

export {adminSwagger};