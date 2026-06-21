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
        'prospects',    // full prospect CRUD + page access
        'interviews',   // full interview CRUD + page access
        'jobs',         // full job CRUD + page access
        'companies',    // full company + client CRUD + page access
        'heroes',       // full hero CRUD + page access
        'contracts',    // full contract CRUD + page access
        'invoices',     // full invoice CRUD + page access
        'job-requests', // job-requests page access
      ],
    },
    {
      name: 'client',
      permissions: [
        'client_dashboard', // client dashboard + invoices read-only access
        'heroes:read',      // heroes list in read-only mode
        'contracts:read',   // contracts shown in dashboard tab
        'invoices:read',    // invoices shown via client_dashboard check
        'job-requests',     // job-requests page access
        'jobs:read',        // jobs page read-only access
        'jobs:create',      // ability to create job requests
      ],
    },
  ];

  for (const def of roleDefs) {
    const existing = await roleRepo.findOne({ where: { name: def.name } });
    if (existing) {
      existing.permissions = def.permissions;
      await roleRepo.save(existing);
      console.log(`Role '${def.name}' updated`);
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
