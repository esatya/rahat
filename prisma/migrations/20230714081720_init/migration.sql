-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "BankStatus" AS ENUM ('UNKNOWN', 'UNBANKED', 'UNDERBANKED', 'BANKED');

-- CreateEnum
CREATE TYPE "PhoneOwnership" AS ENUM ('UNKNOWN', 'NO_PHONE', 'FEATURE', 'SMART');

-- CreateEnum
CREATE TYPE "InternetAccess" AS ENUM ('UNKNOWN', 'NO_INTERNET', 'PHONE_INTERNET', 'HOME_INTERNET');

-- CreateEnum
CREATE TYPE "TxStatus" AS ENUM ('NEW', 'PENDING', 'SUCCESS', 'FAIL', 'ERROR');

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
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "walletAddress" BYTEA,
    "profileImage" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "budget" INTEGER NOT NULL DEFAULT 0,
    "disbursed" INTEGER NOT NULL DEFAULT 0,
    "extras" JSONB,
    "location" TEXT,
    "projectType" TEXT,
    "projectManager" TEXT,
    "description" TEXT,
    "contractAddress" BYTEA,
    "deletedAt" TIMESTAMP(3),
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Beneficiary" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'UNKNOWN',
    "walletAddress" BYTEA,
    "phone" TEXT,
    "email" TEXT,
    "dob" TIMESTAMP(3),
    "isApproved" BOOLEAN NOT NULL,
    "address" JSONB NOT NULL,
    "tokensAssigned" INTEGER NOT NULL DEFAULT 0,
    "tokensClaimed" INTEGER NOT NULL DEFAULT 0,
    "bankStatus" "BankStatus" NOT NULL DEFAULT 'UNKNOWN',
    "phoneStatus" "PhoneOwnership" NOT NULL DEFAULT 'UNKNOWN',
    "internetStatus" "InternetAccess" NOT NULL DEFAULT 'UNKNOWN',
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

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
    "tokenBalance" INTEGER NOT NULL DEFAULT 0,
    "tokenPending" INTEGER NOT NULL DEFAULT 0,
    "tokenDisbursed" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Distributor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_transactions" (
    "id" SERIAL NOT NULL,
    "txHash" BYTEA NOT NULL,
    "txStatus" "TxStatus" NOT NULL DEFAULT 'NEW',
    "contractName" TEXT,
    "contractAddress" TEXT,
    "timestamp" INTEGER,
    "method" TEXT,
    "methodParams" JSONB[],
    "blockNumber" INTEGER,
    "from" TEXT,
    "to" TEXT,
    "value" TEXT,
    "remarks" TEXT,
    "events" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "tbl_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserProjects" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
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
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Project_contractAddress_key" ON "Project"("contractAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Beneficiary_uuid_key" ON "Beneficiary"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Beneficiary_walletAddress_key" ON "Beneficiary"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Distributor_walletAddress_key" ON "Distributor"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_transactions_txHash_key" ON "tbl_transactions"("txHash");

-- CreateIndex
CREATE UNIQUE INDEX "_UserProjects_AB_unique" ON "_UserProjects"("A", "B");

-- CreateIndex
CREATE INDEX "_UserProjects_B_index" ON "_UserProjects"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BeneficiaryProjects_AB_unique" ON "_BeneficiaryProjects"("A", "B");

-- CreateIndex
CREATE INDEX "_BeneficiaryProjects_B_index" ON "_BeneficiaryProjects"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectDistributors_AB_unique" ON "_ProjectDistributors"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectDistributors_B_index" ON "_ProjectDistributors"("B");

-- AddForeignKey
ALTER TABLE "_UserProjects" ADD CONSTRAINT "_UserProjects_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserProjects" ADD CONSTRAINT "_UserProjects_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BeneficiaryProjects" ADD CONSTRAINT "_BeneficiaryProjects_A_fkey" FOREIGN KEY ("A") REFERENCES "Beneficiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BeneficiaryProjects" ADD CONSTRAINT "_BeneficiaryProjects_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectDistributors" ADD CONSTRAINT "_ProjectDistributors_A_fkey" FOREIGN KEY ("A") REFERENCES "Distributor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectDistributors" ADD CONSTRAINT "_ProjectDistributors_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
