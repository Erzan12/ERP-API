-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "employee_type" "EmployeeType",
ADD COLUMN     "employment_type" "EmploymentType";

-- CreateTable
CREATE TABLE "EmployeeEvaluation" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "evaluator_id" UUID NOT NULL,
    "stage" "EvaluationStage" NOT NULL,
    "status" "EvaluationStatus" NOT NULL DEFAULT 'pending',
    "due_date" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,

    CONSTRAINT "EmployeeEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EmployeeEvaluation_evaluator_id_idx" ON "EmployeeEvaluation"("evaluator_id");

-- CreateIndex
CREATE INDEX "EmployeeEvaluation_employee_id_idx" ON "EmployeeEvaluation"("employee_id");

-- CreateIndex
CREATE INDEX "EmployeeEvaluation_stage_idx" ON "EmployeeEvaluation"("stage");

-- CreateIndex
CREATE INDEX "EmployeeEvaluation_status_idx" ON "EmployeeEvaluation"("status");

-- AddForeignKey
ALTER TABLE "EmployeeEvaluation" ADD CONSTRAINT "EmployeeEvaluation_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeEvaluation" ADD CONSTRAINT "EmployeeEvaluation_evaluator_id_fkey" FOREIGN KEY ("evaluator_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeEvaluation" ADD CONSTRAINT "EmployeeEvaluation_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeEvaluation" ADD CONSTRAINT "EmployeeEvaluation_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
