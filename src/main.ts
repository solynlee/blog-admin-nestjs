import { NestFactory, Reflector } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { SharedModule } from './shared/shared.module';
import { AppConfigService } from './shared/services/app-config.service';
import * as path from 'path';
import * as fs from 'fs';
import {
  ClassSerializerInterceptor,
  HttpStatus,
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { AppLoggerService } from './shared/services/app-logger.service';
import { BaseExceptionFilter } from './filters/base.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { setupSwagger } from './setup-swagger';
import { join } from 'path';

const dir = process.cwd();
const httpsOptions = {
  key: fs.readFileSync(path.resolve(dir, './https/songxsp.cn.key')),
  cert: fs.readFileSync(path.resolve(dir, './https/songxsp.cn.pem')),
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      bufferLogs: true,
      cors: true,
      httpsOptions,
    },
  );
  const configService = app.get(AppConfigService);
  // reflector
  const reflector = app.get(Reflector);
  // logger
  app.useLogger(app.get(AppLoggerService));
  // global filters
  app.useGlobalFilters(new BaseExceptionFilter(configService));
  // global interceptors
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector),
    new TransformInterceptor(reflector),
  );

  const jwtService = app.select(SharedModule).get(JwtService);
  // const redisService = app.get(RedisService);
  // app.useGlobalGuards(
  //   new Authguard(reflector, jwtService, configService, redisService),
  // );
  // global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors) =>
        new UnprocessableEntityException(
          errors.map((e) => {
            if (!e.constraints) {
              return `property ${e.property} validation failed: no constraints found`;
            }
            const rule = Object.keys(e.constraints)[0];
            const message = e.constraints[rule];
            return `${message}`;
          })[0],
        ),
    }),
  );
  // global prefix
  const { globalPrefix, port } = configService.appConfig;
  app.setGlobalPrefix(globalPrefix);
  // swagger document
  setupSwagger(app, configService);
  await app.listen(port, '0.0.0.0');
  const logger = new Logger('NestApplication');
  logger.log(`Server running on ${await app.getUrl()}`);
}
// async function bootstrap() {
//   const httpsApp = await NestFactory.create(AppModule, {
//     cors: true,
//     httpsOptions,
//   });
//   const httpApp = await NestFactory.create(AppModule, {
//     cors: true,
//   });
//   httpsApp.useGlobalPipes(
//     new ValidationPipe({ whitelist: true, transform: true }),
//   );
//   httpApp.useGlobalPipes(
//     new ValidationPipe({ whitelist: true, transform: true }), //whitelist: true 表示只验证装饰器装饰的属性，transform: true 表示将请求体转换为DTO
//   );
//   await httpsApp.listen(process.env.PORT ?? 7767);
//   await httpApp.listen(process.env.PORT ?? 7768);
// }
bootstrap();
