import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityService } from '../casl/casl.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import {
  PERMISSIONS_KEY,
  PermissionMetadata,
} from '../decorators/can.decorator';
import { RequestUser } from '../types/request-user.interface';
import { ACTION_MAP, VALID_ACTIONS } from '../constants/action-map';

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

    this.logger.debug(`Fetched permission metadata: ${JSON.stringify(permission)}`);

    if (!permission) {
      this.logger.warn('No @Permissions metadata found – denying access.');
      throw new ForbiddenException('Access denied: no permission metadata.');
    }

    //handles module for Modules like Administrator or Human Resources, in can permission guard vs db driven data or input
    // const userModule = user.roles.module?.name?.toLowerCase().trim();
    // const allowedModules = Array.isArray(permission.module)
    //   ? permission.module.map((m) => m.toLowerCase().trim())
    //   : [permission.module?.toLowerCase().trim()];

    const userModules = user.roles.map(role => role.module.name.toLowerCase().trim());

    // Ensure uniqueness, if needed:
    const uniqueUserModules = [...new Set(userModules)];

    // Normalize permission module(s)
    const allowedModules = Array.isArray(permission.module)
      ? permission.module.map((m) => m.toLowerCase().trim())
      : [permission.module?.toLowerCase().trim()];

    

    //single module per user
    // if (!allowedModules.includes(userModule)) {
    //   throw new ForbiddenException(
    //     `Access denied: your module (${userModule}) is not allowed.`,
    //   );
    // }

    //handle multi module
    // Check if user has at least one matching module
    const hasModuleAccess = uniqueUserModules.some((mod) => allowedModules.includes(mod));

    if (!hasModuleAccess) {
      throw new ForbiddenException(
        `Access denied: your modules (${userModules.join(', ')}) are not allowed.`,
      );
    }

    //handles the action AKA actual permission and subject AKA submodule,in can permission guard vs db driven data or input
    const action = permission.action.toLowerCase().trim();
    const subject = permission.subject.toLowerCase().trim();

    //validator that throws an error if the action used in the @Can() decorator:
    //Is not in your predefined list (enum or array); Or doesn't exist in the role’s actual permission records
    const ability = this.caslAbilityService.defineAbilitiesFor(user.roles);

    const roleNames = user.roles.map(role => role.name).join(', ');

    //single module per user
    // this.logger.debug(
    //   `Checking role "${roleNames}" -> ${action} on ${subject} (Module: ${userModule})`,
    // );

    if (!VALID_ACTIONS.includes(action)) {
      throw new ForbiddenException(
        `Invalid action "${action}" used in @Can(). Please check if it's a supported permission.`
      );
    }

    //cross-check the action in @Can() against only what's defined in the user’s DB permissions
    const definedActions = new Set(
      user.roles
        .flatMap((role) => role.permissions)
        .filter((p) => p.status)
        .map((p) => p.action.toLowerCase().trim())
    );

    if (!definedActions.has(action) && !Object.keys(ACTION_MAP).includes(action)) {
      throw new ForbiddenException(
        `The action "${action}" is not assigned to your role or not valid.`
      );
    }

    // Debug: print all user permissions
    // for (const perm of user.user_roles.role_permissions) {
    //   const pAction = perm.action.toLowerCase();
    //   const pSubject = perm.permission?.name?.toLowerCase();
    //   this.logger.debug(`Allowed: ${pAction} on ${pSubject}`);
    // }

    for (const role of user.roles) {
      for (const perm of role.permissions) {
        if (!perm.status) continue;
        const pAction = perm.action.toLowerCase();
        const pSubject = perm.permission?.name?.toLowerCase();
        this.logger.debug(`Allowed: ${pAction} on ${pSubject}`);
      }
    }

    //handles the action AKA actual permission and subject AKA submodule,in can permission guard vs db driven data or input
    const canAccess = ability.can(action, subject);

    if (!canAccess) {
      throw new ForbiddenException(
        `You do not have permission to ${action} ${subject}`,
      );
    }

    return true;
  }
}
