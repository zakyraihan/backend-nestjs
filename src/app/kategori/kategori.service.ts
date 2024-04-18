import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Kategori } from './kategori.entity';
import { Like, Repository } from 'typeorm';
import BaseResponse from 'src/utils/Response/base.response';
import { REQUEST } from '@nestjs/core';
import {
  CreateKategoriDto,
  FindAllKategori,
  UpdateKategoriDto,
  buatbulk,
} from './kategori.dto';
import { ResponseSuccess, ResponsePagination } from 'src/interface/respone';
import { User } from '../auth/auth.entity';
@Injectable()
export class KategoriService extends BaseResponse {
  constructor(
    @InjectRepository(Kategori)
    private readonly kategoriRepository: Repository<Kategori>,
    @InjectRepository(User) private readonly UserRepository: Repository<User>,
    @Inject(REQUEST) private req: any,
  ) {
    super();
  }
  async create(payload: CreateKategoriDto): Promise<ResponseSuccess> {
    try {
      await this.kategoriRepository.save({
        ...payload,
        created_by: {
          id: this.req.user.id,
        },
      });

      return this._success('OK', this.req.user.user_id);
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async Detail(id: number): Promise<ResponseSuccess> {
    const cari = await this.kategoriRepository.findOne({
      where: {
        id: id,
      },
      select: {
        id: true,
        nama_kategori: true,
        created_by: {
          id: true,
          nama: true,
          email: true,
        },
      },
      relations: ['created_by', 'updated_by'],
    });

    if (!cari) {
      throw new HttpException(
        'Terjadi Kesalahan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return this._success('Berhasil Menemukan Detail', cari);
  }

  async Update(
    id: number,
    payload: UpdateKategoriDto,
  ): Promise<ResponseSuccess> {
    const cari = await this.kategoriRepository.findOne({
      where: {
        id: id,
      },
    });

    if (cari == null) {
      throw new HttpException(
        'Terjadi Kesalahan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const update = await this.kategoriRepository.save({
      ...payload,
      id: id,
    });

    return this._success('Berhasil Mengupdate Data', update);
  }

  async delete(id: number): Promise<ResponseSuccess> {
    const cek = await this.kategoriRepository.findOne({ where: { id: id } });

    if (!cek) {
      throw new HttpException('Terjadi Kesalahan', HttpStatus.BAD_REQUEST);
    }

    const hapus = await this.kategoriRepository.delete(id);

    return this._success('Berhasil Menghapus kategori', hapus);
  }

  async getAllCategory(query: FindAllKategori): Promise<ResponsePagination> {
    const { page, pageSize, limit, nama_kategori, nama_user } = query;

    const filterQuery: any = {};
    if (nama_kategori) {
      filterQuery.nama_kategori = Like(`%${nama_kategori}%`);
    }
    if (nama_user) {
      filterQuery.created_by = {
        nama: Like(`%${nama_user}%`),
      };
    }

    const total = await this.kategoriRepository.count({ where: filterQuery });

    console.log('Qwery', filterQuery);

    const result = await this.kategoriRepository.find({
      where: filterQuery,
      relations: ['created_by', 'updated_by'],
      select: {
        id: true,
        nama_kategori: true,
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

    return this._pagination('Sip', result, total, page, pageSize);
  }

  async getUserCategory(): Promise<ResponseSuccess> {
    const user = await this.UserRepository.findOne({
      where: { id: this.req.user.id },
      relations: ['kategori_created_by', 'kategori_updated_by'],
      select: {
        id: true,
        nama: true,
        kategori_created_by: {
          id: true,
          nama_kategori: true,
        },
      },
    });

    return this._success('Sukses', user);
  }

  async createBulk(payload: buatbulk): Promise<ResponseSuccess> {
    try {
      let berhasil = 0;
      let gagal = 0;

      await Promise.all(
        payload.data.map(async (data) => {
          try {
            await this.kategoriRepository.save({
              ...data,
            });

            berhasil = berhasil + 1;
          } catch {
            gagal = gagal + 1;
          }
        }),
      );

      return this._success(
        `Berhasil Menyimpan Data Sebanyak ${berhasil} Kali Dan Gagal Sebanyak ${gagal} Kali`,
        this.req.user.user_id,
      );
    } catch {
      throw new HttpException('Terjadi Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }
}
