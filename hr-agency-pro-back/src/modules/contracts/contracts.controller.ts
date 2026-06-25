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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('contracts')
@ApiBearerAuth()
@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get()
  @RequirePermissions('contracts:read')
  findAll(
    @CurrentUser() user: any,
    @Query('heroId') heroId?: string,
    @Query('clientId') clientId?: string,
  ) {
    // Hero role: enforce own heroId from JWT — never trust query params for scoping
    const effectiveHeroId = user.heroId != null ? user.heroId : (heroId ? +heroId : undefined);
    // Client role: enforce own clientId from JWT — prevent horizontal privilege escalation
    const effectiveClientId = user.clientId != null ? user.clientId : (clientId ? +clientId : undefined);
    return this.contractsService.findAll({
      heroId: effectiveHeroId,
      clientId: effectiveClientId,
    });
  }

  @Get(':id')
  @RequirePermissions('contracts:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contractsService.findOne(id);
  }

  @Post()
  @RequirePermissions('contracts:create')
  create(@Body() dto: CreateContractDto) {
    return this.contractsService.create(dto);
  }

  @Patch(':id')
  @RequirePermissions('contracts:update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateContractDto,
  ) {
    return this.contractsService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('contracts:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contractsService.remove(id);
  }

  @Patch(':id/document')
  @RequirePermissions('contracts:update')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (process.env.UPLOAD_DIR || './uploads') + '/contracts',
        filename: (_req, file, cb) =>
          cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`),
      }),
    }),
  )
  uploadDocument(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.contractsService.updateDocument(id, file.filename);
  }
}
