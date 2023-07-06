import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AbilityModule } from '../ability/ability.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [AbilityModule, PrismaModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
