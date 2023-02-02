/*
  Warnings:

  - You are about to drop the column `payed_at` on the `DonePayments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DonePayments" DROP COLUMN "payed_at",
ADD COLUMN     "paid_at" TIMESTAMP(3);
