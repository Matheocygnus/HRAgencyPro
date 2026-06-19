import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import configuration from './config/configuration';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { PermissionsGuard } from './common/guards/permissions.guard';

// Auth
import { AuthModule } from './auth/auth.module';

// Feature modules
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { ProspectsModule } from './modules/prospects/prospects.module';
import { HeroesModule } from './modules/heroes/heroes.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { InterviewsModule } from './modules/interviews/interviews.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { ProspectsDatabaseModule } from './modules/prospects-database/prospects-database.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

// Integration modules
import { TwilioModule } from './integrations/twilio/twilio.module';
import { StripeModule } from './integrations/stripe/stripe.module';
import { EmailModule } from './integrations/email/email.module';

// Entities
import { User } from './modules/users/entities/user.entity';
import { Role } from './modules/roles/entities/role.entity';
import { RefreshToken } from './auth/entities/refresh-token.entity';
import { Prospect } from './modules/prospects/entities/prospect.entity';
import { Hero } from './modules/heroes/entities/hero.entity';
import { Contract } from './modules/contracts/entities/contract.entity';
import { Invoice } from './modules/invoices/entities/invoice.entity';
import { Interview } from './modules/interviews/entities/interview.entity';
import { Company } from './modules/companies/entities/company.entity';
import { Client } from './modules/companies/entities/client.entity';
import { JobOpening } from './modules/jobs/entities/job-opening.entity';
import { JobRequest } from './modules/jobs/entities/job-request.entity';
import { JobApplication } from './modules/jobs/entities/job-application.entity';
import { ProspectsDatabase } from './modules/prospects-database/entities/prospects-database.entity';

const entities = [
  User,
  Role,
  RefreshToken,
  Prospect,
  Hero,
  Contract,
  Invoice,
  Interview,
  Company,
  Client,
  JobOpening,
  JobRequest,
  JobApplication,
  ProspectsDatabase,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('databaseUrl'),
        ssl: config.get<string>('databaseUrl')?.includes('neon.tech')
          ? { rejectUnauthorized: false }
          : false,
        synchronize: false,
        logging: config.get<string>('nodeEnv') === 'development',
        entities,
        migrations: [],
      }),
    }),
    // Integration modules (global — must be before modules that inject their services)
    TwilioModule,
    EmailModule,
    StripeModule,
    // Auth
    AuthModule,
    // Feature modules
    UsersModule,
    RolesModule,
    ProspectsModule,
    HeroesModule,
    ContractsModule,
    InvoicesModule,
    InterviewsModule,
    CompaniesModule,
    JobsModule,
    ProspectsDatabaseModule,
    DashboardModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
