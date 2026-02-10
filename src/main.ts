import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import { appSwagger } from './app/app.swagger';
import { setupGlobalPrefix } from './utils/helpers/global-prefix.helper';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //enable validation pipe globally -> This ensures the DTOs and decorators (@ValidateNested, @IsDateString, etc.) work properly and transform inputs like date strings into Date objects where necessary.
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  //call from helpter global prefix
  setupGlobalPrefix(app);

  // API documentation
  appSwagger(app);
  // appSwagger(app, process.env.ALLOW_GLOBAL_PREFIX !== 'no' ? globalPrefix : '');

  // const config = new DocumentBuilder()
  //   Manage organization structure such as companies, departments and etc.',) // change or add more tags based on your modules
  //   .addTag('Manager'.setTitle('ABAS v3 API')
  //   .setDescription('Enterprise Resource Planning API for ABAS v3 project')
  //   .setVersion('1.0')
  //   .addBearerAuth(
  //     {
  //       type: 'http',
  //       scheme: 'bearer',
  //       bearerFormat: 'JWT',
  //       name: 'Authorization',
  //       description: 'Enter JWT token',
  //       in: 'header',
  //     },
  //     'access-token', // <-- Name of the security scheme
  //   )
  //   .addSecurity('security_clearance', {
  //     type: 'apiKey',
  //     name: 'Security-Clearance',
  //     in: 'header',
  //     description: 'Required security clearance level (documentational only).',
  //   })
  //   .addTag('Authentication', 'Manage user auth and login') // change or add more tags based on your modules
  //   .addTag('Admin - Security & Audit', 'Manage audit trails and security clearance level') // change or add more tags based on your modules
  //   .addTag('Admin - System Management', 'Administer modules, submodules, and role permissions',)
  //   .addTag('Admin - Mastertables', ', 'Manager managing users account, tokens etc.') // change or add more tags based on your modules
  //   .addTag('Human Resources', 'Managing lifecycle of employees') // change or add more tags based on your modules
  //   .build();

  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, document, {
  //   customCss: `
  //     .swagger-ui .topbar { display: none }
  //   `,
  //   swaggerOptions: {
  //     docExpansion: 'none', // collapse everything
  //     filter: true,   //add search bar
  //     persistAuthorization: true,  //keeps jwt after refresh or selecting new api endpoint in landing page
  //   }
  // });

  //serve static files
  app.useStaticAssets(join(process.cwd(), 'public'), {
    prefix: '/public',
  });

  //views directory
  app.setBaseViewsDir(join(process.cwd(), 'views'));
  app.setViewEngine('hbs');

  // app.setGlobalPrefix('api/v2')

  await app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000/api')
    console.log('Swagger API is running at http://localhost:3000/api/docs')
    console.log('Prisma Studio is running at http://localhost:51212')
  });
}
bootstrap();
