-- CreateTable
CREATE TABLE "ContentItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "keyword" TEXT,
    "status" TEXT NOT NULL DEFAULT 'IDEA',
    "h1" TEXT,
    "structure" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "deadline" DATETIME,
    "publicationDate" DATETIME,
    "author" TEXT,
    "clientId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ContentItem_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
