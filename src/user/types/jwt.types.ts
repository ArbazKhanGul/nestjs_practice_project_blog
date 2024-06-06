import { Field, ObjectType } from '@nestjs/graphql';
import { UserRole } from 'src/user/entities/user.entity';

@ObjectType()
export class TokensPair {
  @Field()
  access_token: string;

  @Field()
  refresh_token: string;

  constructor(partial?: Partial<TokensPair>) {
    Object.assign(this, partial);
  }
}
/**
 * Logged in `User` payload
 *
 * This payload is stored in `access_token` and `refresh_token`
 */
export class TokenPayload {
  sub: string;
  role: UserRole;
  session_id: string;

  constructor(partial: Partial<TokenPayload>) {
    Object.assign(this, partial);
  }
}
