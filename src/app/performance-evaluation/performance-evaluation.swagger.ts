import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AuthModule } from "src/auth/auth.module";
import { PerformanceEvaluationModule } from "src/modules/corporate_services/performance_evaluations/performance_evalautions.module";

export function setupEvaluatorSwagger(app: INestApplication): void {
    // build document for v2
    const optionsV2 = new DocumentBuilder()
        .setTitle('Performance Evaluation API - Corporate Service')
        .setDescription(
            'API for Evaluators view side when evaluating employees',
        )
        .setVersion('2.0')
        .addTag('Authentication')
        .addTag('Performance Evaluation - Corporate Service')
        .build();

    const documentV2 = SwaggerModule.createDocument(app, optionsV2, {
        include: [PerformanceEvaluationModule, AuthModule],
    });

    SwaggerModule.setup('docs/performance-evaluations/v2', app, documentV2)

    SwaggerModule.setup('docs/performance-evaluations', app, documentV2, {
        explorer: true,
        swaggerOptions: {
            urls: [
                { name: 'v2', url: '/docs/performance-evaluations/v2-json'},
            ],
            persistAuthorization: true,
            filter: true,
        },
    });
}