import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsGuard } from './permissions.guard';
import { PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';

function makeContext(user: object, handler: object = {}, klass: object = {}): ExecutionContext {
  return {
    getHandler: () => handler,
    getClass: () => klass,
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  } as unknown as ExecutionContext;
}

describe('PermissionsGuard', () => {
  let guard: PermissionsGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new PermissionsGuard(reflector);
  });

  it('allows access when no permissions are required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    const ctx = makeContext({ permissions: [] });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it("allows access when user has wildcard '*' permission", () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['prospects:read']);
    const ctx = makeContext({ permissions: ['*'] });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('allows access when user has all required permissions', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['prospects:read', 'prospects:create']);
    const ctx = makeContext({ permissions: ['prospects:read', 'prospects:create', 'jobs:read'] });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('throws ForbiddenException when user lacks a required permission', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['prospects:delete']);
    const ctx = makeContext({ permissions: ['prospects:read'] });
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('throws ForbiddenException when user has no permissions', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['invoices:read']);
    const ctx = makeContext({ permissions: [] });
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('uses PERMISSIONS_KEY for metadata lookup', () => {
    const spy = jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    const ctx = makeContext({ permissions: [] });
    guard.canActivate(ctx);
    expect(spy).toHaveBeenCalledWith(PERMISSIONS_KEY, expect.any(Array));
  });
});
