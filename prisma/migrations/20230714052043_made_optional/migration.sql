/*
  Warnings:

  - Made the column `walletAddress` on table `Beneficiary` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Beneficiary" ALTER COLUMN "walletAddress" SET NOT NULL,
ALTER COLUMN "isApproved" DROP NOT NULL,
ALTER COLUMN "isApproved" SET DEFAULT false,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "tokensAssigned" DROP NOT NULL,
ALTER COLUMN "tokensClaimed" DROP NOT NULL,
ALTER COLUMN "bankStatus" DROP NOT NULL,
ALTER COLUMN "phoneStatus" DROP NOT NULL,
ALTER COLUMN "internetStatus" DROP NOT NULL,
ALTER COLUMN "latitude" DROP NOT NULL,
ALTER COLUMN "longitude" DROP NOT NULL;
