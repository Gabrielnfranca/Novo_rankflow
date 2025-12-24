/*
  Warnings:

  - Made the column `userId` on table `Client` required. This step will fail if there are existing NULL values in that column.

*/
-- Delete orphan clients
DELETE FROM "Client" WHERE "userId" IS NULL;

-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "userId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Client_userId_idx" ON "Client"("userId");
