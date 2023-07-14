import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { paginate } from '@utils/paginate';
import { hexStringToBuffer } from '@utils/string-format';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUserDto } from './dto/list-user.dto';
import { RequestUserOtpDto, VerifyUserOtpDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    const walletAddress = hexStringToBuffer(createUserDto.walletAddress);

    return this.prisma.user.create({
      data: {
        ...createUserDto,
        walletAddress,
      },
    });
  }

  findAll(query: ListUserDto) {
    const { perPage, page, ...rest } = query;
    const where: Prisma.UserWhereInput = {
      deletedAt: null,
    };
    if (rest.name) {
      where.name = {
        contains: rest.name,
        mode: 'insensitive',
      };
    }

    return paginate(
      this.prisma.user,
      { where },
      {
        page,
        perPage,
      },
    );
  }

  findOne(id: number) {
    return this.prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const walletAddress = hexStringToBuffer(updateUserDto.walletAddress);
    return this.prisma.user.update({
      where: {
        id,
      },
      data: { ...updateUserDto, walletAddress },
    });
  }

  remove(id: number) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async requestOtp(requestOtpDto: RequestUserOtpDto) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        email: requestOtpDto.email,
      },
    });

    return {
      user,
      msg: 'Otp sent to the user email',
    };
  }

  async verifyOtp(verifyOtpDto: VerifyUserOtpDto) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        email: verifyOtpDto.email,
      },
    });

    return {
      user,
      token: 1234,
      // privateKey: PRIVATE_KEYS_ADMIN.privateKey,
    };
  }
}
