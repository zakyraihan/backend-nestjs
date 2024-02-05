import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/Response/base.response';
import { Produk } from './produk.entity';
import { Between, Like, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import {
  CreateProdukArrayDto,
  DeleteProdukArrayDto,
  FindAllProduk,
  UpdateProdukDto,
} from './produk.dto';
import { ResponsePagination, ResponseSuccess } from 'src/interface/respone';
import { Exception } from 'handlebars';

@Injectable()
export class ProdukService extends BaseResponse {
  constructor(
    @InjectRepository(Produk)
    private readonly produkRepository: Repository<Produk>,
    @Inject(REQUEST) private req: any,
  ) {
    super();
  }

  async createBulk(payload: CreateProdukArrayDto): Promise<ResponseSuccess> {
    try {
      let berhasil = 0;
      let gagal = 0;
      await Promise.all(
        payload.data.map(async (items) => {
          const dataSave = {
            ...items,
            kategori: {
              id: items.kategori_id,
            },
            created_by: {
              id: this.req.user.id,
            },
          };

          try {
            await this.produkRepository.save(dataSave);
            berhasil += 1;
          } catch (error) {
            console.log('error', error);
            gagal += 1;
          }
        }),
      );

      return this._success(`berhasil menyimpan ${berhasil} dan gagal ${gagal}`);
    } catch (error) {
      console.log('error', error);
      throw new HttpException('ada kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteBulk(payload: DeleteProdukArrayDto): Promise<ResponseSuccess> {
    try {
      let berhasil = 0;
      let gagal = 0;
      await Promise.all(
        payload.data.map(async (items) => {
          try {
            await this.produkRepository.delete(items), (berhasil += 1);
          } catch (error) {
            console.log('error', error);
            gagal += 1;
          }
        }),
      );
      return this._success(
        `berhasil menghapus buku sebanyak ${berhasil} dan gagal ${gagal}`,
      );
    } catch (error) {
      console.log('error', error);
      throw new HttpException('Terjadi Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(query: FindAllProduk): Promise<ResponsePagination> {
    const {
      page,
      pageSize,
      limit,
      nama_produk,
      dari_harga,
      sampai_harga,
      deskripsi_produk,
      keyword,
      nama_kategori,
    } = query;

    const filterQuery: any = {};
    const filterKeyword: any = [];

    if (keyword) {
      filterKeyword.push(
        {
          nama_produk: Like(`%${keyword}%`),
        },
        {
          harga: Like(`%${keyword}%`),
        },
        {
          deskripsi_produk: Like(`%${keyword}%`),
        },
        {
          kategori: {
            nama_kategori: Like(`%${keyword}%`),
          },
        },
      );
    } else {
      if (deskripsi_produk) {
        filterQuery.deskripsi_produk = Like(`%${deskripsi_produk}%`);
      }
      if (nama_produk) {
        filterQuery.nama_produk = Like(`%${nama_produk}%`);
      }
      if (dari_harga && sampai_harga) {
        filterQuery.harga = Between(dari_harga, sampai_harga);
      }
      if (dari_harga && !!sampai_harga === false) {
        filterQuery.harga = Between(dari_harga, dari_harga);
      }
      if (nama_kategori) {
        filterQuery.kategori = {
          nama_kategori: Like(`%${nama_kategori}%`),
        };
      }
    }

    const total = await this.produkRepository.count({
      where: keyword ? filterKeyword : filterQuery,
    });

    const result = await this.produkRepository.find({
      where: keyword ? filterKeyword : filterQuery,
      relations: ['created_by', 'updated_by', 'kategori'],
      select: {
        id: true,
        nama_produk: true,
        deskripsi_produk: true,
        stok: true,
        harga: true,
        kategori: {
          id: true,
          nama_kategori: true,
        },
        created_by: {
          id: true,
          nama: true,
        },
        updated_by: {
          id: true,
          nama: true,
        },
      },
      skip: limit,
      take: pageSize,
    });
    return this._pagination('OK', result, total, page, pageSize);
  }

  async detailProduk(id: number): Promise<ResponseSuccess> {
    const search = await this.produkRepository.findOne({
      where: {
        id: id,
      },
      relations: ['created_by', 'updated_by'],
      select: {
        id: true,
        nama_produk: true,
        deskripsi_produk: true,
        stok: true,
        harga: true,
        created_by: {
          id: true,
          nama: true,
        },
        updated_by: {
          id: true,
          nama: true,
        },
      },
    });
    if (!search) {
      throw new HttpException(
        'Terjadi Kesalahan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return this._success('berhasil menemukan detail produk', search);
  }

  async updateProduk(
    id: number,
    payload: UpdateProdukDto,
  ): Promise<ResponseSuccess> {
    const search = await this.produkRepository.findOne({
      where: {
        id: id,
      },
    });
    if (search == null) {
      throw new HttpException(
        'terjadi kesalahan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const update = await this.produkRepository.save({
      ...payload,
      id: id,
    });
    return this._success('berhasil update produk', update);
  }

  async deleteProduk(id: number): Promise<ResponseSuccess> {
    const check = await this.produkRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!check) {
      throw new HttpException('Terjadi Kesalahan', HttpStatus.BAD_REQUEST);
    }

    const remove = await this.produkRepository.delete(id);

    return this._success('berhasil menghapus produk');
  }
}
