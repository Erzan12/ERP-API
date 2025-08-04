import { Test, TestingModule } from '@nestjs/testing';
import { EmploymentStatusService } from './employment_status.service';

describe('EmploymentStatusService', () => {
  let service: EmploymentStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmploymentStatusService],
    }).compile();

    service = module.get<EmploymentStatusService>(EmploymentStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
