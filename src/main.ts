import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import { setupAppSwagger } from './app/app.swagger';
import { setupGlobalPrefix } from './utils/helpers/global-prefix.helper';
import cookieParser from 'cookie-parser';

import { PrismaExceptionFilter } from './utils/filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 1. GLOBAL MIDDLEWARES & FILTERS
  app.use(cookieParser());
  app.useGlobalFilters(new PrismaExceptionFilter());

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

  function logMemoryUsage() {
    const before = process.memoryUsage();

    console.log('[MEMORY BEFORE GC]', {
      rss: `${Math.round(before.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(before.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(before.heapUsed / 1024 / 1024)} MB`,
      external: `${Math.round(before.external / 1024 / 1024)} MB`,
    });

    if (global.gc) {
      global.gc();
    }

    const after = process.memoryUsage();

    console.log('[MEMORY AFTER GC]', {
      rss: `${Math.round(after.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(after.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(after.heapUsed / 1024 / 1024)} MB`,
      external: `${Math.round(after.external / 1024 / 1024)} MB`,
    });
  }

  setInterval(logMemoryUsage, 10_000);

  // 5. FINALLY, START THE SERVER
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
