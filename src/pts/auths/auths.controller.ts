import { Body, Controller, Post } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { DtoLogin, RegisterDto } from './auths.dto';

@Controller('auths')
export class AuthsController {
  constructor(private authService: AuthsService) {}

  @Post('register')
  async register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }

  @Post('login')
  async login(@Body() payload: DtoLogin) {
    return this.authService.login(payload);
  }
}
