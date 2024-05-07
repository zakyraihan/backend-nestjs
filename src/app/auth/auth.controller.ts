import { Controller, Post, Body, Get, UseGuards, Req, Param } from '@nestjs/common';
import { DtoRegister, LoginDto, LoginGoogleDTO, ResetPasswordDto } from './auth.dto';
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
  async login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @Post('logingoogle')
  async loginwithgoogle(@Body() payload: LoginGoogleDTO) {
    return this.authService.loginWithGoogle(payload);
  }

  @Get('getgoogleuser/:id')
  async getData(@Param('id') id: string) {
    return this.authService.getDataloginGoogle(id);
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
  

  @Post('reset-password/:user_id/:token')  // url yang dibuat pada endpont harus sama dengan ketika kita membuat link pada service forgotPassword
  async resetPassword(
    @Param('user_id') user_id: string,
    @Param('token') token: string,
    @Body() payload: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(+user_id, token, payload);
  }
}
