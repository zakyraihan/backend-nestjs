import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GoogleUser, User } from "./auth.entity";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtAccessTokenStrategy } from "./jwtAccessToken.strategy";
import { JwtRefreshTokenStrategy } from "./jwtRefreshTokenStrategy";
import { MailModule } from "../mail/mail.module";
import { ResetPassword } from "./reste_password.entity";
import { jwt_config } from "src/config/jwt.config";


@Module({
  imports: [
    TypeOrmModule.forFeature([User, ResetPassword, GoogleUser]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.register({
      secret: jwt_config.access_token_secret,
      signOptions: {
        expiresIn: jwt_config.expired
      }
    }),
    MailModule
],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessTokenStrategy, JwtRefreshTokenStrategy],
})
export class AuthModule {}