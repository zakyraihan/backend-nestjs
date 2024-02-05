import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { KategoriService } from './kategori.service';
import {
  CreateKategoriDto,
  FindAllKategori,
  UpdateKategoriDto,
  buatbulk,
} from './kategori.dto';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { InjectCreatedBy } from 'src/utils/decorator/inject-created_by.decorator';
import { JwtGuard } from '../auth/auth.guard';
import { InjectUpdatedBy } from 'src/utils/decorator/inject-updated_by.decorator';
import { InjectBulkCreatedBy } from 'src/utils/decorator/inject-creared_bulk_by.decorator';
@UseGuards(JwtGuard)
@Controller('kategori')
export class KategoriController {
  constructor(private KategoriService: KategoriService) {}

  @Post('create')
  async create(@InjectCreatedBy() payload: CreateKategoriDto) {
    return this.KategoriService.create(payload);
  }

  @Post('create/bulk')
  bulkCreate(@InjectBulkCreatedBy() Payload: buatbulk) {
    return this.KategoriService.createBulk(Payload);
  }

  @Get('list')
  async getAllCategory(@Pagination() query: FindAllKategori) {
    return this.KategoriService.getAllCategory(query);
  }

  @Get('detail/:id')
  async Detail(@Param('id') id: string) {
    return this.KategoriService.Detail(Number(id));
  }

  @Put('update/:id')
  async Update(
    @Param('id') id: string,
    @InjectUpdatedBy() payload: UpdateKategoriDto,
  ) {
    return this.KategoriService.Update(Number(id), payload);
  }

  @Delete('delete/:id')
  async Hapus(@Param('id') id: string) {
    return this.KategoriService.delete(+id);
  }

  @Get('user/list')
  async getUserCategory() {
    return this.KategoriService.getUserCategory();
  }

  @Get('user/list')
  async getUser() {
    return this.KategoriService.getUserCategory();
  }
}
