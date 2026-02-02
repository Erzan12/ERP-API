import { Test, TestingModule } from '@nestjs/testing';
import { SecurityClearanceController } from './security-clearance.controller';

describe('SecurityClearanceController', () => {
  let controller: SecurityClearanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecurityClearanceController],
    }).compile();

    controller = module.get<SecurityClearanceController>(
      SecurityClearanceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
