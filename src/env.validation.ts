import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, IsOptional, IsEnum, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

enum LogLevel {
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Debug = 'debug',
  Verbose = 'verbose',
}

export class EnvironmentVariables {
  // App Configuration
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  @IsOptional()
  PORT: number = 3000;

  @IsEnum(LogLevel)
  @IsOptional()
  LOG_LEVEL: LogLevel = LogLevel.Info;

  // Database Configuration
  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  // Auth Configuration
  @IsString()
  @IsNotEmpty()
  BETTER_AUTH_SECRET: string;

  @IsString()
  @IsOptional()
  BETTER_AUTH_URL: string = 'http://localhost:3000';

  // Email/SMTP Configuration
  @IsString()
  @IsNotEmpty()
  SMTP_HOST: string;

  @IsNumber()
  @IsNotEmpty()
  SMTP_PORT: number;

  @IsString()
  @IsNotEmpty()
  SMTP_USER: string;

  @IsString()
  @IsNotEmpty()
  SMTP_PASSWORD: string;

  @IsString()
  @IsOptional()
  EMAIL_FROM: string = 'noreply@example.com';

  @IsString()
  @IsOptional()
  EMAIL_FROM_NAME: string = 'Railway Reservation';
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
