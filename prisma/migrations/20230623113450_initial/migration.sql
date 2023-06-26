-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "walletAddress" BYTEA,
    "profileImage" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "owner" INTEGER NOT NULL DEFAULT 1,
    "budget" INTEGER NOT NULL DEFAULT 0,
    "disbursed" INTEGER NOT NULL DEFAULT 0,
    "extras" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "projectType" TEXT NOT NULL,
    "projectManager" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "deletedAt" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Project_name_key" ON "Project"("name");
