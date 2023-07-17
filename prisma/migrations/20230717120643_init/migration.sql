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
CREATE TABLE "tbl_settings" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_beneficiaries" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "dob" TIMESTAMP(3),
    "gender" "Gender" NOT NULL DEFAULT 'UNKNOWN',
    "walletAddress" BYTEA,
    "address" TEXT,
    "longitude" DOUBLE PRECISION,
    "latitude" DOUBLE PRECISION,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "bankStatus" "BankStatus" NOT NULL DEFAULT 'UNKNOWN',
    "phoneOwnership" "PhoneOwnership" NOT NULL DEFAULT 'UNKNOWN',
    "internetAccess" "InternetAccess" NOT NULL DEFAULT 'UNKNOWN',
    "extras" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "tbl_beneficiaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_projects" (
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
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "tbl_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_vendors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "walletAddress" BYTEA,
    "phone" TEXT,
    "email" TEXT,
    "address" JSONB NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "tbl_vendors_pkey" PRIMARY KEY ("id")
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
    "events" JSONB[],

    CONSTRAINT "tbl_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "walletAddress" BYTEA,
    "profileImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "tbl_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BeneficiaryProjects" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_UserProjects" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ProjectDistributors" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_beneficiaries_uuid_key" ON "tbl_beneficiaries"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_projects_contractAddress_key" ON "tbl_projects"("contractAddress");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_vendors_walletAddress_key" ON "tbl_vendors"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_transactions_txHash_key" ON "tbl_transactions"("txHash");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_users_email_key" ON "tbl_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_users_walletAddress_key" ON "tbl_users"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "_BeneficiaryProjects_AB_unique" ON "_BeneficiaryProjects"("A", "B");

-- CreateIndex
CREATE INDEX "_BeneficiaryProjects_B_index" ON "_BeneficiaryProjects"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserProjects_AB_unique" ON "_UserProjects"("A", "B");

-- CreateIndex
CREATE INDEX "_UserProjects_B_index" ON "_UserProjects"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectDistributors_AB_unique" ON "_ProjectDistributors"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectDistributors_B_index" ON "_ProjectDistributors"("B");

-- AddForeignKey
ALTER TABLE "_BeneficiaryProjects" ADD CONSTRAINT "_BeneficiaryProjects_A_fkey" FOREIGN KEY ("A") REFERENCES "tbl_beneficiaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BeneficiaryProjects" ADD CONSTRAINT "_BeneficiaryProjects_B_fkey" FOREIGN KEY ("B") REFERENCES "tbl_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserProjects" ADD CONSTRAINT "_UserProjects_A_fkey" FOREIGN KEY ("A") REFERENCES "tbl_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserProjects" ADD CONSTRAINT "_UserProjects_B_fkey" FOREIGN KEY ("B") REFERENCES "tbl_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectDistributors" ADD CONSTRAINT "_ProjectDistributors_A_fkey" FOREIGN KEY ("A") REFERENCES "tbl_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectDistributors" ADD CONSTRAINT "_ProjectDistributors_B_fkey" FOREIGN KEY ("B") REFERENCES "tbl_vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
