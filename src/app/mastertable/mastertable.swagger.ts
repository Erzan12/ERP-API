import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { MasterV2Module } from 'src/modules/master/masterV2.module';

export function setupMasterSwagger(app: INestApplication): void {
  // build document for V1
  // const optionsV1 = new DocumentBuilder()
  //   // .addBearerAuth(
  //   //   { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
  //   //   'access-token',
  //   // )
  //   //since token is now stored in cookies session will not use this anymore
  //   // .addCookieAuth('access-token')
  //   .setTitle('Mastertable API (v1)')
  //   .setDescription('API for Manager. CURRENTLY VIEWING API VERSION 1')
  //   .setVersion('1.0')
  //   .addTag('Authentication')
  //   .addTag('Mastertable - Company')
  //   .addTag('Mastertable - Department')
  //   .addTag('Mastertable - Division')
  //   .addTag('Mastertable - Employment Status')
  //   .addTag('Mastertable - Position')
  //   .addTag('Mastertable - User Location')
  //   .build();

  // const documentV1 = SwaggerModule.createDocument(app, optionsV1, {
  //   include: [MasterV1Module, AuthModule],
  // });

  // build document for V2
  const optionsV2 = new DocumentBuilder()
    // .addBearerAuth(
    //   { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
    //   'access-token',
    // )
    .setTitle('Mastertable API (v2)')
    .setDescription(
      'API for Companies organization structure. CURRENTLY VIEWING API VERSION 2',
    )
    .setVersion('2.0')
    .addTag('Authentication')
    .addTag('Mastertable - Company')
    .addTag('Mastertable - Department')
    .addTag('Mastertable - Division')
    .addTag('Mastertable - Employment Status')
    .addTag('Mastertable - Position')
    .addTag('Mastertable - User Location')
    .build();

  const documentV2 = SwaggerModule.createDocument(app, optionsV2, {
    include: [MasterV2Module, AuthModule],
  });

  // mount individual endpoints (This automatically exposes /docs/admin/v1-json and v2-json)
  // SwaggerModule.setup('docs/mastertable/v1', app, documentV1);
  SwaggerModule.setup('docs/mastertable/v2', app, documentV2);

  // mount the Unified UI with the Dropdown
  SwaggerModule.setup('docs/mastertable', app, documentV2, {
    explorer: true, // enables the top bar
    swaggerOptions: {
      urls: [
        { name: 'v2', url: '/docs/mastertable/v2-json' },
        // { name: 'v1', url: '/docs/mastertable/v1-json' },
      ],
      persistAuthorization: true,
      filter: true,
    },
  });
}
