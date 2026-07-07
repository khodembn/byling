/*
  Warnings:

  - The values [READY_FOR_DELIVERY] on the enum `CampaignProductStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CampaignProductStatus_new" AS ENUM ('OPEN', 'THRESHOLD_REACHED', 'AWAITING_PAYMENT', 'REOPEN_THRESHOLD', 'PURCHASING', 'COMPLETED', 'CANCELLED');
ALTER TABLE "CampaignProduct" ALTER COLUMN "status" TYPE "CampaignProductStatus_new" USING ("status"::text::"CampaignProductStatus_new");
ALTER TYPE "CampaignProductStatus" RENAME TO "CampaignProductStatus_old";
ALTER TYPE "CampaignProductStatus_new" RENAME TO "CampaignProductStatus";
DROP TYPE "public"."CampaignProductStatus_old";
COMMIT;

-- AlterEnum
ALTER TYPE "CampaignStatus" ADD VALUE 'READY_FOR_DELIVERY';
