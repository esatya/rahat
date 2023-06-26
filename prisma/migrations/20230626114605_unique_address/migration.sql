/*
  Warnings:

  - A unique constraint covering the columns `[contractAddress]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Project_contractAddress_key" ON "Project"("contractAddress");
