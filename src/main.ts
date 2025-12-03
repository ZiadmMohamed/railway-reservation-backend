import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { createLogger } from 'winston';
import { createWinstonConfig } from './config/logger/logger.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });

  const configService = app.get(ConfigService);
  const loggerInstance = createLogger(createWinstonConfig(configService));
  app.useLogger(WinstonModule.createLogger({ instance: loggerInstance }));

  // Enable dependency injection for custom validators
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Railway API')
    .addBearerAuth()
    .setDescription('Railway API Description')
    .setVersion('1.0')
    .addTag('Railway')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = configService.get<number>('app.port') || 3000;
  await app.listen(port);
}
bootstrap();
