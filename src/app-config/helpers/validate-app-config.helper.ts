import { plainToInstance } from 'class-transformer';
import { AppConfigDTO } from '../dto/app-config.dto';
import { validateSync } from 'class-validator';
import { InternalServerErrorException } from '@nestjs/common';

export function validateConfig(processEnv: NodeJS.ProcessEnv): AppConfigDTO {
  const castedEnv = plainToInstance(AppConfigDTO, processEnv, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(castedEnv);

  if (errors.length > 0) {
    throw new InternalServerErrorException(errors.toString());
  }
  return castedEnv;
}
