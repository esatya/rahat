/*
  Warnings:

  - You are about to drop the `Distributor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProjectDistributors` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProjectDistributors" DROP CONSTRAINT "_ProjectDistributors_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectDistributors" DROP CONSTRAINT "_ProjectDistributors_B_fkey";

-- DropTable
DROP TABLE "Distributor";

-- DropTable
DROP TABLE "_ProjectDistributors";

-- CreateTable
CREATE TABLE "Vendor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "walletAddress" BYTEA,
    "phone" TEXT,
    "email" TEXT,
    "address" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "tokenBalance" INTEGER NOT NULL DEFAULT 0,
    "tokenPending" INTEGER NOT NULL DEFAULT 0,
    "tokenDisbursed" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectVendors" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_walletAddress_key" ON "Vendor"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectVendors_AB_unique" ON "_ProjectVendors"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectVendors_B_index" ON "_ProjectVendors"("B");

-- AddForeignKey
ALTER TABLE "_ProjectVendors" ADD CONSTRAINT "_ProjectVendors_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectVendors" ADD CONSTRAINT "_ProjectVendors_B_fkey" FOREIGN KEY ("B") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
