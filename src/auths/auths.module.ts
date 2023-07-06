import { Module } from '@nestjs/common';
import { AuthsService } from './auths.service';
import { AuthsController } from './auths.controller';

@Module({
  controllers: [AuthsController],
  providers: [AuthsService]
})
export class AuthsModule {}
