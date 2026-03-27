import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityService } from '../casl/casl.service';
import { AuditService } from 'src/modules/administrator/audit/audit.service';
export declare class PermissionsGuard implements CanActivate {
    private readonly reflector;
    private readonly caslAbilityService;
    private readonly auditService;
    private readonly logger;
    constructor(reflector: Reflector, caslAbilityService: CaslAbilityService, auditService: AuditService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
