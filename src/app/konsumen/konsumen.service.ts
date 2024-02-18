import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Konsumen } from './konsumen.entity';
import { Like, Repository } from 'typeorm';
import BaseResponse from 'src/utils/Response/base.response';
import {
  CreateKonsumenDto,
  KonsumenDto,
  findAllKonsumenDto,
} from './konsumen.dto';
import { ResponseSuccess } from 'src/interface/respone';
import { query } from 'express';

@Injectable()
export class KonsumenService extends BaseResponse {
  constructor(
    @InjectRepository(Konsumen)
    private readonly konsumenRepository: Repository<Konsumen>,
  ) {
    super();
  }

  async create(payload: CreateKonsumenDto): Promise<ResponseSuccess> {
    try {
      await this.konsumenRepository.save(payload);
      return this._success('oke');
    } catch (error) {
      console.log(`error -> ${error}`);
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async findAll(query: findAllKonsumenDto): Promise<ResponseSuccess> {
    const { page, pageSize, limit, keyword } = query;

    const filterKeyword = [];

    if (keyword) {
      filterKeyword.push(
        {
          nama_konsumen: Like(`%${keyword}%`),
        },
        {
          alamat_konsumen: Like(`%${keyword}%`),
        },
        {
          email: Like(`%${keyword}%`),
        },
        {
          nomor_handphone: Like(`%${keyword}%`),
        },
      );
    }
    const total = await this.konsumenRepository.count({
      where: filterKeyword,
    });
    const result = await this.konsumenRepository.find({
      where: filterKeyword,
      relations: ['created_by', 'updated_by'],
      select: {
        id: true,
        nama_konsumen: true,
        nomor_handphone: true,
        alamat_konsumen: true,
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
    return this._pagination('OKE', result,total,page,pageSize)
  }
}
