/*
  Warnings:

  - You are about to alter the column `tokenBalance` on the `Distributor` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `tokenPending` on the `Distributor` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `tokenDisbursed` on the `Distributor` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Beneficiary" ALTER COLUMN "extra" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Distributor" ALTER COLUMN "tokenBalance" SET DATA TYPE INTEGER,
ALTER COLUMN "tokenPending" SET DATA TYPE INTEGER,
ALTER COLUMN "tokenDisbursed" SET DATA TYPE INTEGER;
