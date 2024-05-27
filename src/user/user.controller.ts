import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  UseGuards,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { UserService } from './user.service';
import { AccessTokenGuard } from './guards/acess-token.guard';
import { CurrentUserPayload } from './decorator/user-payload.decorator';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { TokenPayload } from './types/jwt.types';
import { Request } from 'express';
import { LoginResponse, RefreshResponse } from './types/response';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  @UseInterceptors(
    FileInterceptor('profileImage', {
      storage: diskStorage({
        destination: './upload/files',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  register(
    @Body() createUserDto: RegisterDTO,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(png|jpeg|jpg)$/,
        })
        .addMaxSizeValidator({
          maxSize: 1 * 1024 * 1024, // 1 MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    profileImage: Express.Multer.File,
  ) {
    return this.userService.register(createUserDto, profileImage);
  }

  @Post('/login')
  async login(@Body() loginUser: LoginDTO): Promise<LoginResponse> {
    console.log('🚀 ~ UserController ~ login ~ loginUser:', loginUser);
    return this.userService.login(loginUser);
  }

  @Get('/profile')
  @UseGuards(AccessTokenGuard)
  async getProfile(@CurrentUserPayload('sub') userId: string) {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get('/refreshToken')
  @UseGuards(RefreshTokenGuard)
  async refreshTokens(
    @CurrentUserPayload() currentUserPayload: TokenPayload,
    @Req() req: Request,
  ): Promise<RefreshResponse> {
    const refreshToken = req.headers.authorization!.split(' ')[1];
    return this.userService.refreshTokens(currentUserPayload, refreshToken);
  }
}
