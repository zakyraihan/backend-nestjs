import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { Between, Like, Repository } from 'typeorm';
import { OrderEntity } from './order.entity';
import { CreateOrderDto, UpdateOrderDto, findAllOrderDto } from './order.dto';
import { REQUEST } from '@nestjs/core';
import { Response } from 'express';
import { ResponsePagination, ResponseSuccess } from 'src/interface/respone';

@Injectable()
export class OrderService extends BaseResponse {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @Inject(REQUEST) private req: any,
  ) {
    super();
  }

  generateInvoice(): string {
    return `INV` + new Date().getTime();
  }

  async createOrder(payload: CreateOrderDto): Promise<ResponseSuccess> {
    try {
      const invoice = this.generateInvoice();
      payload.nomor_order = invoice;

      var total = 0;

      payload.order_detail &&
        payload.order_detail.forEach((item) => {
          item.created_by = this.req.user.id;
          total += item.jumlah * item.jumlah_harga;
        });

      await this.orderRepository.save({
        ...payload,
        konsumen: {
          id: payload.konsumen_id,
        },
        total_bayar: total,
      });

      return this._success('OK');
    } catch (err) {
      console.log('err', err);
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async findAll(query: findAllOrderDto): Promise<ResponsePagination> {
    const {
      page,
      pageSize,
      limit,
      nomor_order,
      dari_order_tanggal,
      sampai_order_tanggal,
      status,
      dari_total_bayar,
      sampai_total_bayar,
      nama_konsumen,
      sort_by,
      order_by,
    } = query;

    const filterQuery: any = [];

    if (nomor_order) {
      filterQuery.nomor_order = Like(`%${nomor_order}%`);
    }

    if (nama_konsumen) {
      filterQuery.konsumen = {
        nama_konsumen: Like(`%${nama_konsumen}%`),
      };
    }
    if (status) {
      filterQuery.status = Like(`%${status}%`);
    }
    if (dari_total_bayar && sampai_total_bayar) {
      filterQuery.total_bayar = Between(dari_total_bayar, sampai_total_bayar);
    }
    if (dari_total_bayar && !!sampai_total_bayar === false) {
      filterQuery.total_bayar = Between(dari_total_bayar, dari_total_bayar);
    }

    if (dari_order_tanggal && sampai_order_tanggal) {
      filterQuery.tanggal_order = Between(
        dari_order_tanggal,
        sampai_order_tanggal,
      );
    }
    if (dari_order_tanggal && !!sampai_order_tanggal === false) {
      filterQuery.tanggal_order = Between(
        dari_order_tanggal,
        sampai_order_tanggal,
      );
    }

    const total = await this.orderRepository.count({
      where: filterQuery,
    });

    const result = await this.orderRepository.find({
      where: filterQuery,
      relations: [
        'created_by',
        'konsumen',
        'order_detail',
        'order_detail.produk',
      ],
      select: {
        id: true,
        nomor_order: true,
        status: true,
        total_bayar: true,
        tanggal_order: true,

        konsumen: {
          id: true,
          nama_konsumen: true,
        },
        created_by: {
          id: true,
          nama: true,
        },
        order_detail: {
          id: true,
          jumlah: true,
          produk: {
            nama_produk: true,
          },
        },
      },

      skip: limit,
      take: pageSize,
      order: {
        [sort_by]: order_by,
      },
    });
    return this._pagination('OK', result, total, page, pageSize);
  }

  async findById(id: number): Promise<ResponseSuccess> {
    const result = await this.orderRepository.findOne({
      where: {
        id: id,
      },
      relations: [
        'created_by',
        'konsumen',
        'order_detail',
        'order_detail.produk',
      ],
      select: {
        id: true,
        nomor_order: true,
        status: true,
        total_bayar: true,
        tanggal_order: true,
        konsumen: {
          id: true,
          nama_konsumen: true,
        },
        created_by: {
          id: true,
          nama: true,
        },

        order_detail: {
          id: true,
          jumlah: true,
          produk: {
            id: true,
            nama_produk: true,
            harga: true,
          },
        },
      },
    });

    return this._success('OK', result);
  }

  async updateOrder(
    id: number,
    payload: UpdateOrderDto,
  ): Promise<ResponseSuccess> {
    const check = await this.orderRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!check) {
      throw new HttpException('Data tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    payload.order_detail &&
      payload.order_detail.forEach((item) => {
        item.created_by = this.req.user.id;
      });

    const order = await this.orderRepository.save({ ...payload, id: id });

    return this._success('OK', order);
  }

  async deleteOrder(id: number): Promise<ResponseSuccess> {
    const check = await this.orderRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!check) {
      throw new NotFoundException(`order dengan id ${id} tidak ditemukan`);
    }
    await this.orderRepository.delete(id);
    return this._success('berhasil menghapus order');
  }
}
