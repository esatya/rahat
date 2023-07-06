import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { paginate } from '@utils/paginate';
import { hexStringToBuffer } from '@utils/string-format';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ListProjectDto } from './dto/list-project-dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  create(createProjectDto: CreateProjectDto) {
    const { owner, contractAddress, ...rest } = createProjectDto;

    // contractAddress =
    return this.prisma.project.create({
      data: {
        ...rest,

        contractAddress: Buffer.from(contractAddress.substring(2), 'hex'),
        owner: {
          connect: {
            id: owner,
          },
        },
      },
    });
  }

  findAll(query: ListProjectDto) {
    const { page, perPage, ...rest } = query;
    const where: Prisma.ProjectWhereInput = {
      deletedAt: null,
    };
    const include: Prisma.ProjectInclude = {
      owner: {
        select: {
          id: true,
          name: true,
          walletAddress: true,
        },
      },
      _count: {
        select: {
          beneficiaries: true,
          owner: true,
          vendors: true,
        },
      },
    };

    if (rest.name) {
      where.name = {
        contains: rest.name,
        mode: 'insensitive',
      };
    }

    return paginate(
      this.prisma.project,
      { where, include },
      {
        page,
        perPage,
      },
    );
  }

  findOne(contractAddress: string) {
    return this.prisma.project.findFirstOrThrow({
      where: {
        contractAddress: {
          equals: hexStringToBuffer(contractAddress),
        },
      },
      include: {
        _count: {
          select: {
            beneficiaries: true,
            owner: true,
            vendors: true,
          },
        },
      },
    });
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const { owner, contractAddress, ...rest } = updateProjectDto;

    return this.prisma.project.update({
      data: {
        ...rest,
        contractAddress: hexStringToBuffer(contractAddress),
        owner: {
          connect: {
            id: owner,
          },
        },
      },
      where: {
        id,
      },
    });
  }

  remove(id: number) {
    return this.prisma.project.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id,
      },
    });
  }

  getBeneficiaries(address: string) {
    return this.prisma.project.findUniqueOrThrow({
      where: {
        contractAddress: hexStringToBuffer(address),
      },
      select: {
        _count: {
          select: {
            beneficiaries: true,
          },
        },
        contractAddress: true,
        beneficiaries: true,
      },
    });
  }
}
