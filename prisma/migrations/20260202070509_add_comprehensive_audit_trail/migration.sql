-- CreateTable
CREATE TABLE "audit_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "user_email" TEXT,
    "employee_id" INTEGER,
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
    "department_id" INTEGER,
    "session_id" TEXT,
    "request_id" TEXT,
    "severity" TEXT DEFAULT 'INFO',
    "compliance_flag" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_employee_id_idx" ON "audit_logs"("employee_id");

-- CreateIndex
CREATE INDEX "audit_logs_resource_resource_id_idx" ON "audit_logs"("resource", "resource_id");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_department_id_idx" ON "audit_logs"("department_id");

-- CreateIndex
CREATE INDEX "audit_logs_session_id_idx" ON "audit_logs"("session_id");

-- CreateIndex
CREATE INDEX "audit_logs_success_idx" ON "audit_logs"("success");

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
