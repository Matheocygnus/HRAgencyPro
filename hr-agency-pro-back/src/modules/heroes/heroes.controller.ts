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
import { HeroesService } from './heroes.service';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';

@ApiTags('heroes')
@ApiBearerAuth()
@Controller('heroes')
export class HeroesController {
  constructor(private readonly heroesService: HeroesService) {}

  @Get()
  @RequirePermissions('heroes:read')
  findAll(@Query('clientId', new ParseIntPipe({ optional: true })) clientId?: number) {
    return this.heroesService.findAll(clientId);
  }

  @Get(':id')
  @RequirePermissions('heroes:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.heroesService.findOne(id);
  }

  @Post()
  @RequirePermissions('heroes:create')
  create(@Body() dto: CreateHeroDto) {
    return this.heroesService.create(dto);
  }

  @Patch(':id')
  @RequirePermissions('heroes:update')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateHeroDto) {
    return this.heroesService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('heroes:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.heroesService.remove(id);
  }
}
