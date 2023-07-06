import { Module } from '@nestjs/common';

import { APP_GUARD } from '@nestjs/core';
import { AbilitiesGuard } from './ability/abilities.guard';
import { AbilityModule } from './ability/ability.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BeneficiaryModule } from './beneficiary/beneficiary.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectModule } from './project/project.module';
import { UserModule } from './user/user.module';
import { DistributorModule } from './distributor/distributor.module';
import { ReportsModule } from './reports/reports.module';
import { AuthsModule } from './auths/auths.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AbilityModule,
    ProjectModule,
    BeneficiaryModule,
    DistributorModule,
    ReportsModule,
    AuthsModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: AbilitiesGuard }],
})
export class AppModule {}
