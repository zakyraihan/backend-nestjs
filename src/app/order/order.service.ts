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
import { ResponseSuccess } from 'src/interface/respone';

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

      payload.order_detail &&
        payload.order_detail.forEach((item) => {
          item.created_by = this.req.user.id;
        });

      await this.orderRepository.save({
        ...payload,
        konsumen: {
          id: payload.konsumen_id,
        },
      });

      return this._success('OK');
    } catch (err) {
      console.log('err', err);
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
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
