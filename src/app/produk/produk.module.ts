import { Module } from '@nestjs/common';
import { ProdukController } from './produk.controller';
import { ProdukService } from './produk.service';

@Module({
  controllers: [ProdukController],
  providers: [ProdukService]
})
export class ProdukModule {}
