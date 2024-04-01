// add-book.dto.ts

import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsInt,
  IsBoolean,
} from 'class-validator';
import { PageRequestDto } from 'src/utils/page dto/page.dto';

export class AddBookDto {
  @IsNotEmpty()
  @IsString()
  judul: string;

  @IsNotEmpty()
  @IsString()
  cover: any;

  @IsNotEmpty()
  @IsNumber()
  @Min(2010)
  @Max(2024)
  tahun_terbit: number;

  @IsNotEmpty()
  @IsNumber()
  harga: number;

  @IsNotEmpty()
  @IsString()
  penulis: string;

  @IsNotEmpty()
  @IsString()
  deskripsi: string;
}

// find-all-books.dto.ts

export class FindAllBooksDto extends PageRequestDto {
  @IsOptional()
  @IsString()
  judul?: string;

  @IsOptional()
  @IsInt()
  @Min(2010)
  @Max(2024)
  tahun_terbit?: number;

  @IsOptional()
  @IsInt()
  harga?: number;

  @IsOptional()
  @IsString()
  penulis?: string;

  @IsOptional()
  @IsString()
  deskripsi?: string;

  @IsOptional()
  @IsBoolean()
  is_deleted?: boolean;

  @IsString()
  @IsOptional()
  keyword: string;
}

// update-book.dto.ts

export class UpdateBookDto {
  @IsNotEmpty()
  @IsString()
  judul: string;

  @IsNotEmpty()
  @IsString()
  cover: any;

  @IsNotEmpty()
  @IsInt()
  @Min(2010)
  @Max(2024)
  tahun_terbit: number;

  @IsNotEmpty()
  @IsInt()
  harga: number;

  @IsNotEmpty()
  @IsString()
  penulis: string;

  @IsNotEmpty()
  @IsString()
  deskripsi: string;
}
