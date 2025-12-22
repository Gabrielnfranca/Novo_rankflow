-- AlterTable
ALTER TABLE "Client" ADD COLUMN "address" TEXT;
ALTER TABLE "Client" ADD COLUMN "annualRevenue" REAL DEFAULT 0;
ALTER TABLE "Client" ADD COLUMN "cnpj" TEXT;
ALTER TABLE "Client" ADD COLUMN "email" TEXT;
ALTER TABLE "Client" ADD COLUMN "phone" TEXT;
