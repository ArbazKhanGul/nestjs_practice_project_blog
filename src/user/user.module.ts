import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserSession } from './entities/user-session.entity';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';
import { UserResolver } from './user.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserSession]),
    JwtModule.register({}),
  ],
  providers: [
    UserService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    UserResolver,
  ],
  exports: [UserService],
})
export class UserModule {}
