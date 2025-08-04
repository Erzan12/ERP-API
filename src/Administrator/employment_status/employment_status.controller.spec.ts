import { Test, TestingModule } from '@nestjs/testing';
import { EmploymentStatusController } from './employment_status.controller';

describe('EmploymentStatusController', () => {
  let controller: EmploymentStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmploymentStatusController],
    }).compile();

    controller = module.get<EmploymentStatusController>(EmploymentStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
