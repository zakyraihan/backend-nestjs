import { PickType, OmitType } from '@nestjs/mapped-types';
import {
  IsInt,
  IsArray,
  IsString,
  IsNotEmpty,
  Length,
  MinLength,
  IsEmail,
} from 'class-validator';

export class UserDto {
  @IsInt()
  id: number;

  @IsString()
  nama: string;

  @IsString()
  avatar: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  refresh_token: string;

  @IsString()
  role: string;
}

export class DtoRegister extends PickType(UserDto, [
  'nama',
  'email',
  'password',
]) {}
export class LoginDto extends PickType(UserDto, ['email', 'password']) {}

export class ResetPasswordDto {
  @IsString()
  @MinLength(8)
  new_password: string;
}

export class UserGoogleDto {
  @IsString()
  id: string;

  @IsString()
  nama: string;

  @IsString()
  avatar: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  refresh_token: string;

  @IsString()
  role: string;

  @IsString()
  id_token: string;
}

export class LoginGoogleDTO extends PickType(UserGoogleDto, [
  'id',
  'nama',
  'avatar',
  'email',
  'id_token',
]) {}
