import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { PrismaService } from './config/prisma/prisma.service';

class JwtAuthGuard extends AuthGuard('jwt') {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //enable validation pipe globally -> This ensures the DTOs and decorators (@ValidateNested, @IsDateString, etc.) work properly and transform inputs like date strings into Date objects where necessary.
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('ABAS v3 API')
    .setDescription('Enterprise Resource Planning API for ABAS v3 project')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token', // <-- Name of the security scheme
    )
    .addSecurity('security_clearance', {
      type: 'apiKey',
      name: 'Security-Clearance',
      in: 'header',
      description: 'Required security clearance level (documentational only).',
    })
    .addTag('Authentication', 'Manage user auth and login') // change or add more tags based on your modules
    .addTag('Admin - Security & Audit', 'Manage audit trails and security clearance level') // change or add more tags based on your modules
    .addTag('Admin - System Management', 'Administer modules, submodules, and role permissions',)
    .addTag('Admin - Mastertables', 'Manage organization structure such as companies, departments and etc.',) // change or add more tags based on your modules
    .addTag('Manager', 'Manager managing users account, tokens etc.') // change or add more tags based on your modules
    .addTag('Human Resources', 'Managing lifecycle of employees') // change or add more tags based on your modules
    .addTag('Home') // change or add more tags based on your modules
    .addTag('Profile') // change or add more tags based on your modules
    .addTag('Protected') // change or add more tags based on your modules
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger at http://localhost:3000/api

  //export the OpenAPI spec to a file
  writeFileSync(
    './API_documentation/swagger-spec.json',
    JSON.stringify(document, null, 2),
  );

  await app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000')
    console.log('Swagger API is running at http://localhost:3000/api')
  });

  //appliead jwt auth guard and role permission guard globally
  const reflector = app.get(Reflector);
  const prisma = app.get(PrismaService);

  app.useGlobalGuards(
    new JwtAuthGuard(),
    // new RolesPermissionsGuard(reflector, prisma),
  );
}
bootstrap();
