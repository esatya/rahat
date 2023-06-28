import { Test, TestingModule } from '@nestjs/testing';
import { DistributorService } from './distributor.service';

describe('DistributorService', () => {
  let service: DistributorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DistributorService],
    }).compile();

    service = module.get<DistributorService>(DistributorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
