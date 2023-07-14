import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';

@Module({
  controllers: [VendorsController],
  providers: [VendorsService],
  imports: [PrismaModule],
})
export class VendorsModule {}
