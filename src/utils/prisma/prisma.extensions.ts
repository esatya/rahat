import { Prisma } from '@prisma/client';

const _defineExtension = (params) => {
  return Prisma.defineExtension((prisma) =>
    prisma.$extends(PrismaLog()).$extends(params),
  );
};

const _writeOperations = [
  'create',
  'createMany',
  'delete',
  'update',
  'deleteMany',
  'updateMany',
  'upsert',
];

export const PrismaLog = () => {
  return Prisma.defineExtension((prisma) =>
    prisma.$extends({
      query: {
        $allModels: {
          async $allOperations({ operation, model, args, query }) {
            const start = performance.now();
            const result = await query(args);
            const end = performance.now();
            const time = end - start;
            console.log('---------------------->', time);
            return result;
          },
        },
      },
    }),
  );
};

export const PrismaTransaction = _defineExtension(
  (prisma: Prisma.DefaultPrismaClient) =>
    prisma.$extends({
      query: {
        transaction: {
          update({ operation, model, args, query }) {
            console.log('xxxx------', model);
            return query(args);
          },
        },
      },
    }),
);

export const PrismaWriteOperations = _defineExtension(
  (prisma: Prisma.DefaultPrismaClient) =>
    prisma.$extends({
      query: {
        $allModels: {
          $allOperations({ operation, model, args, query }) {
            if (_writeOperations.includes(operation)) {
              console.log('Write Operation');
            }
            return query(args);
          },
        },
      },
    }),
);
