import { Module } from '@nestjs/common';
import { AbilityModule } from '../ability/ability.module';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [AbilityModule],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
