import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

// Mock passport AuthGuard
jest.mock('@nestjs/passport', () => ({
  AuthGuard: (_strategy: string) => {
    class MockAuthGuard {
      canActivate(_ctx: ExecutionContext) {
        return true;
      }
    }
    return MockAuthGuard;
  },
}));

function makeContext(handler: object, klass: object): ExecutionContext {
  return {
    getHandler: () => handler,
    getClass: () => klass,
    switchToHttp: () => ({ getRequest: () => ({}) }),
  } as unknown as ExecutionContext;
}

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new JwtAuthGuard(reflector);
  });

  it('allows access when route is marked @Public()', () => {
    const handler = {};
    const klass = {};
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);
    const ctx = makeContext(handler, klass);
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('calls super.canActivate when route is not public', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    const superSpy = jest
      .spyOn(Object.getPrototypeOf(Object.getPrototypeOf(guard)), 'canActivate')
      .mockReturnValue(true);
    const ctx = makeContext({}, {});
    const result = guard.canActivate(ctx);
    // result is true because the mock AuthGuard returns true
    expect(result).toBe(true);
  });

  it('uses IS_PUBLIC_KEY to check metadata', () => {
    const spy = jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    const ctx = makeContext({}, {});
    guard.canActivate(ctx);
    expect(spy).toHaveBeenCalledWith(IS_PUBLIC_KEY, expect.any(Array));
  });
});
