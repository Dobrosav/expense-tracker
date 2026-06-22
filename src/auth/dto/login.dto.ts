import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'You must enter a valid email address.' })
  @IsNotEmpty()
  email: string;

  @IsNotEmpty({ message: 'Password is required.' })
  password: string;
}
