import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { writeFileSync } from 'fs';

import { setupAdminSwagger } from './admin/admin.swagger';
import { setupHRISSwagger } from './hris/hris.swagger';
import { setupManagerSwagger } from './manager/manager.swagger';
import { setupMasterSwagger } from './mastertable/mastertable.swagger';
import { AdministratorV2Module } from 'src/modules/administrator/administratorV2.module';
import { HrV2Module } from 'src/modules/hris/hrV2.module';
import { ManagerV2Module } from 'src/modules/manager/managerV2.module';
import { MasterV2Module } from 'src/modules/master/masterV2.module';
import { setupUserSwagger } from './user-management/user-management.swagger';

function setupAppSwagger(app: INestApplication): void {
  // All APIs docs
  // const optionsV1 = new DocumentBuilder()
  //   .setTitle('ABAS v3 API v1')
  //   .setVersion('1.0')
  //   // .addCookieAuth('access-token')
  //   .build();

  // const documentV1 = SwaggerModule.createDocument(app, optionsV1, {
  //   include: [
  //     AdministratorV1Module,
  //     HrV1Module,
  //     ManagerV1Module,
  //     MasterV1Module,
  //   ],
  // });

  const optionsV2 = new DocumentBuilder()
    .setTitle('ABAS v3 API v2')
    .setVersion('1.0')
    .addCookieAuth('accessToken')
    .build();

  const documentV2 = SwaggerModule.createDocument(app, optionsV2, {
    include: [
      AdministratorV2Module,
      HrV2Module,
      ManagerV2Module,
      MasterV2Module,
    ],
  });

  // SwaggerModule.setup('docs/v1', app, documentV1);
  SwaggerModule.setup('docs/v2', app, documentV2);

  SwaggerModule.setup('docs', app, documentV2, {
    explorer: true, // enables the top bar
    swaggerOptions: {
      urls: [
        { name: 'v2', url: '/docs/v2-json' },
        { name: 'v1', url: '/docs/v1-json' },
      ],
      persistAuthorization: true,
      filter: true,
    },
  });

  // writeFileSync(
  //   './API_documentation/swagger-spec-v1.json',
  //   JSON.stringify(documentV1, null, 2),
  // );
  writeFileSync(
    './API_documentation/swagger-spec-v2.json',
    JSON.stringify(documentV2, null, 2),
  );

  // API specific docs
  setupAdminSwagger(app);
  setupHRISSwagger(app);
  setupManagerSwagger(app);
  setupMasterSwagger(app);
  setupUserSwagger(app);
}

export { setupAppSwagger };
