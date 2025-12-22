-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "color" TEXT DEFAULT '#000000',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Backlink" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "domain" TEXT NOT NULL,
    "dr" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "cost" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT,
    CONSTRAINT "Backlink_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Backlink" ("cost", "createdAt", "date", "domain", "dr", "id", "status", "type") SELECT "cost", "createdAt", "date", "domain", "dr", "id", "status", "type" FROM "Backlink";
DROP TABLE "Backlink";
ALTER TABLE "new_Backlink" RENAME TO "Backlink";
CREATE TABLE "new_ContentTask" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "column" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "dueDate" TEXT,
    "assignee" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT,
    CONSTRAINT "ContentTask_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ContentTask" ("assignee", "column", "createdAt", "dueDate", "id", "priority", "title") SELECT "assignee", "column", "createdAt", "dueDate", "id", "priority", "title" FROM "ContentTask";
DROP TABLE "ContentTask";
ALTER TABLE "new_ContentTask" RENAME TO "ContentTask";
CREATE TABLE "new_Keyword" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "term" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "previousPosition" INTEGER NOT NULL DEFAULT 0,
    "volume" TEXT,
    "difficulty" TEXT,
    "url" TEXT,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT,
    CONSTRAINT "Keyword_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Keyword" ("createdAt", "difficulty", "id", "position", "previousPosition", "term", "updatedAt", "url", "volume") SELECT "createdAt", "difficulty", "id", "position", "previousPosition", "term", "updatedAt", "url", "volume" FROM "Keyword";
DROP TABLE "Keyword";
ALTER TABLE "new_Keyword" RENAME TO "Keyword";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
