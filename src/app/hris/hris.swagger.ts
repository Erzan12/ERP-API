import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { HrV2Module } from 'src/modules/hris/hrV2.module';

export function setupHRISSwagger(app: INestApplication): void {
  // build document for V1
  // const optionsV1 = new DocumentBuilder()
  //   // .addBearerAuth(
  //   //   { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
  //   //   'access-token',
  //   // )
  //   //  .addCookieAuth('access-token')
  //   .setTitle('HRIS API (v1)')
  //   .setDescription(
  //     'API for HRIS employee lifecycle. CURRENTLY VIEWING API VERSION 1',
  //   )
  //   .setVersion('1.0')
  //   .addTag('Authentication')
  //   .addTag('Human Resources - Dashboard')
  //   .addTag('Human Resources - Employees Masterlist')
  //   .build();

  // const documentV1 = SwaggerModule.createDocument(app, optionsV1, {
  //   include: [HrV1Module, AuthModule],
  // });

  // build document for V2
  const optionsV2 = new DocumentBuilder()
    // .addBearerAuth(
    //   { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
    //   'access-token',
    // )
    //since token is now stored in cookies session will not use this anymore
    // .addCookieAuth('access-token')
    .setTitle('HRIS API (v2)')
    .setDescription(
      'API for HRIS employee lifecycle. CURRENTLY VIEWING API VERSION 2',
    )
    .setVersion('2.0')
    .addTag('Authentication')
    .addTag('Human Resources - Dashboard')
    .addTag('Human Resources - Employees')
    .build();

  const documentV2 = SwaggerModule.createDocument(app, optionsV2, {
    include: [HrV2Module, AuthModule],
  });

  // mount individual endpoints (This automatically exposes /docs/admin/v1-json and v2-json)
  // SwaggerModule.setup('docs/hris/v1', app, documentV1);
  SwaggerModule.setup('docs/hris/v2', app, documentV2);

  // mount the Unified UI with the Dropdown
  SwaggerModule.setup('docs/hris', app, documentV2, {
    explorer: true, // enables the top bar
    swaggerOptions: {
      urls: [
        { name: 'v2', url: '/docs/hris/v2-json' },
        // { name: 'v1', url: '/docs/hris/v1-json' },
      ],
      persistAuthorization: true,
      filter: true,
    },
  });
}
