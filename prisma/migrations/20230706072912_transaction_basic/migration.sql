-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "txHash" BYTEA,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BeneficiaryTransactions" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_txHash_key" ON "Transaction"("txHash");

-- CreateIndex
CREATE UNIQUE INDEX "_BeneficiaryTransactions_AB_unique" ON "_BeneficiaryTransactions"("A", "B");

-- CreateIndex
CREATE INDEX "_BeneficiaryTransactions_B_index" ON "_BeneficiaryTransactions"("B");

-- AddForeignKey
ALTER TABLE "_BeneficiaryTransactions" ADD CONSTRAINT "_BeneficiaryTransactions_A_fkey" FOREIGN KEY ("A") REFERENCES "Beneficiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BeneficiaryTransactions" ADD CONSTRAINT "_BeneficiaryTransactions_B_fkey" FOREIGN KEY ("B") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
