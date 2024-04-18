import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
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

  @Get('detail/:id')
  async detailOrder(@Param('id') id: string) {
    return this.orderService.findById(+id);
  }

  @Delete('delete/:id')
  async deleteOrder(@Param('id') id: number) {
    return this.orderService.deleteOrder(+id);
  }
}
