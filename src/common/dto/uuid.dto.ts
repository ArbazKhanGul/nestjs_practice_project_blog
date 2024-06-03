import { IsUUID } from 'class-validator';

export class UUIDDTO {
  @IsUUID()
  id: string;
}
