import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditDto } from './dto/edit-user.dto';
import { UserService } from './user.service';

//using UseGuard before a class makes all of its requests be guarded by the auth method such as jwt
//check guards for further info => https://docs.nestjs.com/guards
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  //blank get call will get all users
  @Get('me')
  getMe(@GetUser() user: User) {
    console.log({ user: user });
    return user;
  }

  @Patch()
  editUser(@GetUser('id') userId: number, @Body() dto: EditDto) {
    return this.userService.editUser(userId, dto);
  }
}
