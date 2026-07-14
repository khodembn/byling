/*
  Warnings:

  - You are about to drop the column `paymentMessage` on the `Campaign` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "paymentMessage";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "paymentCardHolder" TEXT,
ADD COLUMN     "paymentCardNumber" TEXT;
