-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Others', 'Unknown');

-- CreateTable
CREATE TABLE "AppSettings" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Beneficiary" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'Unknown',
    "walletAddress" BYTEA,
    "phone" TEXT,
    "email" TEXT,
    "address" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "tokensAssigned" INTEGER NOT NULL DEFAULT 0,
    "tokensClaimed" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "extra" JSONB NOT NULL,

    CONSTRAINT "Beneficiary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Distributor" (
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
    "tokenBalance" BIGINT NOT NULL DEFAULT 0,
    "tokenPending" BIGINT NOT NULL DEFAULT 0,
    "tokenDisbursed" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "Distributor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BeneficiaryProjects" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ProjectDistributors" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Beneficiary_walletAddress_key" ON "Beneficiary"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Distributor_walletAddress_key" ON "Distributor"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "_BeneficiaryProjects_AB_unique" ON "_BeneficiaryProjects"("A", "B");

-- CreateIndex
CREATE INDEX "_BeneficiaryProjects_B_index" ON "_BeneficiaryProjects"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectDistributors_AB_unique" ON "_ProjectDistributors"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectDistributors_B_index" ON "_ProjectDistributors"("B");

-- AddForeignKey
ALTER TABLE "_BeneficiaryProjects" ADD CONSTRAINT "_BeneficiaryProjects_A_fkey" FOREIGN KEY ("A") REFERENCES "Beneficiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BeneficiaryProjects" ADD CONSTRAINT "_BeneficiaryProjects_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectDistributors" ADD CONSTRAINT "_ProjectDistributors_A_fkey" FOREIGN KEY ("A") REFERENCES "Distributor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectDistributors" ADD CONSTRAINT "_ProjectDistributors_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
