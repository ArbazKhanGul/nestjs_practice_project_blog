import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { NodeEnv } from '../types/app-config.interface';

export class AppConfigDTO {
  @IsNotEmpty()
  @IsString()
  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv;

  @IsNotEmpty()
  @IsNumber()
  PORT: number;

  // Database
  @IsNotEmpty()
  @IsString()
  POSTGRES_USER: string;

  @IsNotEmpty()
  @IsString()
  POSTGRES_PASSWORD: string;

  @IsNotEmpty()
  @IsString()
  POSTGRES_DB: string;

  @IsNotEmpty()
  @IsString()
  POSTGRES_HOST: string;

  @IsNotEmpty()
  @IsNumber()
  POSTGRES_PORT: number;

  // AUTH
  @IsNotEmpty()
  @IsString()
  ACCESS_TOKEN_SECRET: string;

  @IsNotEmpty()
  @IsString()
  ACCESS_TOKEN_EXPIRATION: string;

  @IsNotEmpty()
  @IsString()
  REFRESH_TOKEN_SECRET: string;

  @IsNotEmpty()
  @IsString()
  REFRESH_TOKEN_EXPIRATION: string;
}
