import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { DtoRegister, DtonyaLogin } from './auth.dto';
import { AuthService } from './auth.service';
import { JwtGuard, JwtGuardRefreshToken } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('Register')
  async register(@Body() payload: DtoRegister) {
    return this.authService.register(payload);
  }

  @Post('Login')
  async login(@Body() payload: DtonyaLogin) {
    return this.authService.Login(payload);
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  async profile(@Req() req) {
    const { id } = req.user;
    return this.authService.ProfilKu(id);
  }

  @UseGuards(JwtGuardRefreshToken)
  @Get('refresh-token')
  async refreshToken(@Req() req) {
    const token = req.headers.authorization.split(' ')[1];
    const id = req.headers.id;
    return this.authService.refreshToken(+id, token);
  }

  @Post('lupa-password')
  async forgotPassowrd(@Body('email') email: string) {
    console.log('email', email);
    return this.authService.lupaKataSandi(email);
  }

  
}
