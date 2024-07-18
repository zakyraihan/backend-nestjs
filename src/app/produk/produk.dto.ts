import { OmitType, PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
  isString,
} from 'class-validator';
import { PageRequestDto } from 'src/utils/page dto/page.dto';
import { Kategori } from '../kategori/kategori.entity';

export class ProdukDto {
  @IsInt()
  id: number;

  @IsString()
  @IsNotEmpty()
  @Length(8)
  barcode: string;

  @IsString()
  @IsNotEmpty()
  nama_produk: string;

  @IsNumber()
  @IsNotEmpty()
  kategori_id: number;

  @IsString()
  @IsNotEmpty()
  deskripsi_produk: string;

  @IsNotEmpty()
  @IsNumber()
  harga: number;

  @IsNotEmpty()
  @IsNumber()
  stok: number;

  @IsOptional()
  @IsString()
  foto: string;

  @IsObject()
  @IsOptional()
  created_by: { id: number };

  @IsObject()
  @IsOptional()
  updated_by: { id: number };
}

export class CreateProdukDto extends OmitType(ProdukDto, ['id']) {}

export class UpdateProdukDto extends OmitType(ProdukDto, ['id'] ) {}
export class CreateProdukArrayDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProdukDto)
  data: CreateProdukDto[];
}

export class DeleteProdukArrayDto {
  @IsArray()
  data: number[];
}

export class FindAllProduk extends PageRequestDto {
  @IsString()
  @IsOptional()
  nama_produk: string;

  @IsString()
  @IsOptional()
  nama_kategori: string;

  @IsString()
  @IsOptional()
  deskripsi_produk: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  dari_harga: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  sampai_harga: number;

  @IsString()
  @IsOptional()
  keyword: string;
}
