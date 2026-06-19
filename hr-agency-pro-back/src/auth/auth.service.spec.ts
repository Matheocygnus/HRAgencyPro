import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { randomBytes, scrypt as scryptCb } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify<string, string, number, Buffer>(scryptCb as any);

async function hashPassword(plain: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const hash = await scrypt(plain, salt, 64);
  return `${salt}:${hash.toString('hex')}`;
}

function makeRepoMock() {
  return {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn((dto) => dto),
  };
}

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: ReturnType<typeof makeRepoMock>;
  let refreshTokenRepo: ReturnType<typeof makeRepoMock>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(() => {
    userRepo = makeRepoMock();
    refreshTokenRepo = makeRepoMock();

    jwtService = {
      sign: jest.fn().mockReturnValue('signed-token'),
      verify: jest.fn(),
    } as any;

    configService = {
      get: jest.fn().mockImplementation((key: string) => {
        const map: Record<string, string> = {
          'jwt.accessSecret': 'access-secret',
          'jwt.refreshSecret': 'refresh-secret',
          'jwt.accessExpires': '8h',
          'jwt.refreshExpires': '7d',
        };
        return map[key] || '';
      }),
    } as any;

    service = new AuthService(
      userRepo as any,
      refreshTokenRepo as any,
      jwtService,
      configService,
    );
  });

  describe('validateUser', () => {
    it('returns user on valid credentials', async () => {
      const password = await hashPassword('secret');
      const mockUser = {
        id: 1,
        username: 'admin',
        password,
        roleId: 1,
        role: { permissions: ['*'] },
      };
      userRepo.findOne.mockResolvedValue(mockUser);

      const result = await service.validateUser('admin', 'secret');
      expect(result).toBe(mockUser);
    });

    it('throws UnauthorizedException for wrong password', async () => {
      const password = await hashPassword('correct');
      const mockUser = { id: 1, username: 'admin', password, roleId: 1, role: { permissions: [] } };
      userRepo.findOne.mockResolvedValue(mockUser);

      await expect(service.validateUser('admin', 'wrong')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException when user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);
      await expect(service.validateUser('ghost', 'pass')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('login', () => {
    it('returns access and refresh tokens', async () => {
      const mockUser = {
        id: 1,
        username: 'admin',
        roleId: 1,
        role: { permissions: ['*'] },
      };

      refreshTokenRepo.save.mockResolvedValue({});

      const result = await service.login(mockUser as any);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
    });
  });

  describe('refresh', () => {
    it('rotates tokens on valid refresh', async () => {
      const fakeRefreshToken = 'valid-refresh-token';
      jwtService.verify = jest.fn().mockReturnValue({ sub: 1, jti: 'uuid' });

      const storedToken = {
        id: 10,
        tokenHash: expect.any(String),
        userId: 1,
        revoked: false,
        expiresAt: new Date(Date.now() + 100000),
        replacedByTokenHash: null,
      };
      refreshTokenRepo.findOne.mockResolvedValue(storedToken);

      const mockUser = {
        id: 1,
        username: 'admin',
        roleId: 1,
        role: { permissions: ['*'] },
      };
      userRepo.findOne.mockResolvedValue(mockUser);
      refreshTokenRepo.save.mockResolvedValue({});

      const result = await service.refresh(fakeRefreshToken);
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
    });

    it('throws UnauthorizedException for revoked token', async () => {
      jwtService.verify = jest.fn().mockReturnValue({ sub: 1, jti: 'uuid' });
      refreshTokenRepo.findOne.mockResolvedValue({
        revoked: true,
        expiresAt: new Date(Date.now() + 100000),
      });

      await expect(service.refresh('revoked-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException for expired stored token', async () => {
      jwtService.verify = jest.fn().mockReturnValue({ sub: 1, jti: 'uuid' });
      refreshTokenRepo.findOne.mockResolvedValue({
        revoked: false,
        expiresAt: new Date(Date.now() - 1000),
      });

      await expect(service.refresh('expired-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException when JWT verification fails', async () => {
      jwtService.verify = jest.fn().mockImplementation(() => {
        throw new Error('jwt expired');
      });

      await expect(service.refresh('bad-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
