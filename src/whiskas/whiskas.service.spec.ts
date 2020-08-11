import { Test, TestingModule } from '@nestjs/testing';
import { WhiskasService } from './whiskas.service';

describe('WhiskasService', () => {
  let service: WhiskasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhiskasService],
    }).compile();

    service = module.get<WhiskasService>(WhiskasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
