import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { AdministratorV2Module } from 'src/modules/administrator/administratorV2.module';

export function setupAdminSwagger(app: INestApplication): void {
  // build document for V1
  // const optionsV1 = new DocumentBuilder()
  //   // .addBearerAuth(
  //   //   { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
  //   //   'access-token',
  //   // )
  //   //since token is now stored in cookies session will not use this anymore
  //   // .addCookieAuth('access-token')
  //   .setTitle('Administrators API (v1)')
  //   .setDescription(
  //     'API for System Management. CURRENTLY VIEWING API VERSION 1',
  //   )
  //   .setVersion('1.0')
  //   .addTag('Authentication')
  //   .addTag('Administrator - Dashboard')
  //   .addTag('Administrator - User Access')
  //   .addTag('Administrator - Audit')
  //   .addTag('Administrator - Module')
  //   .addTag('Administrator - Submodule')
  //   .addTag('Administrator - Role')
  //   .addTag('Administrator - Security Clearance')
  //   .build();

  // const documentV1 = SwaggerModule.createDocument(app, optionsV1, {
  //   include: [AdministratorV1Module, AuthModule],
  // });

  // build document for V2
  const optionsV2 = new DocumentBuilder()
    // .addBearerAuth(
    //   { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
    //   'access-token',
    // )
    .setTitle('Administrators API (v2)')
    .setDescription(
      'API for System Management. CURRENTLY VIEWING API VERSION 2',
    )
    .setVersion('2.0')
    .addTag('Authentication')
    .addTag('Administrator - Dashboard')
    .addTag('Administrator - Database Manuel Query')
    .addTag('Administrator - Audit')
    .addTag('Administrator - Module')
    .addTag('Administrator - Submodule')
    .addTag('Administrator - Role')
    .addTag('Administrator - Security Clearance')
    .build();

  const documentV2 = SwaggerModule.createDocument(app, optionsV2, {
    include: [AdministratorV2Module, AuthModule],
  });

  // mount individual endpoints (This automatically exposes /docs/admin/v1-json and v2-json)
  // SwaggerModule.setup('docs/admin/v1', app, documentV1);
  SwaggerModule.setup('docs/admin/v2', app, documentV2);

  // mount the Unified UI with the Dropdown
  SwaggerModule.setup('docs/admin', app, documentV2, {
    explorer: true, // enables the top bar
    swaggerOptions: {
      urls: [
        { name: 'v2', url: '/docs/admin/v2-json' },
        // { name: 'v1', url: '/docs/admin/v1-json' },
      ],
      persistAuthorization: true,
      filter: true,
    },
  });
}
