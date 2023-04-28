import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsService } from './projects/projects.service';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';
import { YModule } from './y/y.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [ProjectsModule, YModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, ProjectsService],
})
export class AppModule {}
