import { Test, TestingModule } from '@nestjs/testing';
import { SecurityClearanceService } from './security-clearance.service';

describe('SecurityClearanceService', () => {
  let service: SecurityClearanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecurityClearanceService],
    }).compile();

    service = module.get<SecurityClearanceService>(SecurityClearanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
