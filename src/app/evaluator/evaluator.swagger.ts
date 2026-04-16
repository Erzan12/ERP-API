import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AuthModule } from "src/auth/auth.module";
import { EvaluatorModule } from "src/modules/hris/performance_management/evaluator/evaluator.module";

export function setupEvaluatorSwagger(app: INestApplication): void {
    // build document for v2
    const optionsV2 = new DocumentBuilder()
        .setTitle('Evaluator API - Performance Management')
        .setDescription(
            'API for Evaluators view side when evaluating employees',
        )
        .setVersion('2.0')
        .addTag('Authentication')
        .addTag('Evaluator - Performance Management')
        .build();

    const documentV2 = SwaggerModule.createDocument(app, optionsV2, {
        include: [EvaluatorModule, AuthModule],
    });

    SwaggerModule.setup('docs/evaluator/v2', app, documentV2)

    SwaggerModule.setup('docs/evaluator', app, documentV2, {
        explorer: true,
        swaggerOptions: {
            urls: [
                { name: 'v2', url: '/docs/evaluator/v2-json'},
            ],
            persistAuthorization: true,
            filter: true,
        },
    });
}