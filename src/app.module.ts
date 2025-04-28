import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigService } from './shared/services/app-config.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookModule } from './modules/book/book.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuModule } from './modules/menu/menu.module';
import { SharedModule } from './shared/shared.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import configuration from './configuration';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    // RedisModule.forRootAsync(
    //   {
    //     useFactory: (configService: AppConfigService) => {
    //       return {
    //         readyLog: true,
    //         config: configService.redisConfig,
    //       };
    //     },
    //     inject: [AppConfigService],
    //   },
    //   true,
    // ),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: AppConfigService) => {
        return configService.typeormConfig;
      },
      inject: [AppConfigService],
    }),
    SharedModule,
    UserModule,
    AuthModule,
    BookModule,
    MenuModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
