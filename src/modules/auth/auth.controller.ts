import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from './pubic.decorator';
import { AuthService } from './auth.service';
import { success, fail, wrapperResponse } from 'src/utils';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('login')
  login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password);
  }
}
