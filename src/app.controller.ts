import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateAppSettingDto } from './app-settings.dto';
import { AppService } from './app.service';

@Controller('app')
@ApiTags('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('settings')
  createAppSettings(@Body() createAppSettingsDto: CreateAppSettingDto) {
    return this.appService.createAppSettings(createAppSettingsDto);
  }

  @Get('settings')
  getAppSettings() {
    return this.appService.getAppSettings();
  }
}
