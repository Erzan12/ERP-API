import { Test, TestingModule } from '@nestjs/testing';
import { PermissionTemplateService } from './permission_template.service';

describe('PermissionTemplateService', () => {
  let service: PermissionTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermissionTemplateService],
    }).compile();

    service = module.get<PermissionTemplateService>(PermissionTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
