import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProspectsDatabaseService } from './prospects-database.service';
import { CreateProspectsDatabaseDto } from './dto/create-prospects-database.dto';
import { UpdateProspectsDatabaseDto } from './dto/update-prospects-database.dto';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';

@ApiTags('prospects-database')
@ApiBearerAuth()
@Controller('prospects-database')
export class ProspectsDatabaseController {
  constructor(
    private readonly prospectsDatabaseService: ProspectsDatabaseService,
  ) {}

  @Get()
  @RequirePermissions('prospects-database:read')
  findAll() {
    return this.prospectsDatabaseService.findAll();
  }

  @Get(':id')
  @RequirePermissions('prospects-database:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.prospectsDatabaseService.findOne(id);
  }

  @Post()
  @RequirePermissions('prospects-database:create')
  create(@Body() dto: CreateProspectsDatabaseDto) {
    return this.prospectsDatabaseService.create(dto);
  }

  @Patch(':id')
  @RequirePermissions('prospects-database:update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProspectsDatabaseDto,
  ) {
    return this.prospectsDatabaseService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('prospects-database:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.prospectsDatabaseService.remove(id);
  }
}
