import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { paginate } from '@utils/paginate';
import { hexStringToBuffer } from '@utils/string-format';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBeneficiaryDto } from './dto/create-beneficiary.dto';
import { ListBeneficiaryDto } from './dto/list-beneficiary.dto';
import {
  UpdateBeneficiaryBalanceDto,
  UpdateBeneficiaryDto,
} from './dto/update-beneficiary.dto';

@Injectable()
export class BeneficiaryService {
  constructor(private prisma: PrismaService) {}

  create(createBeneficiaryDto: CreateBeneficiaryDto) {
    let optional: { walletAddress: Buffer | null; project: any | null };
    console.log('createBeneficiaryDto', createBeneficiaryDto);

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
    console.log('optional', optional);

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

  findOne(walletAddress: string) {
    return this.prisma.beneficiary.findFirstOrThrow({
      where: {
        walletAddress: {
          equals: hexStringToBuffer(walletAddress),
        },
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

  update(id: number, updateBeneficiaryDto: UpdateBeneficiaryDto) {
    const bufferedWallet = hexStringToBuffer(
      updateBeneficiaryDto?.walletAddress,
    );
    return this.prisma.beneficiary.update({
      data: {
        ...updateBeneficiaryDto,
        walletAddress: bufferedWallet,
      },
      where: {
        id,
      },
    });
  }

  remove(id: number) {
    return this.prisma.beneficiary.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id,
      },
    });
  }

  overrideBalance(
    walletAddress: string,
    balanceUpdateData: UpdateBeneficiaryBalanceDto,
  ) {
    const updateData: Prisma.BeneficiaryUpdateInput = {};
    const { tokenAssigned, tokensClaimed } = balanceUpdateData;

    if (+tokenAssigned) {
      updateData.tokensAssigned = +tokenAssigned;
      updateData.isActive = +tokenAssigned > 0 ? true : false;
    }
    if (+tokensClaimed) {
      updateData.tokensClaimed = +tokensClaimed;
    }

    return this.prisma.beneficiary.update({
      data: updateData,
      where: {
        walletAddress: hexStringToBuffer(walletAddress),
      },
    });
  }
}
