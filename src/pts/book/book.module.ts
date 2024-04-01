import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Books } from './book.entity';
import { Users } from '../auths/auths.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Books, Users])],
  providers: [BookService],
  controllers: [BookController],
})
export class BookModule {}
