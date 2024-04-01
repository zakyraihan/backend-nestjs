import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Between, Like, Repository } from 'typeorm';
import { AddBookDto, FindAllBooksDto, UpdateBookDto } from './book.dto';
import { ResponsePagination, ResponseSuccess } from 'src/interface/respone';
import BaseResponse from 'src/utils/Response/base.response';
import { REQUEST } from '@nestjs/core';
import { networkInterfaces } from 'os';
import { Users } from '../auths/auths.entity';
import { Books } from './book.entity';
import { User } from 'src/app/auth/auth.entity';
import { use } from 'passport';

@Injectable()
export class BookService extends BaseResponse {
  constructor(
    @InjectRepository(Books)
    private readonly bookRepository: Repository<Books>,
    @Inject(REQUEST) private req: any,
  ) {
    super();
  }

  async softDeleteBook(bookId: number): Promise<ResponseSuccess> {
    try {
      const book = await this.bookRepository.findOne({
        where: {
          id: bookId,
        },
      });
      if (!book) {
        throw new HttpException('Buku tidak ditemukan', HttpStatus.NOT_FOUND);
      }

      book.is_deleted = true;

      await this.bookRepository.save(book);

      return this._success('Buku berhasil ditandai sebagai dihapus');
    } catch (error) {
      throw new HttpException(
        'Ada kesalahan dalam menghapus buku',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getDetail(id: number): Promise<ResponseSuccess> {
    const detailBook = await this.bookRepository.findOne({
      where: {
        id,
      },
    });

    if (detailBook === null) {
      throw new NotFoundException(`Produk dengan id ${id} tidak ditemukan`);
    }
    return this._success('Berhasil Mendapatkan Buku', detailBook);
  }

  async restoreBook(bookId: number): Promise<ResponseSuccess> {
    try {
      const book = await this.bookRepository.findOne({
        where: {
          id: bookId,
        },
      });
      if (!book) {
        throw new HttpException('Buku tidak ditemukan', HttpStatus.NOT_FOUND);
      }

      book.is_deleted = false;

      await this.bookRepository.save(book);

      return this._success('Buku berhasil dipulihkan');
    } catch (error) {
      throw new HttpException(
        'Ada kesalahan dalam memulihkan buku',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async Create(payload: AddBookDto): Promise<ResponseSuccess> {
    try {
      if (!payload) {
        throw new BadRequestException('Semua kolom harus diisi');
      }
      if (payload.tahun_terbit < 2010 || payload.tahun_terbit > 2024) {
        throw new BadRequestException(
          'Tahun terbit harus di antara 2010 dan 2024',
        );
      }
      await this.bookRepository.save(payload);

      return this._success('Buku berhasil ditambahkan');
    } catch (error) {
      throw new BadRequestException('Data tidak valid');
    }
  }

  async updateBook(
    id: number,
    updateProdukDto: UpdateBookDto,
  ): Promise<ResponseSuccess> {
    const check = await this.bookRepository.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`buku deengan id ${id} tidak ditemukan`);

    const update = await this.bookRepository.save({
      ...updateProdukDto,
      id: id,
    });

    return this._success('Berhasil MengUpdate Data', update);
  }

  async findAll(query: FindAllBooksDto): Promise<ResponsePagination> {
    const {
      page,
      pageSize,
      judul,
      tahun_terbit,
      harga,
      penulis,
      deskripsi,
      keyword,
      is_deleted,
    } = query;

    const filterQuery: { [key: string]: any } = {};
    const filterKeyword = [];

    if (keyword) {
      filterKeyword.push(
        { judul: Like(`%${keyword}%`) },
        { tahun_terbit: Like(`%${keyword}%`) },
        { harga: Like(`%${keyword}%`) },
        { penulis: Like(`%${keyword}%`) },
        { deskripsi: Like(`%${keyword}%`) },
      );
    } else {
      if (judul) filterQuery.judul = Like(`%${judul}%`);
      if (tahun_terbit) filterQuery.tahun_terbit = tahun_terbit;
      if (harga) filterQuery.harga = harga;
      if (penulis) filterQuery.penulis = Like(`%${penulis}%`);
      if (deskripsi) filterQuery.deskripsi = Like(`%${deskripsi}%`);
      if (is_deleted !== undefined) filterQuery.is_deleted = is_deleted;
    }

    const total = await this.bookRepository.count({
      where: keyword ? filterKeyword : filterQuery,
    });

    const result = await this.bookRepository.find({
      where: keyword ? filterKeyword : filterQuery,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: [
        'id',
        'judul',
        'cover',
        'tahun_terbit',
        'harga',
        'penulis',
        'deskripsi',
        'is_deleted',
      ],
    });

    return this._pagination(
      'oke',
      result,
      total,
      page,
      Math.ceil(total / pageSize),
    );
  }
}
