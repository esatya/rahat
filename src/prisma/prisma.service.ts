// src/prisma/prisma.service.ts

import { INestApplication, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  // constructor() {
  //   // super();

  //   // super({
  //   //   log: [
  //   //     { emit: 'event', level: 'query' },
  //   //     { emit: 'stdout', level: 'info' },
  //   //     { emit: 'stdout', level: 'warn' },
  //   //     { emit: 'stdout', level: 'error' },
  //   //   ],
  //   //   errorFormat: 'colorless',
  //   // });\
  //   super();
  //   this.$use(async (params, next) => {
  //     console.log(params);
  //   });
  // }
  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
