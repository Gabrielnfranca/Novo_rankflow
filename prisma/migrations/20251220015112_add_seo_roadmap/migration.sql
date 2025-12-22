-- CreateTable
CREATE TABLE "SeoRoadmapTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "taskKey" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "completedAt" DATETIME,
    CONSTRAINT "SeoRoadmapTask_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "SeoRoadmapTask_clientId_taskKey_key" ON "SeoRoadmapTask"("clientId", "taskKey");
