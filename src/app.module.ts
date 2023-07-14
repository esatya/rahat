import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from 'nestjs-prisma';
import { AbilitiesGuard } from './ability/abilities.guard';
import { AbilityModule } from './ability/ability.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthsModule } from './auths/auths.module';
import { BeneficiaryModule } from './beneficiary/beneficiary.module';
import { DistributorModule } from './distributor/distributor.module';
import { ProjectModule } from './project/project.module';
import { ReportsModule } from './reports/reports.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    PrismaModule.forRoot({ isGlobal: true }),
    UserModule,
    AbilityModule,
    ProjectModule,
    BeneficiaryModule,
    DistributorModule,
    ReportsModule,
    AuthsModule,
    TransactionsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env`],
      // load: [
      //   async () => {
      //     return {
      //       BAAL: 4400,
      //     };
      //   },
      // ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: AbilitiesGuard }],
})
export class AppModule {}
