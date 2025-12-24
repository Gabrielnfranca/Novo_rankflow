-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "ga4PropertyId" TEXT,
ADD COLUMN     "googleAccessToken" TEXT,
ADD COLUMN     "googleRefreshToken" TEXT,
ADD COLUMN     "googleTokenExpiry" TIMESTAMP(3),
ADD COLUMN     "gscUrl" TEXT;
