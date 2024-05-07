import { OmitType } from '@nestjs/mapped-types';
import { IsInt, IsObject, IsOptional, IsNumber } from 'class-validator';
import { Produk } from '../produk/produk.entity';

export class OrderDetailDto {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsNumber()
  jumlah: number;

  @IsObject()
  produk: Produk;

  @IsNumber()
  jumlah_harga: number;

  @IsObject()
  @IsOptional()
  updated_by: { id: number };

  @IsObject()
  @IsOptional()
  created_by: { id: number };
}
