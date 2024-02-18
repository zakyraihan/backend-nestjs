import { Test, TestingModule } from '@nestjs/testing';
import { KonsumenController } from './konsumen.controller';

describe('KonsumenController', () => {
  let controller: KonsumenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KonsumenController],
    }).compile();

    controller = module.get<KonsumenController>(KonsumenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
