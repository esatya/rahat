import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'srso@mailinator.com' },
    update: {},
    create: {
      email: 'srso@mailinator.com',
      name: 'admin',
      role: ['admin'],
      password: 'T$mp9670',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
