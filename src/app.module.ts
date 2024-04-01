import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './app/auth/auth.module';
import { MailModule } from './app/mail/mail.module';
import { KategoriModule } from './app/kategori/kategori.module';
import { ProdukModule } from './app/produk/produk.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UploadController } from './app/upload/upload.controller';
import { KonsumenModule } from './app/konsumen/konsumen.module';
import { UniqueValidator } from './utils/validator/unique.validator';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from './app/order/order.module';
import { OrderDetailModule } from './app/order_detail/order_detail.module';
import { ProfileModule } from './app/profile/profile.module';
import { BookModule } from './pts/book/book.module';
import { AuthsModule } from './pts/auths/auths.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    MailModule,
    KategoriModule,
    ProdukModule,
    KonsumenModule,
    OrderModule,
    OrderDetailModule,
    ProfileModule,
    BookModule,
    AuthsModule,
  ],
  controllers: [AppController, UploadController],
  providers: [AppService, UniqueValidator],
})
export class AppModule {}
