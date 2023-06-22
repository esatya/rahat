import { ResponseHandler } from '@decorators';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller('api/v1/app')
@ApiTags('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @ResponseHandler()
  create(@Body() createAppDto) {
    return '';
  }
}
