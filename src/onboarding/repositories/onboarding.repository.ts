import { Injectable } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { InjectDb } from '../../database/db.provider';
import type { DB } from '../../database/drizzle';
import { onboardingScreens, onboardingTranslations } from '../Schemas/onboarding.schema';

@Injectable()
export class OnboardingRepository {
  constructor(@InjectDb() private readonly db: DB) {}

  async findScreenById(id: number) {
    const [screen] = await this.db
      .select()
      .from(onboardingScreens)
      .where(eq(onboardingScreens.id, id))
      .limit(1);

    return screen ?? null;
  }

  async findAllScreens() {
    return this.db.select().from(onboardingScreens);
  }

  async findAllActiveScreens() {
    return this.db
      .select()
      .from(onboardingScreens)
      .where(eq(onboardingScreens.isActive, true))
      .orderBy(onboardingScreens.orderIndex);
  }

  async findTranslationsByScreenId(screenId: number) {
    return this.db
      .select()
      .from(onboardingTranslations)
      .where(eq(onboardingTranslations.screenId, screenId));
  }

  async findScreenTranslation(screenId: number, language: string) {
    const [translation] = await this.db
      .select()
      .from(onboardingTranslations)
      .where(
        and(
          eq(onboardingTranslations.screenId, screenId),
          eq(onboardingTranslations.languageId, language),
        ),
      )
      .limit(1);

    return translation ?? null;
  }

  async findActiveScreensWithTranslation(language: string) {
    return this.db
      .select()
      .from(onboardingScreens)
      .innerJoin(
        onboardingTranslations,
        eq(onboardingTranslations.screenId, onboardingScreens.id),
      )
      .where(
        and(
          eq(onboardingScreens.isActive, true),
          eq(onboardingTranslations.languageId, language),
        ),
      )
      .orderBy(onboardingScreens.orderIndex);
  }
}
