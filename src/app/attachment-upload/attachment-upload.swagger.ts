import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthModule } from 'src/auth/auth.module';
import { AttachmentUploadModule } from 'src/jobs/attachment-upload/attachment-upload.module';

export function setupAttachmentUploadSwagger(app: INestApplication): void {
  // build document for v2
  const optionsV2 = new DocumentBuilder()
    .setTitle('Attachment Upload API')
    .setDescription('API for Attachment Upload')
    .setVersion('2.0.0')
    .addTag('Authentication')
    .build();

  const documentV2 = SwaggerModule.createDocument(app, optionsV2, {
    include: [AttachmentUploadModule, AuthModule],
  });

  SwaggerModule.setup('docs/attachment-upload/v2', app, documentV2);

  SwaggerModule.setup('docs/attachment-upload', app, documentV2, {
    explorer: true,
    swaggerOptions: {
      urls: [{ name: 'v2', url: '/docs/attachment-upload/v2-json' }],
      persistAuthorization: true,
      filter: true,
    },
  });
}
