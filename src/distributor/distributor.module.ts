import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DistributorController } from './distributor.controller';
import { DistributorService } from './distributor.service';

@Module({
  controllers: [DistributorController],
  providers: [DistributorService],
  imports: [PrismaModule],
})
export class DistributorModule {}
