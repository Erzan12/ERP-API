import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";

import { MasterModule } from "src/modules/master/master.module";
import { AuthModule } from "src/auth/auth.module";

function masterSwagger(app: INestApplication, prefix = 'api'):void {
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
        .setTitle('Mastertables API')
        .setDescription('API for managing organization structure')
        .setVersion('1.0')
        .addTag('Authentication')
        .addTag('Masterstable')
        .build();

    const document = SwaggerModule.createDocument(app, options, {
        include: [MasterModule, AuthModule]
    });
    SwaggerModule.setup(`${prefix}/docs/masterstable`, app, document);
}

export {masterSwagger};