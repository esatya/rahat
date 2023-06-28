import { Injectable } from '@nestjs/common';
import { CreateAppSettingDto } from './app-settings.dto';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  createAppSettings(createAppSettingsDto: CreateAppSettingDto) {
    return this.prisma.appSettings.create({
      data: createAppSettingsDto,
    });
  }

  getAppSettings() {
    return this.prisma.appSettings.findMany();
  }
}
