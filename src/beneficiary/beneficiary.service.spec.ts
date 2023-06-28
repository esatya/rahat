import { Test, TestingModule } from '@nestjs/testing';
import { BeneficiaryService } from './beneficiary.service';

describe('BeneficiaryService', () => {
  let service: BeneficiaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BeneficiaryService],
    }).compile();

    service = module.get<BeneficiaryService>(BeneficiaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
