import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { CreateJobOpeningDto } from './dto/create-job-opening.dto';
import { UpdateJobOpeningDto } from './dto/update-job-opening.dto';
import { CreateJobRequestDto } from './dto/create-job-request.dto';
import { UpdateJobRequestDto } from './dto/update-job-request.dto';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { UpdateJobApplicationDto } from './dto/update-job-application.dto';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

// ---- Job Openings ----

@ApiTags('job-openings')
@ApiBearerAuth()
@Controller('job-openings')
export class JobOpeningsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @Public()
  findAll() {
    return this.jobsService.findAllOpenings();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobsService.findOneOpening(id);
  }

  @Post()
  @RequirePermissions('jobs:create')
  create(@Body() dto: CreateJobOpeningDto) {
    return this.jobsService.createOpening(dto);
  }

  @Post('generate-from-request/:requestId')
  @RequirePermissions('jobs:create')
  generateFromRequest(@Param('requestId', ParseIntPipe) requestId: number) {
    return this.jobsService.generateFromRequest(requestId);
  }

  @Patch(':id')
  @RequirePermissions('jobs:update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateJobOpeningDto,
  ) {
    return this.jobsService.updateOpening(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('jobs:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.jobsService.removeOpening(id);
  }
}

// ---- Job Requests ----

@ApiTags('job-requests')
@ApiBearerAuth()
@Controller('job-requests')
export class JobRequestsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @RequirePermissions('jobs:read')
  findAll() {
    return this.jobsService.findAllRequests();
  }

  @Get(':id')
  @RequirePermissions('jobs:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobsService.findOneRequest(id);
  }

  @Post()
  @RequirePermissions('jobs:create')
  create(@Body() dto: CreateJobRequestDto) {
    return this.jobsService.createRequest(dto);
  }

  @Patch(':id')
  @RequirePermissions('jobs:update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateJobRequestDto,
  ) {
    return this.jobsService.updateRequest(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('jobs:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.jobsService.removeRequest(id);
  }

  @Delete(':id/cancel')
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { clientId?: number },
  ) {
    if (!user?.clientId) {
      throw new ForbiddenException('Only clients can cancel requests');
    }
    return this.jobsService.cancelRequest(id, user.clientId);
  }
}

// ---- Job Applications ----

@ApiTags('job-applications')
@Controller('job-applications')
export class JobApplicationsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @ApiBearerAuth()
  @RequirePermissions('jobs:read')
  findAll() {
    return this.jobsService.findAllApplications();
  }

  @Get(':id')
  @ApiBearerAuth()
  @RequirePermissions('jobs:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobsService.findOneApplication(id);
  }

  @Post()
  @Public()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'resume', maxCount: 1 },
        { name: 'voiceMessage', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (process.env.UPLOAD_DIR || './uploads') + '/jobs',
          filename: (_req, file, cb) =>
            cb(
              null,
              `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`,
            ),
        }),
      },
    ),
  )
  create(
    @Body() dto: CreateJobApplicationDto,
    @UploadedFiles()
    files: {
      resume?: Express.Multer.File[];
      voiceMessage?: Express.Multer.File[];
    },
  ) {
    const resumeUrl = files?.resume?.[0]?.filename;
    const voiceMessageUrl = files?.voiceMessage?.[0]?.filename;
    return this.jobsService.createApplication(dto, resumeUrl, voiceMessageUrl);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @RequirePermissions('jobs:update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateJobApplicationDto,
  ) {
    return this.jobsService.updateApplication(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @RequirePermissions('jobs:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.jobsService.removeApplication(id);
  }
}
