import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobOpening } from './entities/job-opening.entity';
import { JobRequest } from './entities/job-request.entity';
import { JobApplication } from './entities/job-application.entity';
import { JobsService } from './jobs.service';
import {
  JobOpeningsController,
  JobRequestsController,
  JobApplicationsController,
} from './jobs.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobOpening, JobRequest, JobApplication]),
  ],
  controllers: [
    JobOpeningsController,
    JobRequestsController,
    JobApplicationsController,
  ],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
