/*
  Warnings:

  - The values [HONE_INTERNET] on the enum `INTERNET_STATUS` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "INTERNET_STATUS_new" AS ENUM ('UNKNOWN', 'NO_INTERNET', 'PHONE_INTERNET', 'HOME_INTERNET');
ALTER TABLE "Beneficiary" ALTER COLUMN "internetStatus" DROP DEFAULT;
ALTER TABLE "Beneficiary" ALTER COLUMN "internetStatus" TYPE "INTERNET_STATUS_new" USING ("internetStatus"::text::"INTERNET_STATUS_new");
ALTER TYPE "INTERNET_STATUS" RENAME TO "INTERNET_STATUS_old";
ALTER TYPE "INTERNET_STATUS_new" RENAME TO "INTERNET_STATUS";
DROP TYPE "INTERNET_STATUS_old";
ALTER TABLE "Beneficiary" ALTER COLUMN "internetStatus" SET DEFAULT 'UNKNOWN';
COMMIT;
