import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { instanceToPlain } from 'class-transformer';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { User, UserRole } from './entities/user.entity';
import { TokenPayload, TokensPair } from './types/jwt.types';
import { AppConfigService } from 'src/app-config/app-config.service';
import { UserSession } from './entities/user-session.entity';
import { LoginResponse, RefreshResponse } from './types/response';

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserSession)
    private readonly userSessionRepository: Repository<UserSession>,
  ) {}

  async register(input: RegisterDTO, profileImage: Express.Multer.File) {
    if (!!(await this.findOneByEmail(input.email))) {
      throw new ForbiddenException('Email already exist');
    }

    // Create User
    return this.create({
      email: input.email,
      password: input.password,
      name: input.name,
      role: UserRole.user,
      profileImage: profileImage.filename,
    });
  }

  async login(input: LoginDTO): Promise<LoginResponse> {
    const user = await this.findOneByEmail(input.email);

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    // Check if passwords match
    if (!(await user.comparePassword(input.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const tokenPayload = new TokenPayload({
      sub: user.id,
      role: user.role,
      session_id: uuidV4(),
    });

    const tokensPair = await this.generateTokensPair(tokenPayload);

    // Create User Session
    await this.createSession(user, tokenPayload, tokensPair.refresh_token);

    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    return {
      user: userWithoutPassword,
      access_token: tokensPair.access_token,
      refresh_token: tokensPair.refresh_token,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  create(user: Partial<User>): Promise<User> {
    const preparedUser = this.userRepository.create(user);
    return this.userRepository.save(preparedUser);
  }

  findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({
      email: email.toLowerCase().trim(),
    });
  }

  private async createSession(
    user: User,
    tokenPayload: TokenPayload,
    refreshToken: string,
  ): Promise<void> {
    const userSession = this.userSessionRepository.create({
      id: tokenPayload.session_id,
      user,
      refresh_token: refreshToken,
    });
    await this.userSessionRepository.save(userSession);
  }

  private async generateTokensPair(payload: TokenPayload): Promise<TokensPair> {
    return new TokensPair({
      access_token: await this.jwtService.signAsync(instanceToPlain(payload), {
        secret: this.appConfigService.auth.ACCESS_TOKEN_SECRET,
        expiresIn: this.appConfigService.auth.ACCESS_TOKEN_EXPIRATION,
      }),
      refresh_token: await this.jwtService.signAsync(instanceToPlain(payload), {
        secret: this.appConfigService.auth.REFRESH_TOKEN_SECRET,
        expiresIn: this.appConfigService.auth.REFRESH_TOKEN_EXPIRATION,
      }),
    });
  }

  async refreshTokens(
    currentUserPayload: TokenPayload,
    refreshToken: string,
  ): Promise<RefreshResponse> {
    // Check if session exist
    const userSession = await this.userSessionRepository.findOneBy({
      id: currentUserPayload.session_id,
    });

    if (!userSession) {
      throw new UnauthorizedException('Invalid session');
    }

    // Check if refresh token match
    if (!(await userSession.compareRefreshToken(refreshToken))) {
      // If doesn't match, delete session because someone is using an old `refreshToken` of the current session. The `refreshToken` is compromised.
      await this.userSessionRepository.remove(userSession);
      throw new UnauthorizedException('Compromised refresh token');
    }

    // Generate JWT Tokens
    const tokenPayload = new TokenPayload({
      sub: currentUserPayload.sub,
      role: currentUserPayload.role,
      session_id: currentUserPayload.session_id,
    });
    const tokensPair = await this.generateTokensPair(tokenPayload);

    // Update User Session
    userSession.refresh_token = tokensPair.refresh_token;
    await this.userSessionRepository.save(userSession);

    return {
      access_token: tokensPair.access_token,
      refresh_token: tokensPair.refresh_token,
    };
  }

  findOneById(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }
}
