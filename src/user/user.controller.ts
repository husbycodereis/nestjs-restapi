import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

//using UseGuard before a class makes all of its requests be guarded by the auth method such as jwt
//check guards for further info => https://docs.nestjs.com/guards
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  //blank get call will get all users
  @Get('me')
  getMe(@GetUser() user: User) {
    console.log({ user: user });
    return user;
  }
}
