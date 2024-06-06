import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { AccessTokenStrategyName } from '../strategies';

/**
 * Guard to protect GraphQL resolvers with `access_token` strategy
 *
 * This guard is responsible for checking the `access_token` from the request headers.
 * If the token is valid, it will allow the request to proceed.
 *
 * @throws `UnauthorizedException` If the `access_token` is invalid
 */
@Injectable()
export class AccessTokenGuard extends AuthGuard(AccessTokenStrategyName) {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
