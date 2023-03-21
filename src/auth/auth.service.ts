import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  signup() {
    return { msg: 'signedup' };
  }
  signin() {
    return { msg: 'signedin' };
  }
}
