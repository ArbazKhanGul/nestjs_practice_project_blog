import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export enum NodeEnv {
  development = 'development',
  production = 'production',
}

export interface IAppConfig {
  core: {
    nodeEnv: NodeEnv;
    port: number;
  };
  database: {
    POSTGRES: TypeOrmModuleOptions;
  };
}
