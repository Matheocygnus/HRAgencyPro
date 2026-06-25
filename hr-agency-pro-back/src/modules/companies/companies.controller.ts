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
import { CompaniesService } from './companies.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('clients')
@ApiBearerAuth()
@Controller('clients')
export class ClientsController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @RequirePermissions('companies:read')
  findAll() {
    return this.companiesService.findAllClients();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    const canRead = user?.permissions?.includes('*') ||
      user?.permissions?.includes('companies:read') ||
      user?.clientId === id;
    if (!canRead) throw new ForbiddenException('Insufficient permissions');
    return this.companiesService.findOneClient(id);
  }

  @Post()
  @RequirePermissions('companies:create')
  create(@Body() dto: CreateClientDto) {
    return this.companiesService.createClient(dto);
  }

  @Patch(':id')
  @RequirePermissions('companies:update')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateClientDto) {
    return this.companiesService.updateClient(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('companies:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.companiesService.removeClient(id);
  }
}

@ApiTags('companies')
@ApiBearerAuth()
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @RequirePermissions('companies:read')
  findAll() {
    return this.companiesService.findAllCompanies();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    const hasFullAccess =
      user?.permissions?.includes('*') || user?.permissions?.includes('companies:read');
    if (hasFullAccess) return this.companiesService.findOneCompany(id);
    if (user?.clientId != null) {
      const company = await this.companiesService.findOneCompany(id);
      if (company.clientId !== user.clientId) throw new ForbiddenException('Access denied');
      return company;
    }
    throw new ForbiddenException('Insufficient permissions');
  }

  @Post()
  @RequirePermissions('companies:create')
  create(@Body() dto: CreateCompanyDto) {
    return this.companiesService.createCompany(dto);
  }

  @Patch(':id')
  @RequirePermissions('companies:update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCompanyDto,
  ) {
    return this.companiesService.updateCompany(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('companies:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.companiesService.removeCompany(id);
  }
}
