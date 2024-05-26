import { IAppConfig, NodeEnv } from '../types/app-config.interface';

export const mapAppConfig = (): IAppConfig => ({
  core: {
    nodeEnv: process.env.NODE_ENV as NodeEnv,
    port: parseInt(process.env.PORT, 10) || 5000,
  },
  database: {
    POSTGRES: {
      type: 'postgres',
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT!, 10),
      autoLoadEntities: true,
      synchronize: false, // It's better to generate and run migrations when entities change
    },
  },
});
