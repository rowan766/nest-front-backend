import { ConfigService } from '@nestjs/config';
import {
  createCorsOptions,
  getAppBootstrapConfig,
  parseBoolean,
  parseCorsOrigin,
} from './app-bootstrap.util';

describe('app-bootstrap.util', () => {
  it('should allow all origins when cors origin is wildcard', () => {
    expect(parseCorsOrigin('*')).toBe(true);
    expect(parseCorsOrigin()).toBe(true);
  });

  it('should split cors origins into an array', () => {
    expect(
      parseCorsOrigin('https://admin.example.com, https://ops.example.com'),
    ).toEqual(['https://admin.example.com', 'https://ops.example.com']);
  });

  it('should parse boolean-like values', () => {
    expect(parseBoolean('true')).toBe(true);
    expect(parseBoolean('off', true)).toBe(false);
    expect(parseBoolean(undefined, true)).toBe(true);
  });

  it('should build bootstrap config from environment values', () => {
    const configService = new ConfigService({
      APP_HOST: '127.0.0.1',
      CORS_ORIGIN: 'https://admin.example.com, https://ops.example.com',
      NODE_ENV: 'production',
      PORT: '3001',
      SWAGGER_ENABLED: 'false',
      SWAGGER_PATH: 'docs',
    });

    expect(getAppBootstrapConfig(configService)).toEqual({
      appHost: '127.0.0.1',
      corsOptions: createCorsOptions(
        'https://admin.example.com, https://ops.example.com',
      ),
      isProduction: true,
      port: 3001,
      swaggerEnabled: false,
      swaggerPath: 'docs',
    });
  });
});
