-- AlterTable
ALTER TABLE "DonePayments" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "payed_at" TIMESTAMP(3);
