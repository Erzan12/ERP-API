import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AuthModule } from "src/auth/auth.module";
import { EmployeeDashboardModule } from "src/modules/employee-dashboard/employee-dashboard.module";

export function setupPerformanceEvaluationSwagger(app: INestApplication): void {
    // build document for v2
    const optionsV2 = new DocumentBuilder()
        .setTitle('Employee Dashboard API')
        .setDescription(
            'API for Employee Dashboard',
        )
        .setVersion('2.0')
        .addTag('Authentication')
        .build();

    const documentV2 = SwaggerModule.createDocument(app, optionsV2, {
        include: [EmployeeDashboardModule, AuthModule],
    });

    SwaggerModule.setup('docs/employee-dashboard/v2', app, documentV2)

    SwaggerModule.setup('docs/employee-dashboard', app, documentV2, {
        explorer: true,
        swaggerOptions: {
            urls: [
                { name: 'v2', url: '/docs/employee-dashboard/v2-json'},
            ],
            persistAuthorization: true,
            filter: true,
        },
    });
}