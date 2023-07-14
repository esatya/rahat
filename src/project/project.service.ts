import { Injectable } from '@nestjs/common';
import { Prisma, Project } from '@prisma/client';
import { paginate } from '@utils/paginate';
import { bufferToHexString, hexStringToBuffer } from '@utils/string-format';
import { PrismaService } from 'nestjs-prisma';
import { CreateProjectDto } from './dto/create-project.dto';
import { ListProjectDto } from './dto/list-project-dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto) {
    const { owner, contractAddress, ...rest } = createProjectDto;

    // contractAddress =
    const created: Project = await this.prisma.project.create({
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

    return {
      ...created,
      contractAddress: bufferToHexString(created.contractAddress),
    };
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
        transformRows: (rows) => {
          return rows.map((r) => ({
            ...r,
            contractAddress: bufferToHexString(r.contractAddress),
            owner: r.owner.map((o) => ({
              ...o,
              walletAddress: bufferToHexString(o.walletAddress),
            })),
          }));
        },
      },
    );
  }

  async findOne(contractAddress: string) {
    const project = await this.prisma.project.findFirstOrThrow({
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

    return {
      ...project,
      contractAddress: bufferToHexString(project.contractAddress),
    };
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

  // TODO: implement search and pagination feature and create dto
  async getBeneficiaries(address: string) {
    const select: Prisma.BeneficiarySelect = {
      uuid: true,
      name: true,
      bankStatus: true,
      internetStatus: true,
      phoneStatus: true,
      gender: true,
      latitude: true,
      longitude: true,
      walletAddress: true,
      tokensAssigned: true,
      tokensClaimed: true,
      isApproved: true,
    };

    const orderBy: Prisma.BeneficiaryOrderByWithRelationInput = {
      name: 'asc',
    };

    const where: Prisma.BeneficiaryWhereInput = {
      deletedAt: null,
      projects: {
        some: {
          contractAddress: hexStringToBuffer(address),
        },
      },
    };

    return paginate(
      this.prisma.beneficiary,
      {
        where,
        select,
        orderBy,
      },
      {
        page: 1,
        transformRows: (rows) =>
          rows.map((r) => ({
            ...r,
            walletAddress: bufferToHexString(r.walletAddress),
          })),
      },
    );
  }
}
