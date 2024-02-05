import { PickType, OmitType } from "@nestjs/mapped-types";
import { IsInt, IsArray, IsString, IsNotEmpty, Length, MinLength, IsEmail} from "class-validator";

export class UserDto {
    @IsInt()
    id : number;

    @IsString()
    nama : string;

    avatar : string;

    @IsString()
    @IsEmail()
    email : string;

    @IsString()
    @MinLength(8)
    password : string;

    @IsString()
    refresh_token : string;

@IsString()
    role : string
}

export class DtoRegister extends PickType(UserDto, ["nama", "email", "password"]) {}
export class DtonyaLogin extends PickType(UserDto, ['email', 'password']) {}
export class ResetPasswordDto {
    @IsString()
    @MinLength(8)
    password_baru : string;
}