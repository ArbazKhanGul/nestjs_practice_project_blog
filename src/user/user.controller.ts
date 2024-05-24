import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post("/register")
  @UseInterceptors(FileInterceptor('profileImage', {
    storage: diskStorage({
      destination: './upload/files',
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      },
    }),
  }))
  register(@Body() createUserDto: RegisterDTO, @UploadedFile(
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

  @Post("/login")
  login(@Body() loginUser: LoginDTO) {
    console.log("🚀 ~ UserController ~ login ~ loginUser:", loginUser)
    return this.userService.login(loginUser);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

}
