import { Test, TestingModule } from '@nestjs/testing';
import { AuthsService } from './auths.service';

describe('AuthsService', () => {
  let service: AuthsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthsService],
    }).compile();

    service = module.get<AuthsService>(AuthsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
