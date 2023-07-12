import {
  BankStatus,
  Gender,
  InternetAccess,
  PhoneOwnership,
  PrismaClient,
  TxStatus,
} from '@prisma/client';
import { hexStringToBuffer } from '../src/utils/string-format';

const prisma = new PrismaClient();

async function seed() {
  // Create users
  const user1 = await prisma.user.create({
    data: {
      name: 'User 1',
      email: 'user1@rahat.com',
      walletAddress: hexStringToBuffer(
        '0x422416b9203de06be4487D17DD1C76725c6049d7',
      ),
    },
  });
  const user2 = await prisma.user.create({
    data: {
      name: 'User 2',
      email: 'user2@rahat.com',
      walletAddress: hexStringToBuffer(
        '0x216EC842b77e424671219ABB817467fCEa991409',
      ),
    },
  });

  // Create projects
  const proj1 = await prisma.project.create({
    data: {
      name: 'Project 1',
      startDate: new Date(),
      endDate: new Date(),
      budget: 1000,
      disbursed: 2000,
      extras: { target: 10 },
      location: 'Kathmandu',
      projectType: 'Construction',
      projectManager: 'Balen Shah',
      description: 'Kathmandu to Pokhara highway road construction',
      contractAddress: hexStringToBuffer(
        '0x1B3799cC1F513b9fF0b63c36266b3F214295A900',
      ),
      isApproved: true,
      owner: {
        connect: {
          id: user1.id,
        },
      },
    },
  });
  const proj2 = await prisma.project.create({
    data: {
      name: 'Project 2',
      startDate: new Date(),
      endDate: new Date(),
      budget: 1000,
      disbursed: 2000,
      extras: { target: 10 },
      location: 'Kathmandu',
      projectType: 'Construction',
      projectManager: 'Manjik Shrestha',
      description: 'Kathmandu to New York highway road construction',
      contractAddress: hexStringToBuffer(
        '0xA82593bC6a9f5Ac3De17EEEB91240af019fF82C7',
      ),
      isApproved: true,
      owner: {
        connect: {
          id: user2.id,
        },
      },
    },
  });

  const beneficiary1 = [...Array(25)].map((_, index) => ({
    name: `Beneficiary ${index}`,
    gender: Gender.MALE,
    walletAddress: hexStringToBuffer(
      `0x${index}881595732642f4D73884b2b1ea39D20Af1D3e888`,
    ),
    isApproved: true,

    latitude: 27.713009571767344,
    longitude: 85.38533286023136,
    bankStatus: BankStatus.BANKED,
    internetStatus: InternetAccess.HOME_INTERNET,
    phoneStatus: PhoneOwnership.SMART,
    address: {
      location: 'ktm',
    },

    projects: {
      connect: { id: proj1.id },
    },
  }));

  for (const bens of beneficiary1) {
    await prisma.beneficiary.create({
      data: {
        ...bens,
      },
    });
  }
  const beneficiary2 = [...Array(20)].map((_, index) => ({
    name: `Beneficiary ${index + 19}`,
    gender: Gender.FEMALE,
    walletAddress: hexStringToBuffer(
      `0x${index * 5}81595732642f4D73884b2b1ea39D20Af1D3e888`,
    ),
    isApproved: false,

    latitude: 27.713009571767344,
    longitude: 85.38533286023136,
    bankStatus: BankStatus.UNDERBANKED,
    internetStatus: InternetAccess.PHONE_INTERNET,
    phoneStatus: PhoneOwnership.FEATURE,
    address: {
      location: 'ktm',
    },

    projects: {
      connect: { id: proj2.id },
    },
  }));

  for (const bens of beneficiary2) {
    await prisma.beneficiary.create({
      data: {
        ...bens,
      },
    });
  }

  // Create vendors
  const vendor1 = await prisma.vendor.create({
    data: {
      name: 'Vendor 1',
      walletAddress: hexStringToBuffer(
        '0x92b1DF3274DcF866621716D43bc18a5D67b78704',
      ),
      address: {
        location: 'ktm',
      },
      projects: {
        connect: { id: proj1.id },
      },
    },
  });
  const vendor2 = await prisma.vendor.create({
    data: {
      name: 'Vendor 2',
      walletAddress: hexStringToBuffer(
        '0xd1FD8ca9F40A3DD2aa212A6d89Ef5Ee68041D26c',
      ),
      address: {
        location: 'ktm',
      },
      projects: {
        connect: { id: proj2.id },
      },
    },
  });

  const transactions1 = [...Array(2)].map((_, index) => ({
    txHash: hexStringToBuffer(`0x${index}23182u3y12${index}`),
    txStatus: TxStatus.NEW,
  }));

  for (const trans of transactions1) {
    await prisma.transaction.create({
      data: {
        ...trans,
      },
    });
  }

  console.log({
    proj1,
    proj2,
    user1,
    user2,
    beneficiary1,
    beneficiary2,
    vendor1,
    vendor2,
    transactions1,
  });
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
