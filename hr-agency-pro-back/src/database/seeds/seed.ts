import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../../modules/roles/entities/role.entity';
import { User } from '../../modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { randomBytes, scrypt as scryptCb } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify<string, string, number, Buffer>(scryptCb as any);

async function hashPassword(plain: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const hash = await scrypt(plain, salt, 64);
  return `${salt}:${hash.toString('hex')}`;
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const roleRepo = app.get<Repository<Role>>(getRepositoryToken(Role));
  const userRepo = app.get<Repository<User>>(getRepositoryToken(User));

  const roleDefs = [
    { name: 'admin', permissions: ['*'] },
    {
      name: 'recruiter',
      permissions: [
        'prospects:read',
        'prospects:create',
        'prospects:update',
        'interviews:read',
        'interviews:create',
        'jobs:read',
        'clients:read',
        'companies:read',
      ],
    },
    {
      name: 'client',
      permissions: ['heroes:read', 'contracts:read', 'invoices:read'],
    },
  ];

  for (const def of roleDefs) {
    const existing = await roleRepo.findOne({ where: { name: def.name } });
    if (existing) {
      console.log(`Role '${def.name}' already exists — skipping`);
    } else {
      await roleRepo.save(roleRepo.create(def));
      console.log(`Role '${def.name}' created`);
    }
  }

  const adminRole = await roleRepo.findOne({ where: { name: 'admin' } });
  if (!adminRole) throw new Error('Admin role not found after seed');

  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!adminPassword) throw new Error('SEED_ADMIN_PASSWORD env var is required');

  const existing = await userRepo.findOne({ where: { username: 'admin' } });
  if (existing) {
    console.log('User admin already exists — skipping');
  } else {
    const password = await hashPassword(adminPassword);
    await userRepo.save(
      userRepo.create({
        username: 'admin',
        email: 'admin@hragency.com',
        password,
        firstName: 'Admin',
        lastName: 'User',
        roleId: adminRole.id,
      }),
    );
    console.log('User admin created');
  }

  await app.close();
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
