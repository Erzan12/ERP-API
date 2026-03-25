import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppAbility, CaslAbilityService } from '../casl/casl.service';
import {
  PERMISSIONS_KEY,
  PermissionMetadata,
} from 'src/utils/decorators/can.decorator';
import { VALID_ACTIONS } from 'src/utils/constants/action-map';
import { IS_PUBLIC_KEY } from 'src/utils/decorators/public.decorator';
import { AuditService } from 'src/modules/administrator/audit/audit.service';
import { AuthenticatedRequest } from 'src/utils/types/interface';

//revamped version clean up and simplified
@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly caslAbilityService: CaslAbilityService,
    private readonly auditService: AuditService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Please login to access this resource.');
    }

    const permission = this.reflector.get<PermissionMetadata>(
      PERMISSIONS_KEY,
      context.getHandler(),
    ) as PermissionMetadata | undefined;

    if (!permission) {
      // throw new ForbiddenException('Access denied: no permission metadata.');
      return true;
    }

    const action = permission.action.toLowerCase().trim();
    const subject = permission.subject.toLowerCase().trim();

    if (!VALID_ACTIONS.includes(action)) {
      throw new ForbiddenException(
        `Invalid action "${action}" used in @Can().`,
      );
    }

    const ability: AppAbility = this.caslAbilityService.defineAbilitiesFor(
      user.roles,
    );

    this.logger.debug(
      'User roles structure: ' + JSON.stringify(user.roles, null, 2),
    );

    // // Debug all granted permissions
    // this.logger.debug(
    //   `User ${user.email} permissions:\n` +
    //   user.roles.map(role =>
    //     `Role: ${role.name}\n` +
    //     role.sub_modules.map(sm =>
    //       `  → [${sm.actions.join(', ')}] on ${sm.name}`
    //     ).join('\n')
    //   ).join('\n')
    // );

    const canAccess = ability.can(action, subject);

    if (!canAccess) {
      //log permission denial -> audit
      await this.auditService.logPermissionDenied(
        user,
        action,
        subject,
        request.ip,
        request.url,
      );

      throw new ForbiddenException(
        `You do not have permission to ${action} ${subject}.`,
      );
    }
    return true;
  }
}
