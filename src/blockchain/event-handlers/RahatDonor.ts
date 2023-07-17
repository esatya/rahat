import { PrismaService } from 'nestjs-prisma';

const _prisma = new PrismaService();
export const ChainActions = {
  TokenMintedAndApproved: async (params, txHash, txData) => {
    const test = await _prisma.beneficiary.findMany();
    console.log(test);
    console.log('TokenMintedAndApproved Event', txHash);
  },
};
