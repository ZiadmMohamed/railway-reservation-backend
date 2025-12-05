import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { createLogger } from 'winston';
import { createWinstonConfig } from './config/logger/logger.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { AUTH_PROVIDER } from './auth/auth.module';
import { toNodeHandler } from 'better-auth/node';

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
    new I18nValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable global exception filter for i18n validation errors
  // This ensures localized validation messages are returned instead of a generic 400 response
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      // detailedErrors: true,
    }),
  );

  // Mount better-auth handler
  const auth = app.get(AUTH_PROVIDER);
  const basePath = configService.get<string>('auth.basePath') || '/api/auth';
  const handler = toNodeHandler(auth);

  // Mount better-auth handler as Express middleware
  app.use(basePath, handler);

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
