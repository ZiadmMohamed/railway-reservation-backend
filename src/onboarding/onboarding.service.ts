import { Injectable } from '@nestjs/common';
import { LanguagesRepository } from './repositories/languages.repository';

@Injectable()
export class OnboardingService {
  constructor(private readonly languagesRepository: LanguagesRepository) {}

  /**
   * Get all active supported languages
   * @returns Array of active languages
   */
  async getSupportedLanguages() {
    return this.languagesRepository.findAllActive();
  }
}
