import { Injectable, HttpStatus, HttpException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/Response/base.response';
import { Repository } from 'typeorm';
import { DtoRegister, DtonyaLogin, ResetPasswordDto } from './auth.dto';
import { compare, hash } from 'bcrypt';
import { ResponseSuccess } from 'src/interface/respone';
import { User } from './auth.entity';
import { jwt_config } from 'src/config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import { ResetPassword } from './reste_password.entity';
import { MailService } from '../mail/mail.service';
import { randomBytes } from 'crypto';

@Injectable()

export class AuthService extends BaseResponse {
    constructor(
        @InjectRepository(User) private readonly authRepository: Repository<User>,
        @InjectRepository(ResetPassword) private readonly resetKataSandi : Repository<ResetPassword>,
        private jwtService: JwtService,
        private mailService : MailService
    ) {
        super()
    }

    private generateJWT(payload: jwtPayload, expiresIn: string | number, secret_key: string) {
        return this.jwtService.sign(
            payload, {
            secret: secret_key,
            expiresIn: expiresIn
        }
        )
    }

    async register(payload: DtoRegister): Promise<ResponseSuccess> {
        const apakahUserAda = await this.authRepository.findOne({ where: { email: payload.email } })

        if (apakahUserAda) {
            throw new HttpException("Maaf User Sudah Daftar", HttpStatus.BAD_REQUEST)
        }

        payload.password = await hash(payload.password, 12);
        await this.authRepository.save(payload);
        return this._success("Sip", payload);
    }

    async Login(payload: DtonyaLogin): Promise<ResponseSuccess> {
        const apakahEmailada = await this.authRepository.findOne({
            where: { email: payload.email },
            select: {
                id: true,
                nama: true,
                email: true,
                password: true,
                refresh_token: true
            }


        })

        if (!apakahEmailada) {
            throw new HttpException(
                'Maaf, User Anda Tidak Dapat Ditemukan', HttpStatus.UNPROCESSABLE_ENTITY
            )
        }

        const cekKatasandi = await compare(
            payload.password,
            apakahEmailada.password

        );

        if (cekKatasandi) {
            const jwtPayload: jwtPayload = {
                id: apakahEmailada.id,
                nama: apakahEmailada.nama,
                email: apakahEmailada.email
            }

            const access_token = await this.generateJWT(
                jwtPayload,
                '1d',
                jwt_config.access_token_secret
            );

            const refresh_token = await this.generateJWT(
                jwtPayload,
                '7d',
                jwt_config.refresh_token_secret
            )

            await this.authRepository.save({
                refresh_token: refresh_token,
                id: apakahEmailada.id
            })
            return this._success('Login Sukses', {
                ...apakahEmailada,
                access_token: access_token,
                refresh_token: refresh_token
            })
        } else {
            throw new HttpException(
                'Maaf, Anda Harus Memasukkan Email Dan Password Yang Sesuai',
                HttpStatus.UNPROCESSABLE_ENTITY
            )
        }
    }

    async ProfilKu(id: number): Promise<ResponseSuccess> {
        const user = await this.authRepository.findOne({
            where: {
                id: id
            }
        })

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
    

    async lupaKataSandi(email : string) : Promise<ResponseSuccess> {
        const user= await this.authRepository.findOne({where: {
            email: email
        }})

        if (!user) {
throw new HttpException('Maaf, Email Tidak Ditemukan', HttpStatus.UNPROCESSABLE_ENTITY)
        }

        const token = randomBytes(32).toString('hex');
        const link = `http://localhost:8080/auth/reset-password/${user.id}/${token}`
        await this.mailService.kirimLupaSandi({
            email: email,
            name: user.nama,
            link: link
        })

        const payload = {
            user: {
                id : user.id
            },
            token: token
        }

        return this._success("Sukses Mereset Password")
    }

    async resetPassword (
        user_id : number,
        token : string,
        payload: ResetPasswordDto

    ) : Promise<ResponseSuccess> {

        const Token = await this.resetKataSandi.findOne(
            {where: {
                token: token,
                user: {
                    id : user_id
                }
            }},

            
        )
        if (!Token) {
            throw new HttpException("Token Tidak Valid", HttpStatus.UNPROCESSABLE_ENTITY)
        }

        payload.password_baru = await hash(payload.password_baru, 12)

        await this.authRepository.save({
            password : payload.password_baru,
            id :user_id
        })

        await this.resetKataSandi.delete ({
            user : {
                id : user_id
            }
        })

        return this._success('Reset Password Berhasil, Silahkan Login Ulang')
        }
    }
