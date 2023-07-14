import { Module } from '@nestjs/common';
import { BeneficiaryController } from './beneficiary.controller';
import { BeneficiaryService } from './beneficiary.service';

@Module({
  controllers: [BeneficiaryController],
  providers: [BeneficiaryService],
})
export class BeneficiaryModule {}
