import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardSummary() {
    const totalBeneficiaries = await this.prisma.beneficiary.count();
    const totalTokens = await this.prisma.beneficiary.aggregate({
      _sum: {
        tokensAssigned: true,
        tokensClaimed: true,
      },
    });
    const totalProjects = await this.prisma.project.count();

    return {
      totalBeneficiaries,
      totalTokens,
      totalProjects,
    };
  }
}
