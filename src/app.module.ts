import { Module } from '@nestjs/common';

import { APP_GUARD } from '@nestjs/core';
import { AbilitiesGuard } from './ability/abilities.guard';
import { AbilityModule } from './ability/ability.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [PrismaModule, UserModule, AbilityModule],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: AbilitiesGuard }],
})
export class AppModule {}
