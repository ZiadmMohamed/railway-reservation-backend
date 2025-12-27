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
import * as express from 'express';
import * as bodyParser from 'body-parser';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
 rawBody: true,
    bodyParser: false,

  });
  app.use(
    bodyParser.json({
      verify: (req: any, res, buf) => {
        if (req.url.includes('/webhook')) {
          req.rawBody = buf;
        }
      },
    }),
  );
  app.use("v1/api/card/webhook", express.raw({type:"application/json"}))

    app.setGlobalPrefix('v1/api', { exclude: ['health'] });

  const configService = app.get(ConfigService);
  const loggerInstance = createLogger(createWinstonConfig(configService));
  app.useLogger(WinstonModule.createLogger({ instance: loggerInstance }));

  // Enable dependency injection for custom validators
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
<<<<<<< HEAD
=======
  app.use('/booking/webhook', express.raw({ type: 'application/json' }));
>>>>>>> 10af9fd24c517436009c241464dcab69621b074c

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
  await app
    .listen(port)
    .then(() => {
      loggerInstance.info(`Server is running on port ${port}`);
    })
    .catch(error => {
      loggerInstance.error(`Error starting server: ${error}`);
      process.exit(1);
    });
}
bootstrap();
