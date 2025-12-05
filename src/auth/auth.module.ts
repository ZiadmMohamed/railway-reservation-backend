import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { DB_PROVIDER } from '../database/db.provider';
import { createAuth } from './auth';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

export const AUTH_PROVIDER = 'BETTER_AUTH';

const authProviderFactory = {
  provide: AUTH_PROVIDER,
  useFactory: (db: any, configService: ConfigService) => {
    try {
      if (!db) {
        console.error('DB_PROVIDER is not available');
        throw new Error('Database instance (DB_PROVIDER) is not available for authProvider');
      }
      if (!configService) {
        console.error('ConfigService is not available');
        throw new Error('ConfigService is not available for authProvider');
      }
      console.log('Creating auth instance...');
      const authInstance = createAuth(db, configService);
      if (!authInstance) {
        throw new Error('createAuth returned undefined');
      }
      console.log('Auth instance created successfully');
      return authInstance;
    } catch (error) {
      console.error('Error creating auth provider:', error);
      throw error;
    }
  },
  inject: [DB_PROVIDER, ConfigService],
};

@Global()
@Module({
  imports: [ConfigModule, DatabaseModule],
  providers: [authProviderFactory, AuthService],
  controllers: [AuthController],
  exports: [AUTH_PROVIDER, AuthService],
})
export class AuthModule { }
