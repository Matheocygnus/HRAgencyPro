import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, randomBytes, scrypt as scryptCb } from 'crypto';
import { promisify } from 'util';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { RefreshToken } from './entities/refresh-token.entity';
import { User } from '../modules/users/entities/user.entity';
import type { StringValue } from 'ms';

const scrypt = promisify<string, string, number, Buffer>(scryptCb as any);

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(':');
  const derived = await scrypt(plain, salt, 64);
  return derived.toString('hex') === hash;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepo: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
        email: true,
        firstName: true,
        lastName: true,
        roleId: true,
        clientId: true,
        heroId: true,
      },
      relations: { role: true },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await verifyPassword(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login(user: User): Promise<{ access_token: string; refresh_token: string }> {
    const permissions = user.role?.permissions || [];

    const accessToken = this.jwtService.sign(
      { sub: user.id, username: user.username, roleId: user.roleId, permissions, clientId: user.clientId ?? null, heroId: user.heroId ?? null },
      {
        secret: this.configService.get<string>('jwt.accessSecret'),
        expiresIn: this.configService.get<string>('jwt.accessExpires') as StringValue,
      },
    );

    const jti = randomUUID();
    const refreshToken = this.jwtService.sign(
      { sub: user.id, jti },
      {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('jwt.refreshExpires') as StringValue,
      },
    );

    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokenRepo.save(
      this.refreshTokenRepo.create({ tokenHash, userId: user.id, expiresAt }),
    );

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async refresh(refreshToken: string): Promise<{ access_token: string; refresh_token: string }> {
    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokenHash = hashToken(refreshToken);
    const stored = await this.refreshTokenRepo.findOne({ where: { tokenHash } });

    if (!stored || stored.revoked || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }

    const user = await this.userRepo.findOne({
      where: { id: payload.sub },
      relations: { role: true },
    });
    if (!user) throw new UnauthorizedException('User not found');

    const newPair = await this.login(user);

    stored.revoked = true;
    stored.replacedByTokenHash = hashToken(newPair.refresh_token);
    await this.refreshTokenRepo.save(stored);

    return newPair;
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokenHash = hashToken(refreshToken);
    const stored = await this.refreshTokenRepo.findOne({ where: { tokenHash } });
    if (stored) {
      stored.revoked = true;
      await this.refreshTokenRepo.save(stored);
    }
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: { id: true, password: true },
    });
    if (!user) throw new UnauthorizedException('User not found');

    const valid = await verifyPassword(currentPassword, user.password);
    if (!valid) throw new BadRequestException('Current password is incorrect');

    const salt = randomBytes(16).toString('hex');
    const hash = await scrypt(newPassword, salt, 64);
    user.password = `${salt}:${hash.toString('hex')}`;
    await this.userRepo.save(user);
  }

  async getMe(userId: number): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { role: true },
    });
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }
}
