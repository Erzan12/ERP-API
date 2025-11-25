import { Test, TestingModule } from '@nestjs/testing';
import { PermissionTemplateController } from './permission_template.controller';

describe('PermissionTemplateController', () => {
  let controller: PermissionTemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionTemplateController],
    }).compile();

    controller = module.get<PermissionTemplateController>(PermissionTemplateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
