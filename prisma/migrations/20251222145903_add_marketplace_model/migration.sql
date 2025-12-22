-- CreateTable
CREATE TABLE "MarketplaceItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "domain" TEXT NOT NULL,
    "dr" INTEGER NOT NULL,
    "traffic" TEXT,
    "price" REAL NOT NULL,
    "niche" TEXT,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Available',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
