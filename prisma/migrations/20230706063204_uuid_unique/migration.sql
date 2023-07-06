/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Beneficiary` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Beneficiary_uuid_key" ON "Beneficiary"("uuid");
