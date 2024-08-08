import { Module } from '@nestjs/common';
import { QueryBuilderService } from './query-builder.service';
import { QueryBuilderController } from './query-builder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/app/auth/auth.entity';
import { Produk } from 'src/app/produk/produk.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Produk])],
  providers: [QueryBuilderService],
  controllers: [QueryBuilderController],
})
export class QueryBuilderModule {}
