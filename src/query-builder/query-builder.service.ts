import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/app/auth/auth.entity';
import { Produk } from 'src/app/produk/produk.entity';
import BaseResponse from 'src/utils/Response/base.response';
import { Repository } from 'typeorm';

@Injectable()
export class QueryBuilderService extends BaseResponse {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Produk) private readonly produkRepo: Repository<Produk>,
  ) {
    super();
  }

  async latihan() {
    const queryBuilder = await this.userRepository.createQueryBuilder('user');
    const queryBuilder2 = await this.produkRepo.createQueryBuilder('produk');

    const result = await queryBuilder2.getManyAndCount();

    return this._success('oke', result);
  }
}
