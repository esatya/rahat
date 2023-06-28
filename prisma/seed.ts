import { Gender, PrismaClient } from '@prisma/client';
import { hexStringToBuffer } from '../src/utils/string-format';

const prisma = new PrismaClient();

async function seed() {
  // Create users
  const user1 = await prisma.user.create({
    data: {
      name: 'User 1',
      email: 'user1@rahat.com',
    },
  });
  const user2 = await prisma.user.create({
    data: {
      name: 'User 2',
      email: 'user2@rahat.com',
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

  // Create beneficiaries
  const beneficiary1 = await prisma.beneficiary.create({
    data: {
      name: 'Beneficiary 1',
      gender: Gender.Male,
      walletAddress: hexStringToBuffer(
        '0x881595732642f4D73884b2b1ea39D20Af1D3e888',
      ),
      address: {
        location: 'ktm',
      },
      extra: {
        hasInternet: true,
      },
      projects: {
        connect: { id: proj1.id },
      },
    },
  });
  const beneficiary2 = await prisma.beneficiary.create({
    data: {
      name: 'Beneficiary 2',
      gender: Gender.Female,
      walletAddress: hexStringToBuffer(
        '0xac0C1207D054a64FFc68830b0db2e17Fc1e93766',
      ),
      address: {
        location: 'ktm',
      },
      extra: {
        hasInternet: false,
      },
      projects: {
        connect: { id: proj2.id },
      },
    },
  });

  // Create distributors
  const distributor1 = await prisma.distributor.create({
    data: {
      name: 'Distributor 1',
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
  const distributor2 = await prisma.distributor.create({
    data: {
      name: 'Distributor 2',
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

  console.log({
    proj1,
    proj2,
    user1,
    user2,
    beneficiary1,
    beneficiary2,
    distributor1,
    distributor2,
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
