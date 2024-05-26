import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from './types/app-config.interface';

/**
 * This is a custom configuration service that provides the configuration object available via the `ConfigService` with better TypeScript support.
 */
@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService<IAppConfig>) {}

  get core(): IAppConfig['core'] {
    return this.configService.get('core', { infer: true })!;
  }

  get database(): IAppConfig['database'] {
    return this.configService.get('database', { infer: true })!;
  }
}
