import { Module } from '@nestjs/common';
import { KategoriService } from './kategori.service';
import { KategoriController } from './kategori.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kategori } from './kategori.entity';
import { User } from '../auth/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Kategori, User])],
  providers: [KategoriService],
  controllers: [KategoriController]
})
export class KategoriModule {}
