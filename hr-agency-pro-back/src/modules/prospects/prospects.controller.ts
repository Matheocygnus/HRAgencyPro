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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ProspectsService } from './prospects.service';
import { CreateProspectDto } from './dto/create-prospect.dto';
import { UpdateProspectDto } from './dto/update-prospect.dto';
import { PromoteProspectDto } from './dto/promote-prospect.dto';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('prospects')
@ApiBearerAuth()
@Controller('prospects')
export class ProspectsController {
  constructor(private readonly prospectsService: ProspectsService) {}

  @Get('awaiting-approval')
  findAwaitingApproval(@CurrentUser() user: any) {
    if (!user?.clientId) throw new ForbiddenException('Only client users can access this endpoint');
    return this.prospectsService.findPendingApprovalForClient(user.clientId);
  }

  @Post(':id/client-approve')
  clientApprove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    if (!user?.clientId) throw new ForbiddenException('Only client users can approve prospects');
    return this.prospectsService.clientApprove(id, user.clientId);
  }

  @Post(':id/client-reject')
  clientReject(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
    @Body('reason') reason: string,
  ) {
    if (!user?.clientId) throw new ForbiddenException('Only client users can reject prospects');
    return this.prospectsService.clientReject(id, user.clientId, reason);
  }

  @Get()
  @RequirePermissions('prospects:read')
  findAll() {
    return this.prospectsService.findAll();
  }

  @Get(':id')
  @RequirePermissions('prospects:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.prospectsService.findOne(id);
  }

  @Post()
  @RequirePermissions('prospects:create')
  create(@Body() dto: CreateProspectDto) {
    return this.prospectsService.create(dto);
  }

  @Post('import')
  @RequirePermissions('prospects:create')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  importCsv(@UploadedFile() file: Express.Multer.File) {
    return this.prospectsService.importCsv(file.buffer);
  }

  @Patch(':id')
  @RequirePermissions('prospects:update')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProspectDto) {
    return this.prospectsService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('prospects:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.prospectsService.remove(id);
  }

  @Patch(':id/notes')
  @RequirePermissions('prospects:update')
  appendNote(
    @Param('id', ParseIntPipe) id: number,
    @Body('note') note: string,
  ) {
    return this.prospectsService.appendNote(id, note);
  }

  @Post(':id/send-resume')
  @RequirePermissions('prospects:update')
  sendResume(@Param('id', ParseIntPipe) id: number) {
    return this.prospectsService.sendResume(id);
  }

  @Post(':id/reject')
  @RequirePermissions('prospects:update')
  reject(
    @Param('id', ParseIntPipe) id: number,
    @Body('reason') reason: string,
  ) {
    return this.prospectsService.rejectProspect(id, reason);
  }

  @Post(':id/promote')
  @RequirePermissions('prospects:update')
  promote(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PromoteProspectDto,
  ) {
    return this.prospectsService.promoteToHero(id, dto);
  }

  @Patch(':id/resume')
  @RequirePermissions('prospects:update')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (process.env.UPLOAD_DIR || './uploads') + '/prospects',
        filename: (_req, file, cb) =>
          cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`),
      }),
    }),
  )
  uploadResume(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.prospectsService.updateResume(id, file.filename);
  }
}
