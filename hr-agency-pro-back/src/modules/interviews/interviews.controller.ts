import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InterviewsService } from './interviews.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';

@ApiTags('interviews')
@ApiBearerAuth()
@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Get()
  @RequirePermissions('interviews:read')
  findAll() {
    return this.interviewsService.findAll();
  }

  @Get(':id')
  @RequirePermissions('interviews:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.interviewsService.findOne(id);
  }

  @Post()
  @RequirePermissions('interviews:create')
  create(@Body() dto: CreateInterviewDto) {
    return this.interviewsService.create(dto);
  }

  @Patch(':id')
  @RequirePermissions('interviews:update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInterviewDto,
  ) {
    return this.interviewsService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('interviews:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.interviewsService.remove(id);
  }

  @Post(':id/video-token')
  @RequirePermissions('interviews:read')
  generateVideoToken(
    @Param('id', ParseIntPipe) id: number,
    @Query('identity') identity: string,
  ) {
    return this.interviewsService.generateVideoToken(id, identity || 'guest');
  }
}
