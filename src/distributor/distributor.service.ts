import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { paginate } from '@utils/paginate';
import { hexStringToBuffer } from '@utils/string-format';
import { PrismaService } from 'nestjs-prisma';
import { CreateDistributorDto } from './dto/create-distributor.dto';
import { ListDistributorDto } from './dto/list-distributor.dto';
import { UpdateDistributorDto } from './dto/update-distributor.dto';

@Injectable()
export class DistributorService {
  constructor(private prisma: PrismaService) {}

  create(createDistributorDto: CreateDistributorDto) {
    return 'This action adds a new distributor';
  }

  findAll(query: ListDistributorDto) {
    const { page, perPage, ...rest } = query;

    const where: Prisma.DistributorWhereInput = { deletedAt: null };
    if (rest.name) {
      where.name = {
        contains: rest.name,
        mode: 'insensitive',
      };
    }
    const include: Prisma.DistributorInclude = {
      _count: {
        select: {
          projects: true,
        },
      },
      projects: {
        select: {
          name: true,
          id: true,
        },
      },
    };

    return paginate(
      this.prisma.distributor,
      { where, include },
      {
        page,
        perPage,
      },
    );
  }

  findOne(walletAddress: string) {
    return this.prisma.distributor.findUniqueOrThrow({
      where: {
        walletAddress: hexStringToBuffer(walletAddress),
      },
      include: {
        projects: {
          select: {
            name: true,
            id: true,
            isApproved: true,
            owner: {
              select: {
                name: true,
                id: true,
              },
            },
            projectType: true,
          },
        },
        _count: true,
      },
    });
  }

  update(walletAddress: string, updateDistributorDto: UpdateDistributorDto) {
    return this.prisma.distributor.update({
      where: {
        walletAddress: hexStringToBuffer(walletAddress),
      },
      data: updateDistributorDto,
    });
  }

  remove(walletAddress: string) {
    return this.prisma.distributor.update({
      where: {
        walletAddress: hexStringToBuffer(walletAddress),
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  approval(walletAddress: string) {
    return this.prisma.distributor.update({
      where: {
        walletAddress: hexStringToBuffer(walletAddress),
      },
      data: {
        isActive: true,
      },
    });
  }

  register(registerDistributorDto: any) {
    return 'This registers vendors';
  }
}
