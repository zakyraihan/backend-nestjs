import { OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsObject, IsArray, ValidateNested } from 'class-validator';
import { PageRequestDto } from 'src/utils/page dto/page.dto';

export class KategoriDto {
  @IsInt()
  id?: number;

  @IsString()
  nama_kategori: string;

  @IsObject()
  @IsOptional()
  created_by: { id: number };

  @IsObject()
  @IsOptional()
  updated_by: { id: number };
}

export class CreateKategoriDto extends OmitType(KategoriDto, [
  'id',
  'created_by',
  'updated_by',
]) {}

export class UpdateKategoriDto extends OmitType(KategoriDto, ['created_by']) {}
export class FindAllKategori extends PageRequestDto {
  @IsString()
  @IsOptional()
  nama_kategori: string;

  @IsString()
  @IsOptional()
  nama_user: string;
}

export class buatbulk {
  @IsArray()
  @ValidateNested()
  @Type(() => CreateKategoriDto)
  data: CreateKategoriDto[];
}
