import {
  Injectable,
  HttpStatus,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/Response/base.response';
import { Repository } from 'typeorm';
import {
  DtoRegister,
  LoginDto,
  LoginGoogleDTO,
  ResetPasswordDto,
} from './auth.dto';
import { compare, hash } from 'bcrypt';
import { ResponseSuccess } from 'src/interface/respone';
import { GoogleUser, User } from './auth.entity';
import { jwt_config } from 'src/config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import { ResetPassword } from './reste_password.entity';
import { MailService } from '../mail/mail.service';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService extends BaseResponse {
  constructor(
    @InjectRepository(User) private readonly authRepository: Repository<User>,
    @InjectRepository(GoogleUser)
    private readonly googleUserRepository: Repository<GoogleUser>,
    @InjectRepository(ResetPassword)
    private readonly resetPasswordRepository: Repository<ResetPassword>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {
    super();
  }

  private generateJWT(
    payload: jwtPayload,
    expiresIn: string | number,
    secret_key: string,
  ) {
    return this.jwtService.sign(payload, {
      secret: secret_key,
      expiresIn: expiresIn,
    });
  }

  async register(payload: DtoRegister): Promise<ResponseSuccess> {
    const isEmailExist = await this.authRepository.findOne({
      where: { email: payload.email },
    });

    if (isEmailExist) {
      throw new HttpException('Maaf User Sudah Daftar', HttpStatus.BAD_REQUEST);
    }

    payload.password = await hash(payload.password, 12);
    await this.authRepository.save(payload);
    return this._success('Sip', payload);
  }

  async Login(payload: LoginDto): Promise<ResponseSuccess> {
    const isEmailExist = await this.authRepository.findOne({
      where: { email: payload.email },
      select: {
        id: true,
        nama: true,
        email: true,
        password: true,
        refresh_token: true,
      },
    });

    if (!isEmailExist) {
      throw new HttpException(
        'Maaf, User Anda Tidak Dapat Ditemukan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const cekKatasandi = await compare(payload.password, isEmailExist.password);

    if (cekKatasandi) {
      const jwtPayload: jwtPayload = {
        id: isEmailExist.id,
        nama: isEmailExist.nama,
        email: isEmailExist.email,
      };

      const access_token = await this.generateJWT(
        jwtPayload,
        '1d',
        jwt_config.access_token_secret,
      );

      const refresh_token = await this.generateJWT(
        jwtPayload,
        '7d',
        jwt_config.refresh_token_secret,
      );

      await this.authRepository.save({
        refresh_token: refresh_token,
        id: isEmailExist.id,
      });
      return this._success('Login Sukses', {
        ...isEmailExist,
        access_token: access_token,
        refresh_token: refresh_token,
        role: 'siswa',
      });
    } else {
      throw new HttpException(
        'Maaf, Anda Harus Memasukkan Email Dan Password Yang Sesuai',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async ProfilKu(id: number): Promise<ResponseSuccess> {
    const user = await this.authRepository.findOne({
      where: {
        id: id,
      },
    });

    return this._success('OK', user);
  }

  async refreshToken(id: number, token: string): Promise<ResponseSuccess> {
    const checkUserExists = await this.authRepository.findOne({
      where: {
        id: id,
        refresh_token: token,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        password: true,
        refresh_token: true,
      },
    });

    console.log('user', checkUserExists);
    if (checkUserExists === null) {
      throw new UnauthorizedException();
    }

    const jwtPayload: jwtPayload = {
      id: checkUserExists.id,
      nama: checkUserExists.nama,
      email: checkUserExists.email,
    };

    const access_token = await this.generateJWT(
      jwtPayload,
      '1d',
      jwt_config.access_token_secret,
    );

    const refresh_token = await this.generateJWT(
      jwtPayload,
      '7d',
      jwt_config.refresh_token_secret,
    );

    await this.authRepository.save({
      refresh_token: refresh_token,
      id: checkUserExists.id,
    });

    return this._success('Success', {
      ...checkUserExists,
      access_token: access_token,
      refresh_token: refresh_token,
    });
  }

  async lupaKataSandi(email: string): Promise<ResponseSuccess> {
    const user = await this.authRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new HttpException(
        'Maaf, Email Tidak Ditemukan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const token = randomBytes(32).toString('hex');
    const link = `http://localhost:3010/auth/reset-password/${user.id}/${token}`;
    await this.mailService.kirimLupaSandi({
      email: email,
      name: user.nama,
      link: link,
    });

    const payload = {
      user: {
        id: user.id,
      },
      token: token,
    };

    await this.resetPasswordRepository.save(payload);

    return this._success('Silahkan Cek Email');
  }

  async resetPassword(
    user_id: number,
    token: string,
    payload: ResetPasswordDto,
  ): Promise<ResponseSuccess> {
    const userToken = await this.resetPasswordRepository.findOne({
      //cek apakah user_id dan token yang sah pada tabel reset password
      where: {
        token: token,
        user: {
          id: user_id,
        },
      },
    });
    console.log('userToken', userToken);

    if (!userToken) {
      throw new HttpException(
        'Token tidak valid',
        HttpStatus.UNPROCESSABLE_ENTITY, // jika tidak sah , berikan pesan token tidak valid
      );
    }

    payload.new_password = await hash(payload.new_password, 12); //hash password
    await this.authRepository.save({
      // ubah password lama dengan password baru
      password: payload.new_password,
      id: user_id,
    });
    await this.resetPasswordRepository.delete({
      // hapus semua token pada tabel reset password yang mempunyai user_id yang dikirim, agar tidak bisa digunakan kembali
      user: {
        id: user_id,
      },
    });

    return this._success('Reset Passwod Berhasil, Silahkan login ulang');
  }

  async loginWithGoogle(payload: LoginGoogleDTO) {
    console.log(payload);

    try {
      const resDecode: any = this.jwtService.decode(payload.id_token);

      if (resDecode.email == payload.email) {
        const checkUserExists = await this.googleUserRepository.findOne({
          where: {
            email: payload.email,
          },
          select: {
            id: true,
            nama: true,
            email: true,
            refresh_token: true,
          },
        });

        if (checkUserExists == null) {
          const jwtPayload: jwtPayload = {
            id: payload.id,
            nama: payload.nama,
            email: payload.email,
          };

          const access_token = await this.generateJWT(
            jwtPayload,
            '1d',
            jwt_config.access_token_secret,
          );

          const refresh_token = await this.generateJWT(
            jwtPayload,
            '7d',
            jwt_config.refresh_token_secret,
          );

          await this.googleUserRepository.save({
            ...payload,
            refresh_token,
            access_token,
            id: payload.id,
          });
        }
      }
    } catch (error) {
      console.log('err', error);
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async getDataloginGoogle(id: string) {
    const checkUserExists = await this.googleUserRepository.findOne({
      where: {
        id: id,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        refresh_token: true,
      },
    });

    const jwtPayload: jwtPayload = {
      id: checkUserExists.id,
      nama: checkUserExists.nama,
      email: checkUserExists.email,
    };

    const access_token = await this.generateJWT(
      jwtPayload,
      '1d',
      jwt_config.access_token_secret,
    );

    return this._success('Login Success', {
      ...checkUserExists,
      access_token: access_token,
      role: 'siswa',
    });
  }
}
