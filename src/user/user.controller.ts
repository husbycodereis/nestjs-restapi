import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('users')
export class UserController {
  //check guards for further info => https://docs.nestjs.com/guards
  @UseGuards(AuthGuard('jwt'))
  //blank get call will get all users
  @Get('me')
  getMe(@Req() req: Request) {
    console.log({ user: req.user });
    return req.user;
  }
}
