// src/main.ts
import { Logger, VersioningType } from '@nestjs/common';

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PORT } from 'src/config';
import { AppModule } from './app.module';
import { RsExceptionFilter } from './utils/exceptions/rs-exception.filter';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(
    AppModule,
    // new FastifyAdapter({ logger: false }), // turn on/off for production
  );

  app.enableCors();

  app.useGlobalFilters(new RsExceptionFilter());

  app.setGlobalPrefix('api').enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const config = new DocumentBuilder()
    .setTitle('Rahat System')
    .setDescription('Rahat System')
    .setVersion('0.1')
    .addBearerAuth(
      {
        scheme: 'Bearer',
        bearerFormat: 'Bearer',
        type: 'apiKey',
        name: 'access_token',
        description: 'Enter access token here',
        in: 'header',
      },
      'access_token',
    ) // This name here is important for matching up with @ApiBearerAuth() in your controller!)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  console.log(`Listening on port ${PORT}...`);
  console.log(`Swagger UI: http://localhost:${PORT}/api/docs`);

  logger.log(`Application listening on port ${PORT}`);

  await app.listen(PORT);
}
bootstrap();
