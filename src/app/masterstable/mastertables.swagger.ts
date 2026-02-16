import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";

import { AuthModule } from "src/auth/auth.module";
import { MasterV1Module } from "src/modules/master/masterV1.module";
import { MasterV2Module } from "src/modules/master/masterV2.module";

export function setupMasterSwagger(app: INestApplication): void {

  // build document for V1
  const optionsV1 = new DocumentBuilder()
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' }, 'access-token')
    .setTitle('Masterstable API (v1)')
    .setDescription('API for Manager. CURRENTLY VIEWING API VERSION 1')
    .setVersion('1.0')
    .addTag('Authentication')
    .addTag('Masterstable - Company')
    .addTag('Masterstable - Department')
    .addTag('Masterstable - Division')
    .addTag('Masterstable - Employment Status')
    .addTag('Masterstable - Position')
    .addTag('Masterstable - User Location')
    .build();

  const documentV1 = SwaggerModule.createDocument(app, optionsV1, {
    include: [MasterV1Module, AuthModule]
  });

  // build document for V2
  const optionsV2 = new DocumentBuilder()
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' }, 'access-token')
    .setTitle('Masterstable API (v2)')
    .setDescription('API for Companies organization structure. CURRENTLY VIEWING API VERSION 2')
    .setVersion('2.0')
    .addTag('Authentication')
    .addTag('Masterstable - Company')
    .addTag('Masterstable - Department')
    .addTag('Masterstable - Division')
    .addTag('Masterstable - Employment Status')
    .addTag('Masterstable - Position')
    .addTag('Masterstable - User Location')
    .build();

  const documentV2 = SwaggerModule.createDocument(app, optionsV2, {
    include: [MasterV2Module, AuthModule]
  });

  // mount individual endpoints (This automatically exposes /docs/admin/v1-json and v2-json)
  SwaggerModule.setup('docs/masterstable/v1', app, documentV1);
  SwaggerModule.setup('docs/masterstable/v2', app, documentV2);

  // mount the Unified UI with the Dropdown
  SwaggerModule.setup('docs/masterstable', app, documentV2, {
    explorer: true, // enables the top bar
    swaggerOptions: {
      urls: [
        { name: 'v2', url: '/docs/masterstable/v2-json' },
        { name: 'v1', url: '/docs/masterstable/v1-json' }
      ],
      persistAuthorization: true,
      filter: true,
    }
  });
}