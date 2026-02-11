import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";

import { HrModule } from "src/modules/hris/hr.module";
import { AuthModule } from "src/auth/auth.module";

function hrSwagger(app: INestApplication, prefix = 'api'):void {
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
        .setTitle('HRIS API')
        .setDescription('API for employee life cycle')
        .setVersion('1.0')
        .addTag('Authentication')
        .addTag('Human Resources - Dashboard')
        .addTag('Human Resources - Employees')
        .build();

    const document = SwaggerModule.createDocument(app, options, {
        include: [HrModule, AuthModule]
    });
    SwaggerModule.setup(`${prefix}/docs/hris`, app, document, {
        swaggerOptions: {
            persistAuthorization: true, //keeps jwt after refresh or selecting new api endpoint in landing page
            filter: true,   //add search bar
        }
    });
}

export {hrSwagger};