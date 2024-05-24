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
}
