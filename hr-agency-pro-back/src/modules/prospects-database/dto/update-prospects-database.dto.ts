import { PartialType } from '@nestjs/swagger';
import { CreateProspectsDatabaseDto } from './create-prospects-database.dto';

export class UpdateProspectsDatabaseDto extends PartialType(CreateProspectsDatabaseDto) {}
