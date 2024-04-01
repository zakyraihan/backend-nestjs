import { Module } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { AuthsController } from './auths.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './auths.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwt_config } from 'src/config/jwt.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    JwtModule.register({
      secret: jwt_config.access_token_secret,
      signOptions: {
        expiresIn: jwt_config.expired,
      },
    }),
  ],
  providers: [AuthsService],
  controllers: [AuthsController],
})
export class AuthsModule {}
