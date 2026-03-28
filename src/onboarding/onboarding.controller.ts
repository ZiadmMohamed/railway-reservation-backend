import { Controller, Get, Query } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  /**
   * Get all active supported languages
   * @returns Array of active languages with their codes, names, and native names
   */
  @AllowAnonymous()
  @Get('languages')
  async getSupportedLanguages() {
    return this.onboardingService.getSupportedLanguages();
  }

  @AllowAnonymous()
  @Get('screens')
  async getScreens(@Query('lang') lang: string = 'en') {
    return this.onboardingService.getScreens(lang);
  }
}
