import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardSummary() {
    return 'report';
    // const totalBeneficiaries = await this.prisma.beneficiary.count();
    // const totalTokens = await this.prisma.beneficiary.aggregate({
    //   _sum: {
    //     tokensClaimed: true,
    //   },
    // });
    // const totalProjects = await this.prisma.project.count();

    // return {
    //   totalBeneficiaries,
    //   totalTokens,
    //   totalProjects,
    // };
  }
}
