import { Injectable } from '@nestjs/common';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class UserService {

  register(createUserDto: RegisterDTO,  profileImage: Express.Multer.File) {
    console.log("🚀 ~ UserService ~ create ~ profileImage:", profileImage)
    console.log("🚀 ~ UserService ~ create ~ createUserDto:", createUserDto)
    return 'This action adds a new user';
  }


  login(loginUser:LoginDTO) {
    console.log("🚀 ~ UserService ~ login ~ loginUser:", loginUser)
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  
}
