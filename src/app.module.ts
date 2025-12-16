import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
// import { TrainsModule } from './trains/trains.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';
import emailConfig from './config/email.config';
import { AcceptLanguageResolver, HeaderResolver, I18nModule } from 'nestjs-i18n';
import { OnboardingModule } from './onboarding/onboarding.module';
import { PassengerModule } from './passenger/passenger.module';
import { StationsModule } from './stations/stations.module';
import { SeatsModule } from './seats/seats.module';
import { TripsModule } from './trips/trips.module';
import { TripStopsModule } from './trip-stops/trip-stops.module';
import { TicketsModule } from './tickets/tickets.module';
import * as path from 'path';
import { TrainsModule } from './trains/trains.module';

@Module({
  imports: [
    // Authmodule.forRoot({
    //   auth: {
    //     options: {
    //       trustedOrigins: [],
    //     },

    //     secret: process.env.JWT_SECRET,
    //     signOptions: { expiresIn: '1d' },
    //     hashStrategy: 'bcrypt',
    //   },
    // }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, authConfig, emailConfig],
      envFilePath: ['.env'],
    }),
    DatabaseModule,
    // i18n configuration
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        AcceptLanguageResolver, // Primary: Accept-Language header
        new HeaderResolver(['x-custom-lang']), // Backup: custom header
      ],
    }),
    AuthModule,
    // TrainsModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    OnboardingModule,
    PassengerModule,
    StationsModule,
    SeatsModule,
    TripsModule,
    TripStopsModule,
    TicketsModule,
    TrainsModule

  ],

  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
