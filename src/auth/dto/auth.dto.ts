import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
//these decorations are pipes for each object
export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
