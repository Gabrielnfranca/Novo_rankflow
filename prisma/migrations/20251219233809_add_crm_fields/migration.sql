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
    "contractDuration" TEXT,
    "startDate" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Client" ("color", "createdAt", "id", "name", "updatedAt", "url") SELECT "color", "createdAt", "id", "name", "updatedAt", "url" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
