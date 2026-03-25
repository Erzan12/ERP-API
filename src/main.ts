import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

import { setupAppSwagger } from './app/app.swagger';
import { setupGlobalPrefix } from './utils/helpers/global-prefix.helper';
// import cookieParser = require('cookie-parser');
import cookieParser from 'cookie-parser';

import { PrismaExceptionFilter } from './utils/filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // handle cookies
  app.use(cookieParser());

  //catch erros e.g database exception errors mising migration, or columns or tables
  app.useGlobalFilters(new PrismaExceptionFilter());

  //log manual queries
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });

  app.enableCors({
    // origin: ['https://www.example.com'], // specify allowed domains
    origin: ['http://localhost:3002', 'http://localhost:3003'],
    methods: 'GET,POST,PUT,PATCH,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true, // allow cookies/auth headers
  });

  //log manual queries
  new PrismaClient({ adapter, log: ['query'] });

  //enable validation pipe globally -> This ensures the DTOs and decorators (@ValidateNested, @IsDateString, etc.) work properly and transform inputs like date strings into Date objects where necessary.
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // app.useGlobalFilters(new AllExceptionsFilter());

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
    console.log('Server is running at http://localhost:3000');
    console.log('Swagger API is running at http://localhost:3000/docs');
    console.log('Prisma Studio is running at http://localhost:51212');
  });
}
bootstrap();
