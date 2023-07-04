import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateAppSettingDto, GetContractByNameDto } from './app-settings.dto';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  createAppSettings(createAppSettingsDto: CreateAppSettingDto) {
    return this.prisma.appSettings.create({
      data: createAppSettingsDto,
    });
  }

  getAppSettings(query: GetContractByNameDto) {
    const { name } = query;
    const where: Prisma.AppSettingsWhereInput = {};
    if (name) {
      where.name = {
        contains: name,
      };
    }

    return this.prisma.appSettings.findMany({ where });
  }

  getContracts() {
    return this.prisma.appSettings.findFirstOrThrow({
      where: {
        name: 'CONTRACT_ADDRESS',
      },
    });
  }

  getContractByName(contractName: string) {
    return this.prisma.appSettings.findFirstOrThrow({
      where: {
        name: 'CONTRACT_ADDRESS',
        value: {
          path: [contractName],
          string_contains: '0x0',
        },
      },
    });
  }
}
