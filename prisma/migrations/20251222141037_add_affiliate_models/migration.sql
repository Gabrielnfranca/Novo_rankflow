-- CreateTable
CREATE TABLE "AffiliateLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "commission" REAL,
    "clientId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AffiliateLink_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Earning" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "source" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "date" DATETIME NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Earning_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "color" TEXT DEFAULT '#000000',
    "status" TEXT NOT NULL DEFAULT 'Active',
    "monthlyValue" REAL DEFAULT 0,
    "annualRevenue" REAL DEFAULT 0,
    "contractDuration" TEXT,
    "startDate" DATETIME,
    "notes" TEXT,
    "cnpj" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "type" TEXT NOT NULL DEFAULT 'Client',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Client" ("address", "annualRevenue", "cnpj", "color", "contractDuration", "createdAt", "email", "id", "monthlyValue", "name", "notes", "phone", "startDate", "status", "updatedAt", "url") SELECT "address", "annualRevenue", "cnpj", "color", "contractDuration", "createdAt", "email", "id", "monthlyValue", "name", "notes", "phone", "startDate", "status", "updatedAt", "url" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
