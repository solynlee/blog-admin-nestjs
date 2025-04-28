import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as md5 from 'md5';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    const md5Password = md5(password).toUpperCase();
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }
    if (user.password !== md5Password) {
      throw new UnauthorizedException('密码错误');
    }
    const payload = { username: user.username, id: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
    // return {
    //   access_token: this.jwtService.sign(payload),
    // };
  }
  // constructor(private readonly userService: UserService) {}
}
