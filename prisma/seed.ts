import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length: number): string {
  let result = ' ';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

async function seed() {
  const users = await prisma.user.createMany({
    data: [
      {
        name: 'User 1',
        id: 1,
        email: 'user1@rahat.com',
      },
      {
        name: 'User 2',
        id: 2,
        email: 'user2@rahat.com',
      },
      {
        name: 'User 3',
        id: 3,
        email: 'user3@rahat.com',
      },
    ],
  });
  console.log('Users created:', users);

  const contractAddressBuffer = Buffer.from(generateString(10), 'hex');

  const data1 = [
    {
      name: 'Project 1',
      id: 1,
      startDate: 'today',
      endDate: 'tomorrow',
      owner: 1,
      budget: 1000,
      disbursed: 2000,
      extras: '{ target: 10 }',
      location: 'Kathmandu',
      projectType: 'Construction',
      projectManager: 'Balen Shah',
      description: 'Kathmandu to Pokhara highway road construction',
      contractAddress: 'contractAddressBuffer',
      deletedAt: 'After 2 weeks',
      isApproved: true,
    },
    {
      name: 'Project 2',
      id: 2,
      startDate: 'today',
      endDate: 'tomorrow',
      owner: 2,
      budget: 1000,
      disbursed: 2000,
      extras: '{ target: 10 }',
      location: 'Kathmandu',
      projectType: 'Consultancy',
      projectManager: 'Rameshwor Shah',
      description: 'IT Consultancy',
      contractAddress: 'contractAddressBuffer',
      deletedAt: 'After 2 weeks',
      isApproved: true,
    },
    {
      name: 'Project 3',
      id: 3,
      startDate: 'today',
      endDate: 'tomorrow',
      owner: 3,
      budget: 1000,
      disbursed: 2000,
      extras: '{ target: 10 }',
      location: 'Kathmandu',
      projectType: 'Development',
      projectManager: 'Tej Shah',
      description: 'Full stack development',
      contractAddress: 'contractAddressBuffer',
      deletedAt: 'After 2 weeks',
      isApproved: true,
    },
  ];
  const projects = await prisma.project.createMany({
    data: data1,
  });
  console.log('Projects created:', projects);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
