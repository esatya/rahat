import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BeneficiaryController } from './beneficiary.controller';
import { BeneficiaryService } from './beneficiary.service';

@Module({
  controllers: [BeneficiaryController],
  providers: [BeneficiaryService],
  imports: [PrismaModule],
})
export class BeneficiaryModule {}
