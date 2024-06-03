import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserSession } from './entities/user-session.entity';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserSession]),
    JwtModule.register({}),
  ],
  controllers: [UserController],
  providers: [UserService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [UserService],
})
export class UserModule {}
