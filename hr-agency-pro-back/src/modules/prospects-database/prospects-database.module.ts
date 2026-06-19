import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProspectsDatabase } from './entities/prospects-database.entity';
import { ProspectsDatabaseService } from './prospects-database.service';
import { ProspectsDatabaseController } from './prospects-database.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProspectsDatabase])],
  controllers: [ProspectsDatabaseController],
  providers: [ProspectsDatabaseService],
  exports: [ProspectsDatabaseService],
})
export class ProspectsDatabaseModule {}
