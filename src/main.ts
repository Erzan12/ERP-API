import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import { setupAppSwagger } from './app/app.swagger';
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

  //enable api version in controller and swagger
  app.enableVersioning({
    type: VersioningType.URI,
  });

  //call from helpter global prefix
  setupGlobalPrefix(app);

  // API documentation
  setupAppSwagger(app);

  //serve static files
  app.useStaticAssets(join(process.cwd(), 'public'), {
    prefix: '/public',
  });

  //views directory
  app.setBaseViewsDir(join(process.cwd(), 'views'));
  app.setViewEngine('hbs');


  await app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000')
    console.log('Swagger API is running at http://localhost:3000/docs')
    console.log('Prisma Studio is running at http://localhost:51212')
  });
}
bootstrap();
