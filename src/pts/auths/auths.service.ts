import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './auths.entity';
import { Repository } from 'typeorm';
import BaseResponse from 'src/utils/Response/base.response';
import { JwtService } from '@nestjs/jwt';
import { DtoLogin, RegisterDto } from './auths.dto';
import { ResponseSuccess } from 'src/interface/respone';
import { compare, hash } from 'bcrypt';
import { jwt_config } from 'src/config/jwt.config';

@Injectable()
export class AuthsService extends BaseResponse {
  constructor(
    @InjectRepository(Users) private readonly authRepository: Repository<Users>,
    private jwtService: JwtService,
  ) {
    super();
  }

  private generateJWT(
    payload: PayloadJwt,
    expiresIn: string | number,
    secret_key: string,
  ) {
    return this.jwtService.sign(payload, {
      secret: secret_key,
      expiresIn: expiresIn,
    });
  }

  async register(payload: RegisterDto): Promise<ResponseSuccess> {
    const isEmailExist = await this.authRepository.findOne({
      where: { username: payload.nama },
    });

    if (isEmailExist) {
      throw new HttpException('Maaf User Sudah Daftar', HttpStatus.BAD_REQUEST);
    }

    payload.password = await hash(payload.password, 12);
    await this.authRepository.save(payload);
    return this._success('register succes', payload);
  }

  async login(payload: DtoLogin): Promise<ResponseSuccess> {
    const isUsernameExist = await this.authRepository.findOne({
      where: { username: payload.username },
      select: {
        id: true,
        nama: true,
        username: true,
        password: true,
        refresh_token: true,
      },
    });

    if (!isUsernameExist) {
      throw new HttpException(
        'Maaf, User Anda Tidak Dapat Ditemukan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const cekKatasandi = await compare(
      payload.password,
      isUsernameExist.password,
    );

    if (cekKatasandi) {
      const PayloadJwt: PayloadJwt = {
        id: isUsernameExist.id,
        nama: isUsernameExist.nama,
        username: isUsernameExist.username,
      };

      const access_token = await this.generateJWT(
        PayloadJwt,
        '1d',
        jwt_config.access_token_secret,
      );

      const refresh_token = await this.generateJWT(
        PayloadJwt,
        '7d',
        jwt_config.refresh_token_secret,
      );

      await this.authRepository.save({
        refresh_token: refresh_token,
        id: isUsernameExist.id,
      });
      return this._success('Login Sukses', {
        ...isUsernameExist,
        access_token: access_token,
        refresh_token: refresh_token,
      });
    } else {
      throw new HttpException(
        'Maaf, Anda Harus Memasukkan Username Dan Password Yang Sesuai',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
}
