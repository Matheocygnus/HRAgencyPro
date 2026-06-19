import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required || required.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();
    const permissions: string[] = user?.permissions || [];

    if (permissions.includes('*')) return true;

    const hasAll = required.every((perm) => {
      if (permissions.includes(perm)) return true;
      // Flat permission grants all sub-permissions: 'heroes' satisfies 'heroes:read', 'heroes:create', etc.
      const base = perm.includes(':') ? perm.split(':')[0] : null;
      return base !== null && permissions.includes(base);
    });
    if (!hasAll) throw new ForbiddenException('Insufficient permissions');
    return true;
  }
}
