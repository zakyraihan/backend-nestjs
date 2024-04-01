import { PickType, OmitType } from '@nestjs/mapped-types';
import {
  IsInt,
  IsArray,
  IsString,
  IsNotEmpty,
  Length,
  MinLength,
  IsEmail,
  Matches,
} from 'class-validator';
import { IsUnique } from 'src/utils/validator/unique.validator';

export class DtoUser {
  @IsInt()
  id: number;

  @IsString()
  nama: string;

  @IsString()
  username: string;

  @IsString()
  avatar: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  refresh_token: string;

  @IsString()
  role: string;
}

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  nama: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*\d)(?=.*[A-Z])[A-Za-z\d@$!%*?&]*$/, { message: 'Password harus minimal 8 karakter, mengandung angka dan huruf kapital' })
  password: string;
}

// export class RegisterDto extends PickType(DtoUser, [
//   'nama',
//   'username',
//   'password',
// ]) {}

export class DtoLogin extends PickType(DtoUser, ['username', 'password']) {}
