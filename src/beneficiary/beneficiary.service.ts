import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { paginate } from '@utils/paginate';
import { hexStringToBuffer, stringifyWithBigInt } from '@utils/string-format';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBeneficiaryDto } from './dto/create-beneficiary.dto';
import {
  ListBeneficiaryDto,
  ListBeneficiaryTransactionsDto,
} from './dto/list-beneficiary.dto';
import {
  UpdateBeneficiaryDto,
  UpdateBeneficiaryStatusDto,
} from './dto/update-beneficiary.dto';

@Injectable()
export class BeneficiaryService {
  constructor(private prisma: PrismaService) {
    // prisma.$on<any>('query', (event: Prisma.QueryEvent) => {
    //   console.log('Query: ' + event.query);
    //   console.log('Duration: ' + event.duration + 'ms');
    // });
  }

  create(createBeneficiaryDto: CreateBeneficiaryDto) {
    let optional: { walletAddress: Buffer | null; project: any | null };

    if (createBeneficiaryDto.walletAddress) {
      optional.walletAddress = hexStringToBuffer(
        createBeneficiaryDto.walletAddress,
      );
    }
    if (createBeneficiaryDto.projectId) {
      optional.project = {
        connect: {
          id: +createBeneficiaryDto.projectId,
        },
      };
    }

    return this.prisma.beneficiary.create({
      data: {
        ...createBeneficiaryDto,
        ...optional,
      },
    });
  }

  findAll(query: ListBeneficiaryDto) {
    const { page, perPage, ...rest } = query;
    const where: Prisma.BeneficiaryWhereInput = {
      deletedAt: null,
    };
    const include: Prisma.BeneficiaryInclude = {
      _count: {
        select: {
          projects: true,
        },
      },
    };

    if (rest.name) {
      where.name = {
        contains: rest.name,
        mode: 'insensitive',
      };
    }

    if (rest.isActive) {
      where.isActive = {
        equals: rest.isActive,
      };
    }

    if (rest.isTokenAssigned) {
      where.tokensAssigned = {
        gt: 0,
      };
    }

    return paginate(
      this.prisma.beneficiary,
      { where, include },
      {
        page,
        perPage,
      },
    );
  }

  findOne(uuid: string) {
    return this.prisma.beneficiary.findFirstOrThrow({
      where: {
        uuid,
        deletedAt: null,
      },
      include: {
        _count: {
          select: {
            projects: true,
          },
        },
        projects: true,
      },
    });
  }

  update(uuid: string, updateBeneficiaryDto: UpdateBeneficiaryDto) {
    const bufferedWallet = hexStringToBuffer(
      updateBeneficiaryDto?.walletAddress,
    );
    return this.prisma.beneficiary.update({
      data: {
        ...updateBeneficiaryDto,
        walletAddress: bufferedWallet,
      },
      where: {
        uuid,
      },
    });
  }

  remove(uuid: string) {
    return this.prisma.beneficiary.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        uuid,
      },
    });
  }

  getTransactions(uuid: string, query: ListBeneficiaryTransactionsDto) {
    const { page, perPage } = query;

    const where: Prisma.BeneficiaryWhereInput = {
      uuid,
    };

    const select: Prisma.BeneficiarySelect = {
      uuid: true,
      transactions: true,
      _count: {
        select: {
          transactions: true,
        },
      },
    };

    return paginate(
      this.prisma.beneficiary,
      {
        where,
        select,
      },
      {
        page,
        perPage,
      },
    );
  }

  assignProject(uuid: string, projectId: number) {
    return this.prisma.beneficiary.update({
      data: {
        projects: {
          connect: {
            id: projectId,
          },
        },
      },
      where: {
        uuid,
      },
    });
  }

  async getGeoLocation() {
    const ben = await this.prisma.beneficiary.findMany({
      select: {
        latitude: true,
        longitude: true,
      },
    });
    return ben;
  }

  async getStats() {
    let totalCount = await this.prisma.$queryRaw`
  SELECT
    SUM(CASE WHEN "gender" = 'MALE' THEN 1 ELSE 0 END) as "maleCount",
    SUM(CASE WHEN "gender" = 'FEMALE' THEN 1 ELSE 0 END) as "femaleCount",
    SUM(CASE WHEN "gender" = 'OTHERS' THEN 1 ELSE 0 END) as "othersCount",
    SUM(CASE WHEN "gender" = 'UNKNOWN' THEN 1 ELSE 0 END) as "unknownCount",
    SUM(CASE WHEN "bankStatus" = 'UNKNOWN' THEN 1 ELSE 0 END) as "unknownBankCount",
    SUM(CASE WHEN "bankStatus" = 'UNBANKED' THEN 1 ELSE 0 END) as "unbankedCount",
    SUM(CASE WHEN "bankStatus" = 'BANKED' THEN 1 ELSE 0 END) as "bankedCount",
    SUM(CASE WHEN "bankStatus" = 'UNDERBANKED' THEN 1 ELSE 0 END) as "underbankedCount",
    SUM(CASE WHEN "phoneStatus" = 'UNKNOWN' THEN 1 ELSE 0 END) as "unknownPhoneCount",
    SUM(CASE WHEN "phoneStatus" = 'NO_PHONE' THEN 1 ELSE 0 END) as "noPhoneCount",
    SUM(CASE WHEN "phoneStatus" = 'FEATURE_PHONE' THEN 1 ELSE 0 END) as "featurePhoneCount",
    SUM(CASE WHEN "phoneStatus" = 'SMART_PHONE' THEN 1 ELSE 0 END) as "smartPhoneCount",
    SUM(CASE WHEN "internetStatus" = 'UNKNOWN' THEN 1 ELSE 0 END) as "unknownInternetCount",
    SUM(CASE WHEN "internetStatus" = 'NO_INTERNET' THEN 1 ELSE  0 END) as "noInternetCount",
    SUM(CASE WHEN "internetStatus" = 'PHONE_INTERNET' THEN 1 ELSE 0 END) as "phoneInternetCount",
    SUM(CASE WHEN "internetStatus" = 'HOME_INTERNET' THEN 1 ELSE 0 END) as "homeInternetCount"
  FROM "Beneficiary"
`;

    totalCount = stringifyWithBigInt(totalCount);

    const gender = {
      MALE: totalCount[0].maleCount,
      FEMALE: totalCount[0].femaleCount,
      OTHERS: totalCount[0].othersCount,
      UNKNOWN: totalCount[0].unknownCount,
    };

    const bankStatus = {
      UNKNOWN: totalCount[0].unknownBankCount,
      UNBANKED: totalCount[0].unbankedCount,
      BANKED: totalCount[0].bankedCount,
      UNDERBANKED: totalCount[0].underbankedCount,
    };

    const phoneStatus = {
      UNKNOWN: totalCount[0].unknownPhoneCount,
      NO_PHONE: totalCount[0].noPhoneCount,
      FEATURE_PHONE: totalCount[0].featurePhoneCount,
      SMART_PHONE: totalCount[0].smartPhoneCount,
    };

    const internetStatus = {
      UNKNOWN: totalCount[0].unknownInternetCount,
      NO_INTERNET: totalCount[0].noInternetCount,
      PHONE_INTERNET: totalCount[0].phoneInternetCount,
      HOME_INTERNET: totalCount[0].homeInternetCount,
    };

    const groups = {
      gender,
      internetStatus,
      phoneStatus,
      bankStatus,
    };

    return groups;
  }

  async updateStatus(uuid: string, updateDto: UpdateBeneficiaryStatusDto) {
    return this.prisma.beneficiary.update({
      where: {
        uuid,
      },
      data: {
        isApproved: updateDto.isApproved,
      },
    });
  }
}
