import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
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
      contractAddress: Buffer.from('123hjfhsnassc', 'hex'),
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
      contractAddress: Buffer.from('545123hjfhsnassc', 'hex'),
      isApproved: true,
      owner: {
        connect: {
          id: user2.id,
        },
      },
    },
  });

  console.log({
    proj1,
    proj2,
    user1,
    user2,
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
