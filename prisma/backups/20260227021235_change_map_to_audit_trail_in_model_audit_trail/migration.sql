/*
  Warnings:

  - You are about to drop the `audit_logs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_user_id_fkey";

-- DropTable
DROP TABLE "audit_logs";

-- CreateTable
CREATE TABLE "auditTrail" (
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

    CONSTRAINT "auditTrail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "auditTrail_user_id_idx" ON "auditTrail"("user_id");

-- CreateIndex
CREATE INDEX "auditTrail_employee_id_idx" ON "auditTrail"("employee_id");

-- CreateIndex
CREATE INDEX "auditTrail_resource_resource_id_idx" ON "auditTrail"("resource", "resource_id");

-- CreateIndex
CREATE INDEX "auditTrail_created_at_idx" ON "auditTrail"("created_at");

-- CreateIndex
CREATE INDEX "auditTrail_action_idx" ON "auditTrail"("action");

-- CreateIndex
CREATE INDEX "auditTrail_department_id_idx" ON "auditTrail"("department_id");

-- CreateIndex
CREATE INDEX "auditTrail_session_id_idx" ON "auditTrail"("session_id");

-- CreateIndex
CREATE INDEX "auditTrail_success_idx" ON "auditTrail"("success");

-- AddForeignKey
ALTER TABLE "auditTrail" ADD CONSTRAINT "auditTrail_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
