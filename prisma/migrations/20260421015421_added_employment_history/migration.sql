-- CreateEnum
CREATE TYPE "EvaluationStage" AS ENUM ('third_month_evaluation', 'fifth_month_evaluation');

-- CreateEnum
CREATE TYPE "EvaluationStatus" AS ENUM ('for_evaluation', 'for_verification', 'for_approval', 'for_acknowledgment');

-- CreateTable
CREATE TABLE "EmploymentHistory" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "effective_date" TIMESTAMP(3) NOT NULL,
    "value_changed" TEXT NOT NULL,
    "from_val" TEXT NOT NULL,
    "to_val" TEXT NOT NULL,
    "from_date" TIMESTAMP(3) NOT NULL,
    "to_date" TIMESTAMP(3) NOT NULL,
    "remarks" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "evaluation_stage" "EvaluationStage" NOT NULL DEFAULT 'third_month_evaluation',
    "evaluation_status" "EvaluationStatus" NOT NULL DEFAULT 'for_evaluation',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmploymentHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EmploymentHistory" ADD CONSTRAINT "EmploymentHistory_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmploymentHistory" ADD CONSTRAINT "EmploymentHistory_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmploymentHistory" ADD CONSTRAINT "EmploymentHistory_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
