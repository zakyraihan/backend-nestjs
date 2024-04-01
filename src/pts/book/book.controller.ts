import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AddBookDto, FindAllBooksDto, UpdateBookDto } from './book.dto';
import { BookService } from './book.service';
import { JwtGuard } from 'src/app/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { ResponseSuccess } from 'src/interface/respone';

@UseGuards(JwtGuard)
@Controller('book')
export class BookController {
  constructor(private readonly booksService: BookService) {}
  @Post('create')
  async addBook(@Body() addBookDto: AddBookDto) {
    return this.booksService.Create(addBookDto);
  }

  @Get('list')
  async getAllbooks(@Pagination() query: FindAllBooksDto) {
    return this.booksService.findAll(query);
  }

  @Put(':id/update')
  @UseInterceptors(FileInterceptor('cover'))
  async updateBook(
    @Param('id') id: number,
    @Body() updateBookDto: UpdateBookDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const response = await this.booksService.updateBook(id, updateBookDto);
      return response;
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async softDeleteBook(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any, // Request object
  ): Promise<ResponseSuccess> {
    return this.booksService.softDeleteBook(id);
  }

  @Get('detail/:id')
  findOneBook(@Param('id') id: string) {
    return this.booksService.getDetail(Number(id));
  }

  @Post(':id/restore')
  async restoreBook(@Param('id') id: number): Promise<any> {
    try {
      const response = await this.booksService.restoreBook(id);
      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
