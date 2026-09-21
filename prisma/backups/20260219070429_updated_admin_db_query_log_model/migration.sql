-- CreateTable
CREATE TABLE "AdminDBQueryLog" (
    "id" UUID NOT NULL,
    "adminId" TEXT NOT NULL,
    "sql" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "executionMs" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL,
    "error_message" TEXT,

    CONSTRAINT "AdminDBQueryLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdminDBQueryLog_adminId_idx" ON "AdminDBQueryLog"("adminId");

-- CreateIndex
CREATE INDEX "AdminDBQueryLog_executedAt_idx" ON "AdminDBQueryLog"("executedAt");
