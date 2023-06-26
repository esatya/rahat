import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AbilityModule } from '../ability/ability.module';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [AbilityModule, PrismaModule],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
