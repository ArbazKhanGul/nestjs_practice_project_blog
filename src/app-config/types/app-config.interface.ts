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
  auth: {
    ACCESS_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRATION: string;
    REFRESH_TOKEN_SECRET: string;
    REFRESH_TOKEN_EXPIRATION: string;
  };
}
