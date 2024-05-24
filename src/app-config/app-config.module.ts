import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateConfig } from './helpers/validate-app-config.helper';
import { mapAppConfig } from './helpers/map-app-config.helper';
import { AppConfigService } from './app-config.service';

@Module({})
@Global()
export class AppConfigModule {
  static register(): DynamicModule {
    return {
      module: AppConfigModule,
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          validate: validateConfig,
          load: [mapAppConfig],
        }),
      ],
      providers: [AppConfigService],
      exports: [AppConfigService],
    };
  }
}
