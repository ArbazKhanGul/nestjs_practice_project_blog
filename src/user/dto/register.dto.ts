import { Field, InputType, PickType } from '@nestjs/graphql';
import { IsNotEmpty, MinLength } from 'class-validator';
import { User } from '../../user/entities/user.entity';

@InputType()
export class RegisterUserInput extends PickType(User, ['email'], InputType) {
  @Field()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  password: string;

  @Field()
  @MinLength(8)
  @IsNotEmpty()
  confirm_password: string;
}
