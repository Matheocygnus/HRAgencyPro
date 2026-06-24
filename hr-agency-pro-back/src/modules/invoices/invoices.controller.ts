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
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('invoices')
@ApiBearerAuth()
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  @RequirePermissions('invoices:read')
  findAll(@CurrentUser() user: any) {
    const permissions: string[] = user?.permissions ?? []
    const hasFullAccess = permissions.includes('invoices') || permissions.includes('*')
    if (hasFullAccess) return this.invoicesService.findAll()
    // Client role: scope to their clientId; if not set, return nothing (never leak)
    const clientId: number | undefined = user?.clientId ?? undefined
    if (!clientId) return []
    return this.invoicesService.findAll({ clientId })
  }

  @Get('next-number')
  @RequirePermissions('invoices:read')
  async getNextNumber() {
    const invoiceNumber = await this.invoicesService.previewNextNumber();
    return { invoiceNumber };
  }

  @Get(':id')
  @RequirePermissions('invoices:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.invoicesService.findOne(id);
  }

  @Post()
  @RequirePermissions('invoices:create')
  create(@Body() dto: CreateInvoiceDto) {
    return this.invoicesService.create(dto);
  }

  @Patch(':id')
  @RequirePermissions('invoices:update')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateInvoiceDto) {
    return this.invoicesService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('invoices:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.invoicesService.remove(id);
  }
}
