import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { OnboardingModule } from './onboarding.module';
import { LanguagesRepository } from './repositories/languages.repository';

describe('OnboardingController (e2e)', () => {
  let app: INestApplication;
  const mockLanguagesRepo = {
    findAllActive: jest
      .fn()
      .mockResolvedValue([
        { id: '1', code: 'en', name: 'English', nativeName: 'English', isActive: true },
      ]),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [OnboardingModule],
    })
      .overrideProvider(LanguagesRepository)
      .useValue(mockLanguagesRepo)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/onboarding/languages (GET) should return active languages', async () => {
    const response = await request(app.getHttpServer()).get('/onboarding/languages');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: '1', code: 'en', name: 'English', nativeName: 'English', isActive: true },
    ]);
  });
});
