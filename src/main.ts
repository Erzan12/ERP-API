import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { PrismaPg } from '@prisma/adapter-pg';

import { setupAppSwagger } from './app/app.swagger';
import { setupGlobalPrefix } from './utils/helpers/global-prefix.helper';
// import cookieParser = require('cookie-parser');
import cookieParser from 'cookie-parser';

import { PrismaExceptionFilter } from './utils/filters/prisma-exception.filter';
import { PrismaClient } from '@prisma/client';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 1. GLOBAL MIDDLEWARES & FILTERS
  app.use(cookieParser());
  app.useGlobalFilters(new PrismaExceptionFilter());

  //log manual queries
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });

  new PrismaClient({ adapter, log: ['query'] });

  // 2. SECURITY & VALIDATION
  app.enableCors({
    origin: ['http://localhost:3002', 'http://localhost:3003'], // Add your Render frontend URL here later!
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // 3. VERSIONING & PREFIXES
  app.enableVersioning({ type: VersioningType.URI });
  setupGlobalPrefix(app);

  // 4. DOCUMENTATION & ASSETS
  setupAppSwagger(app);
  app.useStaticAssets(join(process.cwd(), 'public'), { prefix: '/public' });
  app.setBaseViewsDir(join(process.cwd(), 'views'));
  app.setViewEngine('hbs');

  // await app.listen(3000, () => {
  //   console.log('Server is running at http://localhost:3000');
  //   console.log('Swagger API is running at http://localhost:3000/docs');
  //   console.log('Prisma Studio is running at http://localhost:51212');
  // });

  // 5. FINALLY, START THE SERVER
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
