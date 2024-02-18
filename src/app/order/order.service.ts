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
}
