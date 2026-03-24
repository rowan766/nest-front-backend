import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';

const DEFAULT_PORT = 3000;
const DEFAULT_APP_HOST = 'localhost';
const DEFAULT_SWAGGER_PATH = 'api-docs';

export interface AppBootstrapConfig {
  appHost: string;
  corsOptions: CorsOptions;
  isProduction: boolean;
  port: number;
  swaggerEnabled: boolean;
  swaggerPath: string;
}

export function getAppBootstrapConfig(
  configService: ConfigService,
): AppBootstrapConfig {
  const isProduction = configService.get<string>('NODE_ENV') === 'production';

  return {
    appHost: configService.get<string>('APP_HOST', DEFAULT_APP_HOST),
    corsOptions: createCorsOptions(configService.get<string>('CORS_ORIGIN', '*')),
    isProduction,
    port: parsePort(configService.get<string>('PORT')),
    swaggerEnabled: parseBoolean(
      configService.get<string>('SWAGGER_ENABLED'),
      true,
    ),
    swaggerPath: configService.get<string>(
      'SWAGGER_PATH',
      DEFAULT_SWAGGER_PATH,
    ),
  };
}

export function createCorsOptions(corsOrigin?: string): CorsOptions {
  return {
    origin: parseCorsOrigin(corsOrigin),
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  };
}

export function parseCorsOrigin(corsOrigin?: string): true | string[] {
  const normalizedOrigin = corsOrigin?.trim();

  if (!normalizedOrigin || normalizedOrigin === '*') {
    return true;
  }

  const origins = normalizedOrigin
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return origins.length > 0 ? origins : true;
}

export function parseBoolean(
  value: boolean | string | undefined,
  fallback = false,
): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value !== 'string') {
    return fallback;
  }

  switch (value.trim().toLowerCase()) {
    case '1':
    case 'true':
    case 'yes':
    case 'on':
      return true;
    case '0':
    case 'false':
    case 'no':
    case 'off':
      return false;
    default:
      return fallback;
  }
}

function parsePort(value?: string): number {
  const parsedPort = Number(value);

  if (Number.isInteger(parsedPort) && parsedPort > 0) {
    return parsedPort;
  }

  return DEFAULT_PORT;
}
