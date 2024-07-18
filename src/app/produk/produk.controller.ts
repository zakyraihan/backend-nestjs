import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/auth.guard';
import { ProdukService } from './produk.service';
import {
  CreateProdukArrayDto,
  DeleteProdukArrayDto,
  FindAllProduk,
  UpdateProdukDto,
} from './produk.dto';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { InjectUpdatedBy } from 'src/utils/decorator/inject-updated_by.decorator';

@UseGuards(JwtGuard)
@Controller('produk')
export class ProdukController {
  constructor(private produkService: ProdukService) {}

  @Post('create-bulk')
  async createBulk(@Body() payload: CreateProdukArrayDto) {
    return this.produkService.createBulk(payload);
  }

  @Get('list')
  async findAll(@Pagination() query: FindAllProduk) {
    return this.produkService.findAll(query);
  }

  @Get('detail/:id')
  async detail(@Param('id') id: string) {
    return this.produkService.detailProduk(Number(id));
  }

  @Put('update/:id')
  async updateProduk(
    @Param('id') id: number,
    @Body() payload: UpdateProdukDto,
  ) {
    const updatedProduk = await this.produkService.update(id, payload);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.produkService.deleteProduk(Number(id));
  }

  @Post('delete/bulk')
  async deleteBulk(@Body() payload: DeleteProdukArrayDto) {
    return this.produkService.deleteBulk(payload);
  }
}
