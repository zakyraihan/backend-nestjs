import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/auth.guard';
import { OrderService } from './order.service';
import { InjectCreatedBy } from 'src/utils/decorator/inject-created_by.decorator';
import { CreateOrderDto } from './order.dto';

@UseGuards(JwtGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('tambah')
  async createOrder(@InjectCreatedBy() payload: CreateOrderDto) {
    return this.orderService.createOrder(payload);
  }
}
