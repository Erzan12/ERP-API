import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SECURITY_CLEARANCE_KEY } from './security-clearance.decorator';
import { AuthenticatedRequest } from 'src/utils/types/interface';

@Injectable()
export class SecurityClearanceGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredLevel = this.reflector.get<number>(
      SECURITY_CLEARANCE_KEY,
      context.getHandler(),
    );

    // If the route does not declare @SecurityClearance()
    if (!requiredLevel) return true;

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Not authenticated');
    }

    const userLevel = user.security_clearance_level ?? 0;

    if (userLevel < requiredLevel) {
      throw new ForbiddenException(
        `Security clearance Level ${requiredLevel} required. You only have Level ${userLevel}.`,
      );
    }

    return true;
  }
}
