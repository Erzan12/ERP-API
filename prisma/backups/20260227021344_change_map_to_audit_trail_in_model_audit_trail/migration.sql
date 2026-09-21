/*
  Warnings:

  - You are about to drop the `auditTrail` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "auditTrail" DROP CONSTRAINT "auditTrail_user_id_fkey";

-- DropTable
DROP TABLE "auditTrail";

-- CreateTable
CREATE TABLE "AuditTrail" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "user_email" TEXT,
    "employee_id" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resource_id" INTEGER,
    "old_values" JSONB,
    "new_values" JSONB,
    "change_fields" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ip_address" TEXT,
    "user_agent" TEXT,
    "endpoint" TEXT,
    "http_method" TEXT,
    "status_code" INTEGER,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "error_message" TEXT,
    "department_id" UUID,
    "session_id" TEXT,
    "request_id" TEXT,
    "severity" TEXT DEFAULT 'INFO',
    "compliance_flag" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditTrail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuditTrail_user_id_idx" ON "AuditTrail"("user_id");

-- CreateIndex
CREATE INDEX "AuditTrail_employee_id_idx" ON "AuditTrail"("employee_id");

-- CreateIndex
CREATE INDEX "AuditTrail_resource_resource_id_idx" ON "AuditTrail"("resource", "resource_id");

-- CreateIndex
CREATE INDEX "AuditTrail_created_at_idx" ON "AuditTrail"("created_at");

-- CreateIndex
CREATE INDEX "AuditTrail_action_idx" ON "AuditTrail"("action");

-- CreateIndex
CREATE INDEX "AuditTrail_department_id_idx" ON "AuditTrail"("department_id");

-- CreateIndex
CREATE INDEX "AuditTrail_session_id_idx" ON "AuditTrail"("session_id");

-- CreateIndex
CREATE INDEX "AuditTrail_success_idx" ON "AuditTrail"("success");

-- AddForeignKey
ALTER TABLE "AuditTrail" ADD CONSTRAINT "AuditTrail_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
