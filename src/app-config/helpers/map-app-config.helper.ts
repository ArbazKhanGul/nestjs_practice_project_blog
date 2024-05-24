import { IAppConfig, NodeEnv } from '../types/app-config.interface';

export const mapAppConfig = (): IAppConfig => ({
  core: {
    nodeEnv: process.env.NODE_ENV as NodeEnv,
    port: parseInt(process.env.PORT, 10) || 5000,
  },
});
