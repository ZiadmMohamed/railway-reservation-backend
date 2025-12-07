import { Injectable } from '@nestjs/common';
import { LanguagesRepository } from './repositories/languages.repository';
import { OnboardingRepository } from './repositories/onboarding.repository';


@Injectable()
export class OnboardingService {
  constructor(private readonly languagesRepository: LanguagesRepository, private readonly onboardingRepository: OnboardingRepository) {}

  /**
   * Get all active supported languages
   * @returns Array of active languages
   */
  async getSupportedLanguages() {
    return this.languagesRepository.findAllActive();
  }

  async getScreens(lang: string) {
    return this.onboardingRepository.findActiveScreensWithTranslation(lang);
  }
}

