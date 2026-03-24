import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import type { OpenAPIObject } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {
  getAppBootstrapConfig,
  HttpExceptionFilter,
  TransformInterceptor,
} from './common';

const logger = new Logger('Bootstrap');

interface ApiTagDefinition {
  name: string;
  description: string;
}

interface ApiTagGroupDefinition {
  name: string;
  tags: string[];
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    forceConsole: true,
  });
  const configService = app.get(ConfigService);
  const bootstrapConfig = getAppBootstrapConfig(configService);

  app.enableShutdownHooks();

  app.enableCors(bootstrapConfig.corsOptions);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: bootstrapConfig.isProduction,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  if (bootstrapConfig.swaggerEnabled) {
    await setupSwagger(app, bootstrapConfig.swaggerPath);
  }

  await app.listen(bootstrapConfig.port);

  const displayBaseUrl = buildDisplayBaseUrl(
    bootstrapConfig.appHost,
    bootstrapConfig.port,
  );

  logStartupBanner(
    displayBaseUrl,
    bootstrapConfig.swaggerEnabled,
    bootstrapConfig.swaggerPath,
  );
}

function buildUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

function buildDisplayBaseUrl(host: string, port: number): string {
  return `http://${normalizeDisplayHost(host)}:${port}`;
}

function normalizeDisplayHost(host: string): string {
  const normalizedHost = host.trim().replace(/^\[|\]$/g, '');

  if (
    normalizedHost === 'localhost' ||
    normalizedHost === '127.0.0.1' ||
    normalizedHost === '0.0.0.0' ||
    normalizedHost === '::1' ||
    normalizedHost === '::'
  ) {
    return 'localhost';
  }

  return normalizedHost;
}

function logStartupBanner(
  baseUrl: string,
  swaggerEnabled: boolean,
  swaggerPath: string,
) {
  const border = '='.repeat(72);

  logger.log(border);
  logger.log('  Admin Backend Started');
  logger.log(`  Local:   ${baseUrl}`);

  if (swaggerEnabled) {
    logger.log(`  Swagger: ${buildUrl(baseUrl, swaggerPath)}`);
  }

  logger.log(border);
}

async function setupSwagger(
  app: NestExpressApplication,
  swaggerPath: string,
) {
  const config = new DocumentBuilder()
    .setTitle('后台管理系统接口文档')
    .setDescription('基于 NestJS、Prisma、PostgreSQL、Redis 和 MinIO 的后台管理系统 API 文档')
    .setVersion('1.0')
    .setContact('Admin Backend Team', '', '')
    .setTermsOfService('Internal Admin Backend Service')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
        description: 'JWT Bearer Token，格式：Bearer <token>',
      },
      'Authorization',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    autoTagControllers: false,
  });
  document.servers = [
    {
      url: '/api',
      description: 'Nginx reverse proxy base path',
    },
  ];
  applyDocumentMetadata(document);

  app.getHttpAdapter()
    .getInstance()
    .get('/api-docs-json', (_req: unknown, res: { json: (body: unknown) => void }) => {
      res.json(document);
    });

  const createScalarHtmlDocument = await loadScalarHtmlDocument();
  const scalarConfig = {
    url: '/api-docs-json',
    pageTitle: '后台管理系统接口文档',
    title: '后台管理系统接口文档',
    theme: 'bluePlanet',
    layout: 'modern',
    showSidebar: true,
    defaultOpenAllTags: false,
    defaultOpenFirstTag: true,
    operationTitleSource: 'summary',
    tagsSorter: (a: { name: string }, b: { name: string }) => {
      const orderedTags = [
        '认证',
        '用户管理',
        '部门管理',
        '角色管理',
        '菜单管理',
        '数据字典-类型管理',
        '数据字典-数据管理',
        '文件上传',
        '开发调试',
      ];
      const aIndex = orderedTags.indexOf(a.name);
      const bIndex = orderedTags.indexOf(b.name);
      const safeAIndex = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex;
      const safeBIndex = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex;

      return safeAIndex - safeBIndex;
    },
    operationsSorter: 'alpha',
    hideModels: false,
    expandAllModelSections: false,
    expandAllResponses: true,
    documentDownloadType: 'both',
    showDeveloperTools: 'localhost',
    defaultHttpClient: {
      targetKey: 'js',
      clientKey: 'fetch',
    },
    generateOperationSlug: (operation: {
      path: string;
      method: string;
    }) =>
      `operation-${String(operation.method || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')}-${String(operation.path || '')
        .toLowerCase()
        .replace(/[{}]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')}`,
    persistAuth: true,
    customCss: [
      '.light-mode, .dark-mode {',
      '  --scalar-font: "Inter", "PingFang SC", "Microsoft YaHei", sans-serif;',
      '}',
      '.light-mode {',
      '  --scalar-color-accent: #2563eb;',
      '  --scalar-background-1: #ffffff;',
      '  --scalar-background-2: #f8fafc;',
      '  --scalar-background-3: #eef2ff;',
      '  --scalar-border-color: rgba(15, 23, 42, 0.08);',
      '  --scalar-sidebar-background-1: #f8fafc;',
      '  --scalar-sidebar-color-1: #0f172a;',
      '  --scalar-sidebar-color-2: #475569;',
      '  --scalar-sidebar-color-active: #0f172a;',
      '  --scalar-sidebar-item-hover-background: rgba(37, 99, 235, 0.08);',
      '  --scalar-sidebar-item-active-background: rgba(37, 99, 235, 0.12);',
      '  --scalar-sidebar-search-background: #ffffff;',
      '  --scalar-sidebar-search-border-color: rgba(15, 23, 42, 0.08);',
      '  --scalar-sidebar-search-color: #334155;',
      '  --scalar-button-1: #2563eb;',
      '  --scalar-button-1-hover: #1d4ed8;',
      '  --scalar-button-1-color: #ffffff;',
      '}',
      '.light-mode .t-doc__sidebar { min-width: 300px; border-right: 1px solid rgba(15, 23, 42, 0.06); }',
      '.light-mode .t-doc__sidebar [data-sidebar] { padding-top: 20px; padding-bottom: 24px; }',
      '.light-mode .t-doc__sidebar .group-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; }',
      '.light-mode .t-doc__sidebar .tag-section__label { font-weight: 600; }',
      '.light-mode .t-doc__sidebar .tag-section { margin-bottom: 8px; }',
      '.light-mode .t-doc__sidebar .scalar-card { background: transparent; box-shadow: none; }',
      '.light-mode .t-doc__content { max-width: none; }',
      '.light-mode .introduction-section { padding-bottom: 12px; }',
      '.light-mode .section-container { border-radius: 14px; }',
      '.light-mode .section-container, .light-mode .card, .light-mode .scalar-card { box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04); }',
      '.light-mode .request-card, .light-mode .response-card { border-radius: 14px; }',
      '.light-mode .property-name { font-family: "JetBrains Mono", "Cascadia Code", monospace; }',
    ].join('\n'),
  };

  const scalarHtml = createScalarHtmlDocument(scalarConfig);

  app.getHttpAdapter().getInstance().get(
    `/${swaggerPath}`,
    (_req: unknown, res: { type: (value: string) => { send: (body: string) => void } }) => {
      res.type('text/html').send(scalarHtml);
    },
  );

  app.getHttpAdapter().getInstance().get(
    `/${swaggerPath}/`,
    (_req: unknown, res: { type: (value: string) => { send: (body: string) => void } }) => {
      res.type('text/html').send(scalarHtml);
    },
  );
}

async function loadScalarHtmlDocument() {
  const dynamicImport = new Function(
    'specifier',
    'return import(specifier)',
  ) as (specifier: string) => Promise<{
    getHtmlDocument: (
      configuration: Record<string, unknown>,
      customTheme?: string,
    ) => string;
  }>;

  const scalarModule = await dynamicImport('@scalar/core/libs/html-rendering');
  return scalarModule.getHtmlDocument;
}

function applyDocumentMetadata(document: OpenAPIObject) {
  const tagDefinitions = buildTagDefinitions();

  document.tags = tagDefinitions;
  document.info.description = '后台管理系统 API 文档，支持鉴权调试与业务模块分组浏览。';
  document['x-tagGroups'] = buildTagGroups();
}

function buildTagDefinitions(): ApiTagDefinition[] {
  return [
    { name: '认证', description: '登录、令牌与鉴权相关接口' },
    { name: '用户管理', description: '用户创建、查询与维护接口' },
    { name: '部门管理', description: '部门树、部门详情与维护接口' },
    { name: '角色管理', description: '角色权限与角色维护接口' },
    { name: '菜单管理', description: '菜单与权限点维护接口' },
    { name: '文件上传', description: '文件上传与对象存储接口' },
    { name: '数据字典-类型管理', description: '字典类型维护接口' },
    { name: '数据字典-数据管理', description: '字典数据维护接口' },
    { name: '开发调试', description: '本地调试与基础能力验证接口' },
  ];
}

function buildTagGroups(): ApiTagGroupDefinition[] {
  return [
    {
      name: '鉴权入口',
      tags: ['认证'],
    },
    {
      name: '组织权限',
      tags: ['用户管理', '部门管理', '角色管理', '菜单管理'],
    },
    {
      name: '基础配置',
      tags: ['数据字典-类型管理', '数据字典-数据管理', '文件上传'],
    },
    {
      name: '开发调试',
      tags: ['开发调试'],
    },
  ];
}

void bootstrap().catch((error: unknown) => {
  logger.error(
    'Application failed to start',
    error instanceof Error ? error.stack : String(error),
  );
  process.exit(1);
});
