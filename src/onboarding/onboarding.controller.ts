import { Controller, Get } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { AllowAnonymous } from 'src/auth/decorators/public.decorator';

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
}
