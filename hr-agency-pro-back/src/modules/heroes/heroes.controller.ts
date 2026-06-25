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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HeroesService } from './heroes.service';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('heroes')
@ApiBearerAuth()
@Controller('heroes')
export class HeroesController {
  constructor(private readonly heroesService: HeroesService) {}

  @Get()
  @RequirePermissions('heroes:read')
  findAll(@CurrentUser() user: any) {
    if (user?.heroId) throw new ForbiddenException('Heroes cannot access the full hero list');
    if (user?.clientId) return this.heroesService.findAll(user.clientId);
    return this.heroesService.findAll();
  }

  @Get(':id')
  @RequirePermissions('heroes:read')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    if (user?.heroId && user.heroId !== id) {
      throw new ForbiddenException('Heroes can only view their own profile');
    }
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
