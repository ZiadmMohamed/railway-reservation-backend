import { Module } from '@nestjs/common';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';
import { LanguagesRepository } from './repositories/languages.repository';
import { OnboardingRepository } from './repositories/onboarding.repository';

@Module({
  controllers: [OnboardingController],
  providers: [
    {
      provide: LanguagesRepository,
      inject: ['DATABASE'],
      useFactory: (db: any) => new LanguagesRepository(db),
    },
    OnboardingService,
    OnboardingRepository,
  ],
  exports: [LanguagesRepository],
})
export class OnboardingModule {}
