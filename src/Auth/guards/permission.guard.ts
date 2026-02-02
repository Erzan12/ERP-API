import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityService } from '../casl/casl.service';
import { RequestUser } from 'src/components/types/request-user.interface';
import {
  PERMISSIONS_KEY,
  PermissionMetadata,
} from 'src/components/decorators/can.decorator';
import { ACTION_MAP, VALID_ACTIONS } from 'src/components/constants/action-map';
import { IS_PUBLIC_KEY } from 'src/components/decorators/public.decorator';

//revamped version clean up and simplified
@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly caslAbilityService: CaslAbilityService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as RequestUser;

    if (!user) {
      throw new ForbiddenException('Please login to access this resource.');
    }

    const permission = this.reflector.get<PermissionMetadata>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );

    if (!permission) {
      throw new ForbiddenException('Access denied: no permission metadata.');
    }

    const action = permission.action.toLowerCase().trim();
    const subject = permission.subject.toLowerCase().trim();

    if (!VALID_ACTIONS.includes(action)) {
      throw new ForbiddenException(
        `Invalid action "${action}" used in @Can().`,
      );
    }

    const ability = this.caslAbilityService.defineAbilitiesFor(user.roles);

    this.logger.debug(
      'User roles structure: ' + JSON.stringify(user.roles, null, 2),
    );

    // // Debug all granted permissions
    // this.logger.debug(
    //   `User ${user.email} permissions:\n` +
    //   user.roles.map(role =>
    //     `Role: ${role.name}\n` +
    //     role.permissions.map(p => `  → ${p.action} on ${p.permission.name}`).join('\n')
    //   ).join('\n')
    // );

    const canAccess = ability.can(action, subject);

    if (!canAccess) {
      throw new ForbiddenException(
        `You do not have permission to ${action} ${subject}.`,
      );
    }

    return true;
  }
}
