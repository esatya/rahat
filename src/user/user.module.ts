import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AbilityModule } from '../ability/ability.module';

@Module({
  imports: [AbilityModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
