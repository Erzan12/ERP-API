import { NestFactory, Reflector} from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';

class JwtAuthGuard extends AuthGuard('jwt') {}

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);

  //enable validation pipe globally -> This ensures the DTOs and decorators (@ValidateNested, @IsDateString, etc.) work properly and transform inputs like date strings into Date objects where necessary.
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('ABAS v3 API')
    .setDescription('API documentation for ABAS v3 project')
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
    .addTag('Auth', 'Endpoint for user authorization.') // change or add more tags based on your modules
    .addTag('User', 'Enpoint for managing users.') // change or add more tags based on your modules
    .addTag('Hr', 'Endpoint for managing employees.') // change or add more tags based on your modules
    .addTag('Mastertables', 'Endpoint for managing positions, departments and etc.') // change or add more tags based on your modules
    .addTag('Administrator', 'Endppoint for managing the system') // change or add more tags based on your modules
    .addTag('Module', 'Endpoint for core modules') // change or add more tags based on your modules
    .addTag('SubModule', 'Endpoint for core modules') // change or add more tags based on your modules
    .addTag('Role', 'Endpoint for core modules') // change or add more tags based on your modules
    .addTag('EmploymentStatus', 'Endpoint for employement status crud') // change or add more tags based on your modules
    .addTag('Employee', 'Endpoint for employee crud') // change or add more tags based on your modules
    .addTag('Person', 'Endpoint for person crud') // change or add more tags based on your modules
    .addTag('Home',) // change or add more tags based on your modules
    .addTag('Profile',) // change or add more tags based on your modules
    .addTag('Protected',) // change or add more tags based on your modules
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/documentation', app, document); // Swagger at http://localhost:3000/api/documentation

  //export the OpenAPI spec to a file
  writeFileSync('./API_documentation/swagger-spec.json', JSON.stringify(document, null, 2));

  await app.listen(3000);

  //appliead jwt auth guard and role permission guard globally
  const reflector = app.get(Reflector);
  const prisma = app.get(PrismaService);

  app.useGlobalGuards(
    new JwtAuthGuard(),
    // new RolesPermissionsGuard(reflector, prisma),
  );
}
bootstrap();
