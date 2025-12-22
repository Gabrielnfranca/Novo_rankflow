/*
  Warnings:

  - Added the required column `updatedAt` to the `Backlink` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Backlink" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "domain" TEXT NOT NULL,
    "dr" INTEGER DEFAULT 0,
    "type" TEXT DEFAULT 'Nofollow',
    "cost" REAL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Prospecting',
    "dateSent" DATETIME,
    "owner" TEXT,
    "keyword" TEXT,
    "volume" TEXT,
    "intent" TEXT,
    "h1" TEXT,
    "title" TEXT,
    "metaDescription" TEXT,
    "anchorText" TEXT,
    "driveUrl" TEXT,
    "postUrl" TEXT,
    "targetUrl" TEXT,
    "followUpDate" DATETIME,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clientId" TEXT,
    CONSTRAINT "Backlink_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Backlink" ("clientId", "cost", "createdAt", "date", "domain", "dr", "id", "status", "type") SELECT "clientId", "cost", "createdAt", "date", "domain", "dr", "id", "status", "type" FROM "Backlink";
DROP TABLE "Backlink";
ALTER TABLE "new_Backlink" RENAME TO "Backlink";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
