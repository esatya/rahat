import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { paginate } from '@utils/paginate';
import { bufferToHexString, hexStringToBuffer } from '@utils/string-format';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { ListVendorDto } from './dto/list-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Injectable()
export class VendorsService {
  constructor(private prisma: PrismaService) {}

  create(createVendorDto: CreateVendorDto) {
    const { walletAddress, name, address } = createVendorDto;
    const vendorCreateInput = {
      walletAddress: hexStringToBuffer(walletAddress),
      name,
      address: JSON.stringify(address),
    };
    return this.prisma.vendor.create({
      data: vendorCreateInput,
    });
  }

  findAll(query: ListVendorDto) {
    const { page, perPage, ...rest } = query;

    const where: Prisma.VendorWhereInput = { deletedAt: null };
    if (rest.name) {
      where.name = {
        contains: rest.name,
        mode: 'insensitive',
      };
    }
    const include: Prisma.VendorInclude = {
      _count: {
        select: {
          projects: true,
        },
      },
      // projects: {
      //   select: {
      //     name: true,
      //     id: true,
      //   },
      // },
    };

    return paginate(
      this.prisma.vendor,
      { where, include },
      {
        page,
        perPage,
        transformRows: (rows) =>
          rows.map((r) => ({
            ...r,
            walletAddress: bufferToHexString(r.walletAddress),
          })),
      },
    );
  }

  async findOne(walletAddress: string) {
    const data = await this.prisma.vendor.findUniqueOrThrow({
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

    return {
      ...data,
      walletAddress: bufferToHexString(data.walletAddress),
    };
  }

  update(walletAddress: string, updateVendorDto: UpdateVendorDto) {
    return this.prisma.vendor.update({
      where: {
        walletAddress: hexStringToBuffer(walletAddress),
      },
      data: {
        ...updateVendorDto,
        walletAddress: hexStringToBuffer(updateVendorDto.walletAddress),
      },
    });
  }

  remove(walletAddress: string) {
    return this.prisma.vendor.update({
      where: {
        walletAddress: hexStringToBuffer(walletAddress),
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  approval(walletAddress: string) {
    return this.prisma.vendor.update({
      where: {
        walletAddress: hexStringToBuffer(walletAddress),
      },
      data: {
        isActive: true,
      },
    });
  }

  register(registerVendorDto: any) {
    return 'This registers vendors';
  }
}
